'use strict';

import { wrap, getSiblings, isType } from './lib/utils.js';

class Choices {
    constructor(options) {
        const fakeEl = document.createElement("fakeelement");
        const USER_OPTIONS = options || {};
        const DEFAULT_OPTIONS = {
            element: document.querySelector('[data-choice]'),
            disabled: false,
            maxItems: 5,
            debug: true,
            placeholder: false,
            callbackOnInit: function(){},
            callbackOnRender: function(){},
            callbackOnKeyUp: function(){},
            callbackOnKeyDown: function(){},
            callbackOnEntry: function(){},
            callbackOnRemove: function(){}
        };

        

        // Merge options with user options
        this.options = this.extend(DEFAULT_OPTIONS, USER_OPTIONS || {});
        this.initialised = false;
        this.supports = 'querySelector' in document && 'addEventListener' in document && 'classList' in fakeEl;

        // Retrieve elements
        this.element = this.options.element;
        // If input already has values, parse the array, otherwise create a blank array
        this.valueArray = this.element.value !== '' && isType('Array', JSON.parse(this.element.value)) ? JSON.parse(this.element.value) : [];

        // Bind methods
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onChange.bind(this);
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
            for(let prop in obj) {
                extended[prop] = obj[prop];
            }
        };

        // Loop through each passed argument
        for(let i = 0; i < length; i++) {
            // Store argument at position i
            let obj = arguments[i];

            // If we are in fact dealing with an object, merge it. Otherwise throw error
            if(isType('Object', obj)) {
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

    }

    clearInput() {
        if(this.input.value) this.input.value = '';
    }

    /* Event handling */

    onKeyDown(e) {
        // Handle enter key
        if(e.keyCode === 13 && e.target.value) {
            let value = this.input.value;

            let handleEnterKey = () => {
                this.addItem(value);
                this.updateInputValue(value);
                this.clearInput(this.element);
            };

            if(this.options.maxItems) {
                if(this.options.maxItems > this.list.children.length) {
                    handleEnterKey();
                }
            } else {
                handleEnterKey();
            }                
        }

        if(e.keyCode === 8 && !e.target.value) {
            
            let handleBackspaceKey = () => {
                let lastItem = this.list.children[this.list.children.length - 1];
                lastItem.parentNode.removeChild(lastItem);
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
        el.addEventListener('keydown', this.onKeyDown);
        el.addEventListener('change', this.onChange);
        el.addEventListener('focus', this.onFocus);
        el.addEventListener('blur', this.onBlur);
    }

    removeEventListeners(el) {
        el.removeEventListener('click', this.onClick);
        el.removeEventListener('keydown', this.onKeyDown);
        el.removeEventListener('change', this.onChange);
        el.removeEventListener('focus', this.onFocus);
        el.removeEventListener('blur', this.onBlur);
    }

    /* Methods */

    setPlaceholder() {

    }

    setValue() {

    }

    getValue() {

    }

    getPlaceholder() {

    }

    search() {

    }

    updateInputValue(value) {
        if(this.options.debug) console.debug('Update input value');

        // Push new value to array
        this.valueArray.push(value); 
        // Caste array to string and set it as the hidden inputs value
        this.element.value = JSON.stringify(this.valueArray);
    }

    addItem(value) {
        if(this.options.debug) console.debug('Add item');
    
        // Create new list element
        let item = document.createElement('li');
        item.classList.add('choice__item');
        item.textContent = value;

        // Append it to list
        this.list.appendChild(item);
    }

    removeItem() {

    }

    removeAllItems() {

    }

    createItemList() {

    }

    init() {
        if(!this.supports) console.error('Your browser doesn\'nt support shit');
        this.initialised = true;

        this.render(this.element);
    }

    render() {
        if(this.options.debug) console.debug('Render');

        // Create DOM elements
        let container = document.createElement('div');
        let input = document.createElement('input');
        let list = document.createElement('ul');

        container.className = 'choice choice--active';

        // Hide passed input
        this.element.classList.add('choice__input', 'choice__input--hidden');
        this.element.tabIndex = '-1';
        this.element.setAttribute('style', 'display:none;');
        this.element.setAttribute('aria-hidden', 'true');

        // Wrap input in container
        wrap(this.element, container);

        list.className = 'choice__list';

        input.type = 'text';
        input.placeholder = this.element.placeholder;
        input.className = 'choice__input choice__input--cloned';
        
        container.appendChild(list);
        container.appendChild(input);

        this.container = container;
        this.input = input;
        this.list = list;

        if(this.element.value !== '') {
            let initialValues = JSON.parse(this.element.value);
            initialValues.forEach((value) => {
                this.addItem(value);
            });
        }

        this.addEventListeners(this.input);
    }

    destroy() {
        this.options = null;
        this.element = null;

        this.removeEventListeners(this.input);
    }
};

window.addEventListener('load', function() {

    let choiceInputs = document.querySelectorAll('[data-choice]');

    for (let i = choiceInputs.length - 1; i >= 0; i--) {

        let input = choiceInputs[i];

        var choices = new Choices({
            element : input
        });

        choices.init();
    };
});