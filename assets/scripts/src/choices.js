'use strict';

import { hasClass, wrap, getSiblings, isType } from './lib/utils.js';

/**

    TODO:
    - Dynamically set input width to contents
    - Handle select input
    - Handle multiple select input ?

 */

export class Choices {
    constructor(options) {
        const FAKE_EL = document.createElement("FAKE_ELement");
        const USER_OPTIONS = options || {};
        const DEFAULT_OPTIONS = {
            element: document.querySelector('[data-choice]'),
            disabled: false,
            create: true,
            editItems: false,
            maxItems: false,
            delimiter: ',',
            allowDuplicates: true,
            debug: false,
            placeholder: false,
            callbackOnInit: function() {},
            callbackOnRender: function() {},
            callbackOnKeyUp: function() {},
            callbackOnKeyDown: function() {},
            callbackOnEntry: function() {},
            callbackOnRemove: function() {}
        };

        // Merge options with user options
        this.options = this.extend(DEFAULT_OPTIONS, USER_OPTIONS || {});
        this.initialised = false;
        this.supports = 'querySelector' in document && 'addEventListener' in document && 'classList' in FAKE_EL;

        // Retrieve elements
        this.element = this.options.element;
        // If input already has values, parse the array, otherwise create a blank array
        this.valueArray = this.element.value !== '' ? this.cleanInputValue(this.element.value) : [];
        // How many values in array
        this.valueCount = this.valueArray.length;

        // Bind methods
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onChange.bind(this);

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
            // Store argument at position i
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
        let ctrlDown = e.ctrlKey || e.metaKey;

        // Handle select all 
        if (ctrlDown && e.keyCode === 65) {
            if(this.list && this.list.children) {
                for (let i = 0; i < this.list.children.length; i++) {
                    let listItem = this.list.children[i];

                    if(listItem.classList.contains('is-selected')) {
                        listItem.classList.remove('is-selected');
                    } else {
                        listItem.classList.add('is-selected');
                    }
                    
                }
            }
        }

        // Handle enter key
        if (e.keyCode === 13 && e.target.value) {
            let value = this.input.value;

            let handleEnterKey = () => {
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
                        this.addItem(this.list, value);
                        this.updateInputValue(value);
                        this.clearInput(this.element);
                        this.unselectAll(this.list.children);
                    } else {
                        
                    }
                    
                }
            };

            handleEnterKey();
        }

        if ((e.keyCode === 8 || e.keyCode === 46) && !e.target.value) {

            let handleBackspaceKey = () => {
                let currentListItems = this.list.querySelectorAll('.choices__item');
                let lastItem = currentListItems[currentListItems.length - 1];

                if(lastItem) {
                    lastItem.classList.add('is-selected');  
                } 

                if(this.options.editItems && lastItem) {
                    this.input.value = lastItem.innerHTML;
                    this.removeItem(lastItem);
                } else {
                    this.removeAll(currentListItems);
                }
            };

            handleBackspaceKey();

            e.preventDefault();
        }
    }

    onFocus(e) {

    }

    onClick(e) {

    }

    onChange(e) {

    }

    /* Event listeners */

    addEventListeners(el) {
        el.addEventListener('click', this.onClick);
        el.addEventListener('keyup', this.onKeyUp);
        el.addEventListener('keydown', this.onKeyDown);
        el.addEventListener('change', this.onChange);
        el.addEventListener('focus', this.onFocus);
        el.addEventListener('blur', this.onBlur);
    }

    removeEventListeners(el) {
        el.removeEventListener('click', this.onClick);
        el.removeEventListener('keyup', this.onKeyUp);
        el.removeEventListener('keydown', this.onKeyDown);
        el.removeEventListener('change', this.onChange);
        el.removeEventListener('focus', this.onFocus);
        el.removeEventListener('blur', this.onBlur);
    }

    /* Methods */
    setValue() {}

    getValue() {}

    getValues() {}

    getPlaceholder() {}

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

        // // Create new list element
        let item = document.createElement('li');
        item.classList.add('choices__item');
        item.textContent = value;

        // Append it to list
        parent.appendChild(item);
    }

    unselectAll(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item.classList.contains('is-selected')) {
                item.classList.remove('is-selected');
            }
        };
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

    removeItem(item) {
        if (item) item.parentNode.removeChild(item);
    }

    init() {
        if (!this.supports) console.error('Your browser doesn\'nt support shit');
        this.initialised = true;
        this.render(this.element);
    }

    renderTextInput() {
        // Template:
        // 
        // <div class="choices choices--active">
        //     <div class="choices__inner">
        //         <input id="1" type="text" data-choice="" class="choices__input choices__input--hidden" tabindex="-1" style="display:none;" aria-hidden="true">
        //         <ul class="choices__list choices__list--items"></ul>
        //         <input type="text" class="choices__input choices__input--cloned">
        //     </div>
        // </div>

        let containerOuter = document.createElement('div');
        containerOuter.className = 'choices choices--active';

        let containerInner = document.createElement('div');
        containerInner.className = 'choices__inner';

        // Hide passed input
        this.element.classList.add('choices__input', 'choices__input--hidden');
        this.element.tabIndex = '-1';
        this.element.setAttribute('style', 'display:none;');
        this.element.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.element, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        let list = document.createElement('ul');
        list.className = 'choices__list choices__list--items';

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'choices__input choices__input--cloned';

        if (input.placeholder) {
            input.placeholder = this.element.placeholder;
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
        this.addEventListeners(this.input);
    }

    renderSelectInput() {
        let containerOuter = document.createElement('div');
        containerOuter.className = 'choices choices--active';

        let containerInner = document.createElement('div');
        containerInner.className = 'choices__inner';

        // Hide passed input
        this.element.classList.add('choices__input', 'choices__input--hidden');
        this.element.tabIndex = '-1';
        this.element.setAttribute('style', 'display:none;');
        this.element.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.element, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        let options = document.createElement('ul');
        options.className = 'choices__list choices__list--options';

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'choices__input choices__input--cloned';

        containerInner.appendChild(input);
        containerInner.appendChild(options);
        containerOuter.appendChild(containerInner);

        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.list = null;
        this.options = options;

        let initialOptions = this.element.children;

        if (initialOptions) {
            for (let i = 0; i < initialOptions.length; i++) {
                let parentOption = initialOptions[i];
        
                if(parentOption.tagName === 'OPTGROUP') {
                    this.addItem(this.options, parentOption.label);
                    for (let j = 0; j < parentOption.children.length; j++) {
                        let childOption = parentOption.children[j];
                        this.addItem(this.options, childOption.innerHTML);
                    }
                } else if(parentOption.tagName === 'OPTION') {
                    this.addItem(this.options, parentOption.innerHTML);
                }
            }
        }

        // Trigger event listeners 
        this.addEventListeners(this.input);
    }

    renderMultipleSelectInput() {

    }

    render() {
        if (this.options.debug) console.debug('Render');

        switch (this.element.type) {
            case "text":
                this.renderTextInput();
                break;
            case "select-one":
                this.renderSelectInput();
                break;
            case "select-multiple":
                this.renderMultipleSelectInput();
                break;
            default:
                rthis.renderTextInput();
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

    let choices1 = new Choices({
        element : input1,
        delimiter: ' ',
        maxItems: 5,
    });

    let choices2 = new Choices({
        element : input2,
        allowDuplicates: false,
        editItems: true
    });

    let choices3 = new Choices({
        element : input3
    });


    let choices4 = new Choices({
        element : input4
    });
})();