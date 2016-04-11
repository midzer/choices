'use strict';

import { createStore } from 'redux';
import items from './reducers/index.js';
import { addItemToStore, removeItemFromStore, selectItemFromStore } from './actions/index';
import { hasClass, wrap, getSiblings, isType, strToEl, extend } from './lib/utils.js';

export class Choices {
    constructor(element = '[data-choice]', options) {
        const fakeEl = document.createElement("fakeel");
        const userOptions = options || {};

        // If there are multiple elements, create a new instance 
        // for each element besides the first one (as that already has an instance)
        if(isType('String', element)) {
            let elements = document.querySelectorAll(element);
            if(elements.length > 1) {
                for (let i = 1; i < elements.length; i++) {
                    let el = elements[i];
                    new Choices(el, options);
                }
            }
        }

        const defaultOptions = {
            items: [],
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
            classNames: {
                containerOuter: 'choices',
                containerInner: 'choices__inner',
                input: 'choices__input',
                inputCloned: 'choices__input--cloned',
                list: 'choices__list',
                listItems: 'choices__list--items',
                listDropdown: 'choices__list--dropdown',
                item: 'choices__item',
                itemSelectable: 'choices__item--selectable',
                activeState: 'is-active',
                disabledState: 'is-disabled',
                hiddenState: 'is-hidden',
                selectedState: 'is-selected'
            },
            callbackOnInit: function() {},
            callbackOnRender: function() {},
            callbackOnRemoveItem: function() {},
            callbackOnAddItem: function() {}
        };

        // Initial instance state
        this.initialised = false;

        // Merge options with user options
        this.options = extend(defaultOptions, userOptions || {});

        // Create data store
        this.store = createStore(items);

        // Cutting the mustard
        this.supports = 'querySelector' in document && 'addEventListener' in document && 'classList' in fakeEl;

        // Retrieve triggering element (i.e. element with 'data-choice' trigger)
        this.passedElement = isType('String', element) ? document.querySelector(element) : element;

        // Set preset items - this looks out of place
        this.presetItems = [];
        if(this.options.items.length) {
            this.presetItems = this.options.items;
        } else if(this.passedElement.value !== '') {
            this.presetItems = this.passedElement.value.split(this.options.delimiter);
        }

        // Bind methods
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
        this.destroy = this.destroy.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onFocus = this.onFocus.bind(this);

        // Let's have it large
        this.init();
    }

    /* State tests */

    /** 
     * Whether input is disabled
     * @return {Boolean}
     */
    isDisabled() {
        return (this.input.disabled) ?  true : false;
    }

    /** 
     * Whether there are no values
     * @return {Boolean}
     */
    isEmpty() {
        return (this.store.getState().length === 0) ? true : false; 
    }

    /* Event handling */

    /** 
     * Handle keydown event 
     * @param  {Object} e Event
     * @return
     */
    onKeyDown(e) {
        const storeValues = this.store.getState();
        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const deleteKey = 8 || 46;
        const enterKey = 13;
        const aKey = 65;

        // If we are typing in the input
        if(e.target === this.input) {

            // If CTRL + A or CMD + A have been pressed and there are items to select
            if (ctrlDownKey && e.keyCode === aKey && this.list && this.list.children) {
                let handleSelectAll = () => {
                    if(this.options.removeItems && !this.input.value && this.options.selectAll && this.input === document.activeElement) {
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
                    if (this.options.allowDuplicates === false && this.passedElement.value) {
                        canUpdate = !storeValues.some((item) => {
                            return item.value === value;
                        });
                    }

                    // All is good, update
                    if (canUpdate && this.options.addItems) {
                        if(this.passedElement.type === 'text') {
                            let canAddItem = true;

                            // If a user has supplied a regular expression filter
                            if(this.options.regexFilter) {
                                // Determine whether we can update based on whether 
                                // our regular expression passes 
                                canAddItem = this.regexFilter(value);
                            }
                            
                            // All is good, add
                            if(canAddItem) {
                                this.addItem(value);
                                this.clearInput(this.passedElement);
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
                    let currentListItems = this.list.querySelectorAll('[data-choice-item]');
                    let selectedItems = this.list.querySelectorAll(this.options.classNames.selectedState);
                    let lastItem = currentListItems[currentListItems.length - 1];
                    let inputIsFocussed = this.input === document.activeElement;

                    if(lastItem && !this.options.editItems && inputIsFocussed && this.options.removeItems) {
                        this.selectItem(lastItem);
                    }

                    // If editing the last item is allowed and there is a last item and 
                    // there are not other selected items (minus the last item), we can edit
                    // the item value. Otherwise if we can remove items, remove all items
                    if(this.options.removeItems && this.options.editItems && lastItem && selectedItems.length === 0 && inputIsFocussed) {
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


    /** 
     * Handle click event 
     * @param  {Object} e Event
     * @return
     */
    onClick(e) {
        // If click is affecting a child node of our element
        if(this.containerOuter.contains(e.target)) {
            if(e.target.hasAttribute('data-choice-item')) {
                let item = e.target;

                let handleClick = (item) => {
                    if(this.options.removeItems) {
                        let passedId = item.getAttribute('data-choice-id');
                        let items = this.list.children;

                        // We only want to select one item with a click
                        // so we deselect any items that aren't the target
                        for (var i = 0; i < items.length; i++) {
                            let singleItem = items[i];
                            let id = singleItem.getAttribute('data-choice-id');;

                            if(id === passedId && !singleItem.classList.contains(this.options.classNames.selectedState)) {
                                this.selectItem(singleItem);
                            } else {
                                this.deselectItem(singleItem);
                            }
                        }  
                    }
                }
                
                handleClick(item);
            }


            if(e.target.hasAttribute('data-choice-selectable')) {
                let item = e.target;
                let value = e.target.getAttribute('data-choice-value');
                this.addItem(value);
            }
        } else if(this.dropdown && this.dropdown.classList.contains(this.options.classNames.activeState)) {
            this.toggleDropdown();
        }
        
    }

    onFocus(e) {
        if(this.dropdown) {
            this.toggleDropdown();
        }
    }

    /* Methods */

    /** 
     * Set value of input to blank
     * @return
     */
    clearInput() {
        if (this.input.value) this.input.value = '';
    }

    /**
     * Tests value against a regular expression
     * @param  {string} value Value to test
     * @return {Boolean}       Whether test passed/failed
     */
    regexFilter(value) {
        let expression = new RegExp(this.options.regexFilter, 'i');
        let passesTest = expression.test(value);

        return passesTest;
    }

    /** 
     * Get Element based on a given value
     * @param  {String} value Value to search for
     * @return {Element}       First Element with given value
     */
    getItemByValue(value) {
        let state = this.store.getState()
        
        let stateObject = state.find((item) => {
            return item.value === value;
        });

        let item = this.list.querySelector(`[data-choice-id='${stateObject.id}']`) 

        return item;
    }

    /**
     * Select item (a selected item can be deleted)
     * @param  {Element} item Element to select
     * @return
     */
    selectItem(item) {
        let id = item.getAttribute('data-choice-id');
        this.store.dispatch(selectItemFromStore(id, true));
    }

    /** 
     * Deselect item
     * @param  {Element} item Element to de-select
     * @return
     */
    deselectItem(item) {
        let id = item.getAttribute('data-choice-id');
        this.store.dispatch(selectItemFromStore(id, false));
    }

    /**
     * Select items within array
     * @param  {Array} items Array of items to select
     * @return
     */
    selectAll(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            this.selectItem(item);
        };
    }

    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     */
    addItem(value) {
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

        // Generate unique id
        let id = this.store.getState().length + 1;

        // Close dropdown
        if(this.dropdown && this.dropdown.classList.contains('is-active')) {
            this.toggleDropdown();    
        }

        // Run callback if it is a function
        if(this.options.callbackOnAddItem){
            if(isType('Function', this.options.callbackOnAddItem)) {
                this.options.callbackOnAddItem(id, value);
            } else {
                console.error('callbackOnAddItem: Callback is not a function');
            }
        }

        this.store.dispatch(addItemToStore(passedValue, id));
    }

    /**
     * Remove item from store
     * @param
     */
    removeItem(itemOrValue) {
        if(!itemOrValue) {
            console.error('removeItem: No item or value was passed to be removed');
            return;
        }

        // We are re-assigning a variable here. Probably shouldn't be doing that...
        let item;

        if(itemOrValue.nodeType) {
            item = itemOrValue;
        } else {
            for (var i = this.list.children.length - 1; i >= 0; i--) {
                let listItem = this.list.children[i];
                if(listItem.innerHTML === itemOrValue.toString()) {
                    item = listItem;
                    break;
                }
            }
        }

        if(item) {
            let id = item.getAttribute('data-choice-id');
            let value = item.innerHTML;

            // Run callback
            if(this.options.callbackOnRemoveItem){
                if(isType('Function', this.options.callbackOnRemoveItem)) {
                    this.options.callbackOnRemoveItem(value);
                } else {
                    console.error('callbackOnRemoveItem: Callback is not a function');
                }
            }

            this.store.dispatch(removeItemFromStore(id));
        } else {
            console.error('Item not found');        
        }
        
    }

    /**
     * Remove all items from array
     * @param  {Array} items Items to remove from store
     * @return
     */
    removeAll(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item.classList.contains('is-selected')) {
                this.removeItem(item);
            }
        };
    }

    toggleDropdown() {
        if(!this.dropdown) {
            console.error('No dropdown set');
            return;
        }

        const isActive = this.dropdown.classList.contains('is-active');

        this.dropdown.classList[isActive ? 'remove' : 'add']('is-active');
    }

    addItemToDropdown(value) {
        const dropdownItem = strToEl(`<li class="${ this.options.classNames.item } ${ this.options.classNames.itemSelectable }" data-choice-selectable data-choice-value="${value}">${value}</li>`);        
        this.dropdown.appendChild(dropdownItem);
    }
    
    /* Rendering */

    /**
     * Create DOM structure around passed text element
     * @return
     */
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

        let containerOuter = strToEl(`<div class="${ this.options.classNames.containerOuter }"></div>`);
        let containerInner = strToEl(`<div class="${ this.options.classNames.containerInner }"></div>`);

        // Hide passed input
        this.passedElement.classList.add(this.options.classNames.input, this.options.classNames.hiddenState);
        this.passedElement.tabIndex = '-1';
        this.passedElement.setAttribute('style', 'display:none;');
        this.passedElement.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.passedElement, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        let list = strToEl(`<ul class="${ this.options.classNames.list } ${ this.options.classNames.listItems }"></ul>`);
        let input = strToEl(`<input type="text" class="${ this.options.classNames.input } ${ this.options.classNames.inputCloned }">`);

        if (this.passedElement.placeholder) {
            input.placeholder = this.passedElement.placeholder;
        }

        if(!this.options.addItems) {
            input.disabled = true;
            containerOuter.classList.add(this.options.classNames.disabledState);
        }

        containerOuter.appendChild(containerInner);
        containerInner.appendChild(list);
        containerInner.appendChild(input);
        
        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.list = list;

        // Add any preset values seperated by delimiter
        this.presetItems.forEach((value) => {
            this.addItem(value);
        });

        // Subscribe to store
        this.store.subscribe(this.render);

        // Render any items
        this.render();

        // Trigger event listeners 
        this.addEventListeners();
    }

    /**
     * Create DOM structure around passed select element
     * @return
     */
    renderMultipleSelectInput() {
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

        let containerOuter = strToEl(`<div class="${ this.options.classNames.containerOuter }"></div>`);
        let containerInner = strToEl(`<div class="${ this.options.classNames.containerInner }"></div>`);

        // Hide passed input
        this.passedElement.classList.add(this.options.classNames.input, this.options.classNames.hiddenState);
        this.passedElement.tabIndex = '-1';
        this.passedElement.setAttribute('style', 'display:none;');
        this.passedElement.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.passedElement, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        let list = strToEl(`<ul class="${ this.options.classNames.list } ${ this.options.classNames.listItems }"></ul>`);
        let input = strToEl(`<input type="text" class="${ this.options.classNames.input } ${ this.options.classNames.inputCloned }">`);
        let dropdown = strToEl(`<div class="${ this.options.classNames.list } ${ this.options.classNames.listDropdown }"></div>`);

        if (input.placeholder) {
            input.placeholder = this.passedElement.placeholder;
        }

        if(!this.options.addItems) {
            input.disabled = true;
        }

        containerOuter.appendChild(containerInner);
        containerOuter.appendChild(dropdown);
        containerInner.appendChild(list);
        containerInner.appendChild(input);
        
        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.list = list;
        this.dropdown = dropdown;

        // Add any preset values seperated by delimiter
        this.presetItems.forEach((value) => {
            this.addItem(value);
        });

        const unselectedOptions = this.passedElement.options;
        for (var i = 0; i < unselectedOptions.length; i++) {
            let option = unselectedOptions[i];
            this.addItemToDropdown(option.value);
        }

        // Subscribe to store
        this.store.subscribe(this.render);

        // Render any items
        this.render();

        // Trigger event listeners 
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onClick);
        this.input.addEventListener('focus', this.onFocus);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('click', this.onClick);
        this.input.removeEventListener('focus', this.onFocus);
    }

    /**
     * Render DOM with values
     * @return
     */
    render() {
        let state = this.store.getState();

        // Simplify store data to just values
        let valueArray = state.reduce((prev, current) => {
            prev.push(current.value);
            return prev;
        }, []);

        // Assign hidden input array of values
        this.passedElement.value = valueArray.join(this.options.delimiter);

        // Clear list
        this.list.innerHTML = '';
        
        // Add each list item to list
        state.forEach((item) => {
            if(item.active) {
                // Create new list element 
                let listItem = strToEl(`<li class="choices__item ${ this.options.removeItems ? 'choices__item--selectable' : '' } ${ item.selected ? 'is-selected' : '' }" data-choice-item data-choice-id="${ item.id }" data-choice-selected="${ item.selected }">${ item.value }</li>`);

                // Append it to list
                this.list.appendChild(listItem);
            }
        });

        console.debug(state);
    }

    /**
     * Determine how an input should be rendered
     * @return {Element} Input to test
     */
    renderInput(input) {
        if (this.options.debug) console.debug('Render');

        switch (input.type) {
            case "text":
                this.renderTextInput();
                break;
            case "select-one":
                // this.renderSelectInput();
                break;
            case "select-multiple":
                this.renderMultipleSelectInput();
                break;
            default:
                this.renderTextInput();
                break;
        }
    }

    /**
     * Initialise Choices
     * @return
     */
    init() {
        if (!this.supports) console.error('init: Your browser doesn\'nt support shit');
        this.initialised = true;
        this.renderInput(this.passedElement);
    }
    
    /**
     * Destroy Choices and nullify values
     * @return
     */
    destroy() {
        this.options = null;
        this.passedElement = null;
        this.initialised = null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let choices1 = new Choices('#choices-1', {
        delimiter: ' ',
        editItems: true,
        maxItems: 5,
        callbackOnRemoveItem: function(value) {
            console.log(value);
        },
        callbackOnAddItem: function(item, value) {
            console.log(item, value);
        }
    });

    let choices2 = new Choices('#choices-2', {
        allowDuplicates: false,
        editItems: true,
    });

    let choices3 = new Choices('#choices-3', {
        allowDuplicates: false,
        editItems: true,
        regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    });

    let choices4 = new Choices('#choices-4', {
        addItems: false,
        removeItems: false
    });

    let choices5 = new Choices('#choices-5', {
        prependValue: 'item-',
        appendValue: `-${Date.now()}`
    });

    let choices6 = new Choices('#choices-6', {
        items: ['josh@joshuajohnson.co.uk', 'joe@bloggs.co.uk']
    });

    let choices7 = new Choices('#choices-7');

    let choicesMultiple = new Choices();

    choices6.addItem('josh2@joshuajohnson.co.uk');
    choices6.removeItem('josh@joshuajohnson.co.uk');
    console.log(choices6.getItemByValue('josh2@joshuajohnson.co.uk'));
});