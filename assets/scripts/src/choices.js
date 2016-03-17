'use strict';

import { hasClass, wrap, getSiblings, isType } from './lib/utils.js';

class Choices {
    constructor(options) {
        const fakeEl = document.createElement("fakeelement");
        const USER_OPTIONS = options || {};
        const DEFAULT_OPTIONS = {
            element: document.querySelector('[data-choice]'),
            disabled: false,
            create: true,
            maxItems: 10,
            allowDuplicates: false,
            debug: false,
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

    onKeyUp(e) {
        // console.log('Keyup');
    }

    onKeyDown(e) {
        let ctrlDown = e.ctrlKey || e.metaKey;

        // Handle select all 
        if(ctrlDown && e.keyCode === 65) {
            for (let i = 0; i < this.list.children.length; i++) {
                let listItem = this.list.children[i];

                listItem.classList.add('is-selected');
            }
        }

        // Handle enter key
        if(e.keyCode === 13 && e.target.value) {
            let value = this.input.value;

            let handleEnterKey = () => {
                let canUpdate = true;

                // If there is a max entry limit and we have reached that limit
                // don't update
                if(this.options.maxItems && this.options.maxItems <= this.list.children.length) {
                    canUpdate = false;
                }

                // If no duplicates are allowed, and the value already exists
                // in the array, don't update
                if(this.options.allowDuplicates === false && this.element.value) {
                    let currentValues = JSON.parse(this.element.value);

                    if(currentValues.indexOf(value) > -1) {
                        canUpdate = false;
                    }
                }

                // All is good, update
                if(canUpdate) {
                    this.addItem(value);
                    this.updateInputValue(value);
                    this.clearInput(this.element);
                }
            };

            handleEnterKey();              
        }

        if((e.keyCode === 8 || e.keyCode === 46) && !e.target.value) {
            
            let handleBackspaceKey = () => {
                let currentListItems = this.list.querySelectorAll('.choices__item');
                let lastItem = currentListItems[currentListItems.length - 1];

                lastItem.classList.add('is-selected');
            
                for (let i = 0; i < currentListItems.length; i++) {
                    let listItem = currentListItems[i];

                    if(listItem.classList.contains('is-selected')) {
                        this.removeItem(listItem);
                        this.removeInputValue(listItem.textContent);
                    }
                };
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

    removeInputValue(value) {
        if(this.options.debug) console.debug('Remove input value');
        
        let index = this.valueArray.indexOf(value);
        this.valueArray.splice(index, 1);

        this.element.value = JSON.stringify(this.valueArray);
    }

    addItem(value) {
        if(this.options.debug) console.debug('Add item');
    
        // Create new list element
        let item = document.createElement('li');
        item.classList.add('choices__item');
        item.textContent = value;

        // Append it to list
        this.list.appendChild(item);
    }

    removeItem(item) {
        if(item) item.parentNode.removeChild(item);
    }
    
    init() {
        if(!this.supports) console.error('Your browser doesn\'nt support shit');
        this.initialised = true;
        this.render(this.element);
    }

    render() {
        if(this.options.debug) console.debug('Render');

        // Create DOM elements
        let containerOuter = document.createElement('div');
        let containerInner = document.createElement('div');
        let input = document.createElement('input');
        let list = document.createElement('ul');

        containerOuter.className = 'choices choices--active';
        containerInner.className = 'choices__inner';

        // Hide passed input
        this.element.classList.add('choices__input', 'choices__input--hidden');
        this.element.tabIndex = '-1';
        this.element.setAttribute('style', 'display:none;');
        this.element.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.element, containerInner);

        wrap(containerInner, containerOuter);

        list.className = 'choices__list';

        input.type = 'text';
        input.placeholder = this.element.placeholder;
        input.className = 'choices__input choices__input--cloned';
        
        containerInner.appendChild(list);
        containerInner.appendChild(input);
        containerOuter.appendChild(containerInner);

        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
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
        this.initialised = null;
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