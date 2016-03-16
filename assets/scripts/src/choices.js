import { wrap, getSiblings, isType } from './lib/utils.js';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.Choices = factory(root);
    }
})(this, function (root) {

    'use strict';

    class Choices {
        constructor() {
            const fakeEl = document.createElement("fakeelement");
            const DEFAULT_OPTIONS = {
                element: '[data-choice]',
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
            this.options = DEFAULT_OPTIONS;
            this.initialised = false;
            this.supports = 'querySelector' in document && 'addEventListener' in document && 'classList' in fakeEl;

            // Retrieve elements
            this.elements = document.querySelectorAll(this.options.element);

            // Bind methods
            this.onClick = this.onClick.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onFocus = this.onFocus.bind(this);
            this.onBlur = this.onChange.bind(this);
        }

        /* State */

        isOpen() {
                    
        }

        isDisabled() {
            
        }

        isEmpty() {

        }

        clearInput(el) {
            if(el.value) el.value = '';
        }

        /* Event handling */

        onKeyDown(e) {
            // Handle enter key
            if(e.keyCode === 13 && e.target.value) {
                let el = e.target;
                let value = el.value;
                let list = e.target.parentNode.querySelector('.choice__list');

                let handleEnterKey = () => {
                    this.addItem(el, value, list);
                    this.updateInputValue(el, value);
                    this.clearInput(el);
                };

                if(this.options.maxItems) {
                    if(this.options.maxItems > list.children.length) {
                        handleEnterKey();
                    }
                } else {
                    handleEnterKey();
                }                
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

        updateInputValue(el, value) {
            if(this.options.debug) console.debug('Update input value');
            // Find hidden element
            let hiddenInput = el.parentNode.querySelector('.choice__input--hidden');
            // If input already has values, parse the array, otherwise create a blank array
            let valueArray = hiddenInput.value !== '' && isType('Array', JSON.parse(hiddenInput.value)) ? JSON.parse(hiddenInput.value) : [];
            // Push new value to array
            valueArray.push(value); 
            // Caste array to string and set it as the hidden inputs value
            hiddenInput.value = JSON.stringify(valueArray);
        }

        addItem(el, value, list) {
            if(this.options.debug) console.debug('Add item');
        
            // Create new list element
            let item = document.createElement('li');
            item.classList.add('choice__item');
            item.textContent = value;

            // Append it to list
            list.appendChild(item);
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

            let els = this.elements;
            for (let i = els.length - 1; i >= 0; i--) {
                let el = els[i];    
                this.render(el);
            }
        }

        render(el) {
            if(this.options.debug) console.debug('Render');

            let wrapper = document.createElement('div');
            let input = document.createElement('input');
            let list = document.createElement('ul');

            wrapper.classList.add('choice', 'choice--active');

            el.classList.add('choice__input', 'choice__input--hidden');
            el.tabIndex = '-1';
            el.setAttribute('style', 'display:none;');
            el.setAttribute('aria-hidden', 'true');

            wrap(el, wrapper);

            list.classList.add('choice__list');

            if(el.value !== '') {
                let valueArray = JSON.parse(el.value);
                valueArray.map((v) => {
                    this.addItem(el, v, list);
                });
            }

            input.type = 'text';
            input.classList.add('choice__input', 'choice__input--cloned');
            
            wrapper.appendChild(list);
            wrapper.appendChild(input);

            this.addEventListeners(input);
        }

        destroy() {
            this.options = null;
            this.elements = null;

            let els = this.elements;

            for (let i = els.length - 1; i >= 0; i--) {
                let el = els[i];

                this.removeEventListeners(el);
            }
        }
    };

    var choices = new Choices();
    choices.init();
});