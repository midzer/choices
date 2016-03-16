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
            const DEFAULT_OPTIONS = {
                element: '[data-choice]',
                disabled: false,
                maxItems: 0,
                debug: false,
                callbackOnInit: function(){},
                callbackOnRender: function(){},
                callbackOnKeyUp: function(){},
                callbackOnKeyDown: function(){},
                callbackOnEntry: function(){},
                callbackOnRemove: function(){}
            };

            // Merge options with user options
            this.options = DEFAULT_OPTIONS;

            // Retrieve elements
            this.elements = document.querySelectorAll(this.options.element);

            // Bind methods
            this.onClick = this.onClick.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onFocus = this.onFocus.bind(this);
            this.onBlur = this.onChange.bind(this);

            // Init
            this.addEventListeners();
            this.render();
        }

        /* State */

        isOpen() {
                    
        }

        isDisabled() {
            
        }

        isEmpty() {

        }

        /* Event handling */

        onKeyDown() {
            console.log('Key down');
        }

        onFocus() {
            console.log('Focus');
        }

        onClick() {
            console.log('Click');
        }

        onChange() {
            console.log('Change');
        }

        /* Event listeners */

        addEventListeners() {
            document.addEventListener('click', this.onClick);
            document.addEventListener('keydown', this.onKeyDown);
            document.addEventListener('change', this.onChange);
            document.addEventListener('focus', this.onFocus);
            document.addEventListener('blur', this.onBlur);
        }

        removeEventListeners() {
            document.removeEventListener('click', this.onClick);
            document.removeEventListener('keydown', this.onKeyDown);
            document.removeEventListener('change', this.onChange);
            document.removeEventListener('focus', this.onFocus);
            document.removeEventListener('blur', this.onBlur);
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

        addItem() {

        }

        removeItem() {

        }

        removeAllItems() {

        }

        createItemList() {

        }

        render() {
            console.log('Render');
        }

        destroy() {

        }
    };

    new Choices();
});