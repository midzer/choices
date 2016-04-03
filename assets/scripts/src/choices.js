'use strict';

import { createStore } from 'redux';
import choices from './reducers/index.js';
import { addItemToStore, removeItemFromStore, selectItemFromStore } from './actions/index';
import { hasClass, wrap, getSiblings, isType, strToEl } from './lib/utils.js';


/**

    TODO:
    - State handling
    - Dynamically set input width to contents
    - Handle select input
    - Handle multiple select input ?

 */

export class Choices {
    constructor(options) {
        const fakeEl = document.createElement("fakeel");
        const userOptions = options || {};
        const store = createStore(choices);
        const defaultOptions = {
            element: document.querySelector('[data-choice]'),
            disabled: false,
            addItems: true,
            removeItems: true,
            editItems: false,
            maxItems: false,
            delimiter: ',',
            allowDuplicates: true,
            regexFilter: false,
            debug: false,
            placeholder: false,
            prependValue: false,
            appendValue: false,
            selectAll: true,
            callbackOnInit: function() {},
            callbackOnRender: function() {},
            callbackOnRemoveItem: function() {},
            callbackOnAddItem: function() {}
        };

        // Merge options with user options
        this.options = this.extend(defaultOptions, userOptions || {});
        this.store = store;

        this.initialised = false;
        this.supports = 'querySelector' in document && 'addEventListener' in document && 'classList' in fakeEl;

        // Retrieve triggering element (i.e. element with 'data-choice' trigger)
        this.element = this.options.element;

        // If input already has values, parse the array, otherwise create a blank array
        // Hmm, this should really map this.store
        this.valueArray = this.element.value !== '' ? this.cleanInputValue(this.element.value) : [];

        // How many values in array
        this.valueCount = this.valueArray.length;

        // Bind methods
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);

        this.init();
    }

    cleanInputValue(value) {
        // Remove spaces and split with delimiter
        return value.replace(/\s/g, '').split(this.options.delimiter);
    }

    /**
     * Merges unspecified amount of objects into new object
     * @private
     * @return {Object} Merged object of arguments
     */
    extend() {
        let extended = {};
        let length = arguments.length;

        /**
         * Merge one object into another
         * @param  {Object} obj  Object to merge into extended object
         */
        let merge = function(obj) {
            for (let prop in obj) {
                extended[prop] = obj[prop];
            }
        };

        // Loop through each passed argument
        for (let i = 0; i < length; i++) {
            // store argument at position i
            let obj = arguments[i];

            // If we are in fact dealing with an object, merge it. Otherwise throw error
            if (isType('Object', obj)) {
                merge(obj);
            } else {
                console.error('Custom options must be an object');
            }
        }

        return extended;
    };

    /* State */

    isOpen() {

    }

    isDisabled() {

    }

    isEmpty() {
        return (this.valueCount.length === 0) ? true : false; 
    }

    clearInput() {
        if (this.input.value) this.input.value = '';
    }

    /* Event handling */

    onKeyUp(e) {
    }

    onKeyDown(e) {
        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const deleteKey = 8 || 46;
        const enterKey = 13;
        const aKey = 65;

        // If we are typing in the input
        if(e.target === this.input) {
            // If CTRL + A or CMD + A have been pressed and there are items to select
            if (ctrlDownKey && e.keyCode === aKey && this.list && this.list.children) {
                let handleSelectAll = () => {
                    if(this.options.removeItems && !this.input.value && this.options.selectAll) {
                        this.selectAll(this.list.children);
                    }
                };

                handleSelectAll();
            }

            // If enter key is pressed and the input has a value
            if (e.keyCode === enterKey && e.target.value) {
                let value = this.input.value;

                let handleEnter = () => {
                    let canUpdate = true;

                    // If there is a max entry limit and we have reached that limit
                    // don't update
                    if (this.options.maxItems && this.options.maxItems <= this.list.children.length) {
                        canUpdate = false;
                    }

                    // If no duplicates are allowed, and the value already exists
                    // in the array, don't update
                    if (this.options.allowDuplicates === false && this.element.value) {
                        if (this.valueArray.indexOf(value) > -1) {
                            canUpdate = false;
                        }
                    }

                    // All is good, update
                    if (canUpdate) {
                        if(this.element.type === 'text') {
                            let canAddItem = true;

                            // If a user has supplied a regular expression filter
                            if(this.options.regexFilter) {
                                // Determine whether we can update based on whether 
                                // our regular expression passes 
                                canAddItem = this.regexFilter(value);
                            }
                            
                            // All is good, add
                            if(canAddItem) {
                                this.addItem(this.list, value);
                                this.updateInputValue(value);
                                this.clearInput(this.element);
                            }
                        }
                        
                    }
                };

                handleEnter();
            } 
        }

        // If backspace or delete key is pressed and the input has no value
        if (e.keyCode === deleteKey && !e.target.value) {

            let handleBackspaceKey = () => {
                if(this.options.removeItems) {
                    let currentListItems = this.list.querySelectorAll('.choices__item');
                    let selectedItems = this.list.querySelectorAll('.is-selected');
                    let lastItem = currentListItems[currentListItems.length - 1];

                    if(lastItem && !this.options.editItems) {
                        this.selectItem(lastItem);
                    }

                    // If editing the last item is allowed and there is a last item and 
                    // there are not other selected items (minus the last item), we can edit
                    // the item value. Otherwise if we can remove items, remove all items
                    if(this.options.editItems && lastItem && selectedItems.length === 1) {
                        this.input.value = lastItem.innerHTML;
                        this.removeItem(lastItem);
                    } else {
                        this.removeAll(currentListItems);
                    }
                }
            };

            handleBackspaceKey();

            e.preventDefault();
        }
    }

    onClick(e) {
        if(e.target.tagName === 'LI') {
            let item = e.target;

            let handleClick = (item) => { 
                let passedId = item.getAttribute('data-choice-id');
                let items = this.list.children;

                // We only want to select one item with a click
                // so we unselect any items that aren't the target
                for (var i = 0; i < items.length; i++) {
                    let singleItem = items[i];
                    let id = singleItem.getAttribute('data-choice-id');;

                    if(id === passedId && !singleItem.classList.contains('is-selected')) {
                        this.selectItem(singleItem);
                    } else {
                        this.unselectItem(singleItem);
                    }
                }          
            }
            
            handleClick(item);
        }
    }

    /* Methods */
    setValue() {}

    getValue() {}

    getValues() {}

    regexFilter(value) {
        let expression = new RegExp(this.options.regexFilter, 'i');
        let passesTest = expression.test(value);

        return passesTest;
    }

    selectItem(item) {
        let id = item.getAttribute('data-choice-id');
        item.classList.add('is-selected');
        this.store.dispatch(selectItemFromStore(id, true));
        console.log(this.store.getState());
    }

    unselectItem(item) {
        let id = item.getAttribute('data-choice-id');
        item.classList.remove('is-selected');
        this.store.dispatch(selectItemFromStore(id, false));
        console.log(this.store.getState());
    }

    selectAll(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            this.selectItem(item);
        };
    }

    updateInputValue(value) {
        if (this.options.debug) console.debug('Update input value');

        // Push new value to array
        this.valueArray.push(value);

        // Caste array to string and set it as the hidden inputs value
        this.element.value = this.valueArray.join(this.options.delimiter);
    }

    removeInputValue(value) {
        if (this.options.debug) console.debug('Remove input value');

        let index = this.valueArray.indexOf(value);
        this.valueArray.splice(index, 1);

        this.element.value = this.valueArray.join(this.options.delimiter);
    }

    addItem(parent, value) {
        if (this.options.debug) console.debug('Add item');

        let passedValue = value;

        // If a prepended value has been passed, prepend it
        if(this.options.prependValue) {
            passedValue = this.options.prependValue + passedValue.toString();
        }

        // If an appended value has been passed, append it
        if(this.options.appendValue) {
            passedValue = passedValue + this.options.appendValue.toString();
        }

        let id = this.store.getState().length + 1;

        // Create new list element 
        let item = strToEl(`<li class="choices__item" data-choice-id=${id}>${passedValue}</li>`);

        // Append it to list
        parent.appendChild(item);

        // Run callback if it is a function
        if(this.options.callbackOnAddItem){
            if(isType('Function', this.options.callbackOnAddItem)) {
                this.options.callbackOnAddItem(item, value);
            } else {
                console.error('callbackOnAddItem: Callback is not a function');
            }
        }

        this.store.dispatch(addItemToStore(passedValue, item, id));
        console.log(this.store.getState());
    }

    removeItem(item) {
        if(!item) {
            console.error('removeItem: No item was passed to be removed');
            return;
        }

        let id = item.getAttribute('data-choice-id');
        let value = item.innerHTML;
        item.parentNode.removeChild(item);

        // Run callback
        if(this.options.callbackOnRemoveItem){
            if(isType('Function', this.options.callbackOnRemoveItem)) {
                this.options.callbackOnRemoveItem(value);
            } else {
                console.error('callbackOnRemoveItem: Callback is not a function');
            }
        }

        this.store.dispatch(removeItemFromStore(id));
        console.log(this.store.getState());
    }

    removeAll(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item.classList.contains('is-selected')) {
                this.removeItem(item);
                this.removeInputValue(item.textContent);
            }
        };
    }

    init() {
        if (!this.supports) console.error('init: Your browser doesn\'nt support shit');
        this.initialised = true;
        this.render(this.element);
    }

    renderTextInput() {
        /* 
            Template:

            <div class="choices choices--active">
                <div class="choices__inner">
                    <input id="1" type="text" data-choice="" class="choices__input choices__input--hidden" tabindex="-1" style="display:none;" aria-hidden="true">
                    <ul class="choices__list choices__list--items"></ul>
                    <input type="text" class="choices__input choices__input--cloned">
                </div>
            </div>
        */

        let containerOuter = strToEl('<div class="choices choices--active"></div>');
        let containerInner = strToEl('<div class="choices__inner"></div>');

        // Hide passed input
        this.element.classList.add('choices__input', 'choices__input--hidden');
        this.element.tabIndex = '-1';
        this.element.setAttribute('style', 'display:none;');
        this.element.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.element, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        let list = strToEl('<ul class="choices__list choices__list--items"></ul>');
        let input = strToEl('<input type="text" class="choices__input choices__input--cloned">');

        if (input.placeholder) {
            input.placeholder = this.element.placeholder;
        }

        if(!this.options.addItems) {
            input.disabled = true;
        }

        containerInner.appendChild(list);
        containerInner.appendChild(input);
        containerOuter.appendChild(containerInner);

        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.list = list;

        if (this.element.value !== '') {
            // Add any preset values
            this.valueArray.forEach((value) => {
                this.addItem(this.list, value);
            });
        }

        // Trigger event listeners 
        document.addEventListener('keydown', this.onKeyDown);
        this.list.addEventListener('click', this.onClick);
    }


    render() {
        if (this.options.debug) console.debug('Render');

        switch (this.element.type) {
            case "text":
                this.renderTextInput();
                break;
            case "select-one":
                // this.renderSelectInput();
                break;
            case "select-multiple":
                // this.renderMultipleSelectInput();
                break;
            default:
                this.renderTextInput();
                break;
        }

    }

    destroy() {
        this.options = null;
        this.element = null;
        this.initialised = null;
        this.removeEventListeners(this.input);
    }
};

(function(){
    let input1 = document.getElementById(1);
    let input2 = document.getElementById(2);
    let input3 = document.getElementById(3);
    let input4 = document.getElementById(4);
    let input5 = document.getElementById(5);

    let choices1 = new Choices({
        element : input1,
        // delimiter: ' ',
        // maxItems: 5,
        // callbackOnRemoveItem: function(value) {
        //     console.log(value);
        // },
        // callbackOnAddItem: function(item, value) {
        //     console.log(item, value);
        // }
    });

    // let choices2 = new Choices({
    //     element : input2,
    //     allowDuplicates: false,
    //     editItems: true,
    // });

    // let choices3 = new Choices({
    //     element : input3,
    //     allowDuplicates: false,
    //     editItems: true,
    //     regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // });

    // let choices4 = new Choices({
    //     element : input4,
    //     addItems: false
    // });

    // let choices5 = new Choices({
    //     element: input5,
    //     prependValue: 'item-',
    //     appendValue: `-${Date.now()}`
    // });
})();