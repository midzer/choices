import { wrap, getSiblings } from './lib/utils.js';

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
                maxItems: 0,
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

        /* Event handling */

        onKeyDown(e) {
            // let input = 
            console.log('Key down')

            if(e.keyCode === 13 && e.target.value) {
                this.addItem(e.target, e.target.value);
                e.target.value = '';
            }
        }

        onFocus(e) {
            console.log('Focus')
        }

        onClick(e) {
            console.log('Click')
        }

        onChange(e) {
            console.log('Change')
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

        addItem(el, value) {
            console.log('Add item');
            let wrapper = el.parentNode;
            let list = wrapper.querySelector('.choice__list');
            
            let item = document.createElement('li');
            item.classList.add('choice__item');
            item.textContent = value;

            wrapper.appendChild(item);
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
            console.log('Render');

            let wrapper = document.createElement('div');
            let input = document.createElement('input');
            let list = document.createElement('ul');

            wrapper.classList.add('choice', 'choice--active');

            el.classList.add('choice__input', 'choice__input--original');
            el.tabIndex = '-1';
            el.setAttribute('style', 'display:none;');

            wrap(el, wrapper);

            list.classList.add('choice__list');

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
    console.log(choices);
});