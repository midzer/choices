'use strict';

class Choices {
    constructor() {
        const DEFAULT_CONFIG = {
            element: '[data-choice]',
            disabled: false,
            maxItems: 0,
            debug: false,
            callbackOnInit: function(){},
            callbackOnKeyDown: function(){},
            callbackOnEnter: function(){},
            callbackOnSearch: function(){}
        };

        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onChange.bind(this);

        this.render();
    }

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

    render(){
        console.log('Render');
    }
}

new Choices();