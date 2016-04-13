'use strict';

import { createStore } from 'redux';
import rootReducer from './reducers/index.js';
import { addItem, removeItem, selectItem, addOption, selectOption } from './actions/index';
import { hasClass, wrap, getSiblings, isType, strToEl, extend } from './lib/utils.js';

export class Choices {
    constructor(element = '[data-choice]', options) {
        const fakeEl = document.createElement("fakeel");
        const userOptions = options || {};

        // If there are multiple elements, create a new instance 
        // for each element besides the first one (as that already has an instance)
        if(isType('String', element)) {
            const elements = document.querySelectorAll(element);
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
                itemDisabled: 'choices__item--disabled',
                itemOption: 'choices__item--option',
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
        this.store = createStore(rootReducer);

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
        return (this.store.getState().items.length === 0) ? true : false; 
    }

    /* Event handling */

    /** 
     * Handle keydown event 
     * @param  {Object} e Event
     * @return
     */
    onKeyDown(e) {
        const items = this.getItems();
        const activeItems = this.getItemsFilteredByActive();
        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const deleteKey = 8 || 46;
        const enterKey = 13;
        const aKey = 65;

        // If we are typing in the input
        if(e.target === this.input) {

            // If CTRL + A or CMD + A have been pressed and there are items to select
            if (ctrlDownKey && e.keyCode === aKey && this.list && this.list.children) {
                const handleSelectAll = () => {
                    if(this.options.removeItems && !this.input.value && this.options.selectAll && this.input === document.activeElement) {
                        this.selectAll(this.list.children);
                    }
                };

                handleSelectAll();
            }

            // If enter key is pressed and the input has a value
            if (e.keyCode === enterKey && e.target.value) {
                const value = this.input.value;

                const handleEnter = () => {
                    let canUpdate = true;

                    // If there is a max entry limit and we have reached that limit
                    // don't update
                    if (this.options.maxItems && this.options.maxItems <= this.list.children.length) {
                        canUpdate = false;
                    }

                    // If no duplicates are allowed, and the value already exists
                    // in the array, don't update
                    if (this.options.allowDuplicates === false && this.passedElement.value) {
                        canUpdate = !items.some((item) => {
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

            const handleBackspaceKey = () => {
                if(this.options.removeItems) {
                    const inputIsFocussed = this.input === document.activeElement;
                    const lastItem = activeItems[activeItems.length - 1];
                    const selectedItems = items.some((item) => {
                        return item.selected === true;
                    });

                    if(items && lastItem && !this.options.editItems && inputIsFocussed && this.options.removeItems) {
                        this.selectItem(lastItem);
                    }

                    // If editing the last item is allowed and there is a last item and 
                    // there are not other selected items (minus the last item), we can edit
                    // the item value. Otherwise if we can remove items, remove all items
                    if(items && this.options.removeItems && this.options.editItems && lastItem && !selectedItems && inputIsFocussed) {
                        this.input.value = lastItem.value;
                        this.removeItem(lastItem);
                    } else {
                        this.removeAllItems(true);
                    }
                }
            };

            e.preventDefault();

            handleBackspaceKey();
        }
    }


    /** 
     * Handle click event 
     * @param  {Object} e Event
     * @return
     */
    onClick(e) {
        if(this.dropdown) {
            this.toggleDropdown();
        }

        // If click is affecting a child node of our element
        if(this.containerOuter.contains(e.target)) {
            if(this.input !== document.activeElement) {
                this.input.focus();
            }

            if(e.target.hasAttribute('data-choice-item')) {
                const items = this.getItems();
                const target = e.target;
                const handleClick = (target) => {
                    if(this.options.removeItems) {
                        const passedId = target.getAttribute('data-choice-id');

                        // We only want to select one item with a click
                        // so we deselect any items that aren't the target
                        items.forEach((item) => {
                            if(item.id === parseInt(passedId) && !item.selected) {
                                this.selectItem(item);
                            } else {
                                this.deselectItem(item);
                            }
                        });
                    }
                }
                
                handleClick(target);

            } else if(e.target.hasAttribute('data-choice-selectable')) {
                const options = this.getOptions();
                const id = e.target.getAttribute('data-choice-id');
                const option = options.find((option) => {
                    return option.id === parseInt(id);
                });

                if(!option.selected) {
                    this.selectOption(id, true);
                    this.addItem(option.value);                    
                }
            }

        } else {
            // Click is outside of our element so close dropdown and de-select items
            this.deselectAll();
            if(this.dropdown && this.dropdown.classList.contains(this.options.classNames.activeState)) {
                this.toggleDropdown();
            }
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
        const expression = new RegExp(this.options.regexFilter, 'i');
        const passesTest = expression.test(value);

        return passesTest;
    }

    /** 
     * Get Element based on a given value
     * @param  {String} value Value to search for
     * @return {Element}       First Element with given value
     */
    getItemById(id) {
        if(!id) {
            console.error('getItemById: An id must be a number');
            return;
        }

        const items = this.getItems();
        
        const itemObject = items.find((item) => {
            return item.id === parseInt(id);
        });

        const item = this.list.querySelector(`[data-choice-id='${ itemObject.id }']`);

        return item;
    }

    /**
     * Select item (a selected item can be deleted)
     * @param  {Element} item Element to select
     * @return
     */
    selectItem(item) {
        if(!item) return;
        const id = item.id;
        this.store.dispatch(selectItem(id, true));
    }

    /** 
     * Deselect item
     * @param  {Element} item Element to de-select
     * @return
     */
    deselectItem(item) {
        if(!item) return;
        const id = item.id;
        this.store.dispatch(selectItem(id, false));
    }

    /**
     * Select items within array
     * @param  {Array} items Array of items to select
     * @return
     */
    selectAll() {
        const items = this.getItems();
        items.forEach((item) => {
            this.selectItem(item);
        });
    }

    deselectAll() {
        const items = this.getItems();
        items.forEach((item) => {
            this.deselectItem(item);
        });
    }

    selectOption(id, value) {
        if(!id) return;
        this.store.dispatch(selectOption(id, value));
    }

    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     */
    addItem(value, callback = this.options.callbackOnAddItem) {
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
        let id = this.store.getState().items.length + 1;

        // Close dropdown
        if(this.dropdown && this.dropdown.classList.contains('is-active')) {
            this.toggleDropdown();    
        }

        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback(id, value);
            } else {
                console.error('callbackOnAddItem: Callback is not a function');
            }
        }

        this.store.dispatch(addItem(passedValue, id));
    }

    /**
     * Remove item from store
     * @param
     */
    removeItem(item, callback = this.options.callbackOnRemoveItem) {
        if(!item) {
            console.error('removeItem: No item or value was passed to be removed');
            return;
        }

        let id = item.id;
        let value = item.value;

        // Run callback
        if(callback){
            if(isType('Function', callback)) {
                callback(value);
            } else {
                console.error('callbackOnRemoveItem: Callback is not a function');
            }
        }

        this.store.dispatch(removeItem(id));
    }

    /**
     * Remove all items from array
     * @param  {Boolean} selectedOnly Optionally remove only selected items
     * @return
     */
    removeAllItems(selectedOnly = false) {
        let items = this.getItems();

        items.forEach((item) => {
            if(selectedOnly) {
                if(item.selected && item.active){
                    this.removeItem(item);    
                }
            } else {
                if(item.active) {
                    this.removeItem(item);    
                }
            }
        });
    }

    toggleDropdown() {
        if(!this.dropdown) {
            console.error('No dropdown set');
            return;
        }

        const isActive = this.dropdown.classList.contains('is-active');

        this.dropdown.classList[isActive ? 'remove' : 'add']('is-active');
    }

    addOptionToDropdown(value) {
        // Generate unique id
        let state = this.store.getState();
        let id = state.options.length + 1;
        this.store.dispatch(addOption(value, id));
    }

    getItems() {
        const state = this.store.getState();
        return state.items;
    }

    getItemsFilteredByActive() {
        const items = this.getItems();

        const valueArray = items.filter((item) => {
            return item.active === true;
        }, []);

        return valueArray;
    }

    getItemsFilteredByValue() {
        const items = this.getItems();

        const valueArray = items.reduce((prev, current) => {
            prev.push(current.value);
            return prev;
        }, []);

        return valueArray;
    }

    getOptions() {
        const state = this.store.getState();
        return state.options;
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
        const containerOuter = strToEl(`<div class="${ this.options.classNames.containerOuter }"></div>`);
        const containerInner = strToEl(`<div class="${ this.options.classNames.containerInner }"></div>`);

        // Hide passed input
        this.passedElement.classList.add(this.options.classNames.input, this.options.classNames.hiddenState);
        this.passedElement.tabIndex = '-1';
        this.passedElement.setAttribute('style', 'display:none;');
        this.passedElement.setAttribute('aria-hidden', 'true');

        // Wrap input in container preserving DOM ordering
        wrap(this.passedElement, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);

        const list = strToEl(`<ul class="${ this.options.classNames.list } ${ this.options.classNames.listItems }"></ul>`);
        const input = strToEl(`<input type="text" class="${ this.options.classNames.input } ${ this.options.classNames.inputCloned }">`);
        const dropdown = strToEl(`<div class="${ this.options.classNames.list } ${ this.options.classNames.listDropdown }"></div>`);

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
    
        const passedOptions = Array.prototype.slice.call(this.passedElement.options);
        passedOptions.forEach((option) => {
            this.addOptionToDropdown(option.value);
        });

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
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('click', this.onClick);
    }

    /**
     * Render DOM with values
     * @return
     */
    render(callback = this.options.callbackOnRender) {
        const classNames = this.options.classNames;
        const items = this.getItems();
        const options = this.getOptions();

        // OPTIONS
        if(this.dropdown) {
            // Clear options
            this.dropdown.innerHTML = '';

            // Add each option to dropdown
            if(options) {
                options.forEach((option) => {
                    const dropdownItem = strToEl(`<li class="${ classNames.item } ${ classNames.itemOption } ${ option.selected ? classNames.selectedState + ' ' + classNames.itemDisabled : classNames.itemSelectable }" data-choice-selectable data-choice-id="${ option.id }" data-choice-value="${ option.value }">${ option.value }</li>`);        
                    this.dropdown.appendChild(dropdownItem);
                });
            } else {
                const dropdownItem = strToEl(`<li class="${ classNames.item }">No options to select</li>`);        
                this.dropdown.appendChild(dropdownItem);
            }
        }
        
        // ITEMS
        // Simplify store data to just values
        const itemsFiltered = this.getItemsFilteredByValue();

        // Assign hidden input array of values
        this.passedElement.value = itemsFiltered.join(this.options.delimiter);

        // Clear list
        this.list.innerHTML = '';
        
        // Add each list item to list
        items.forEach((item) => {
            if(item.active) {
                // Create new list element 
                const listItem = strToEl(`<li class="${ classNames.item } ${ this.options.removeItems ? classNames.itemSelectable : '' } ${ item.selected ? classNames.selectedState : '' }" data-choice-item data-choice-id="${ item.id }" data-choice-selected="${ item.selected }">${ item.value }</li>`);

                // Append it to list
                this.list.appendChild(listItem);
            }
        });

        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback(items, options);
            } else {
                console.error('callbackOnRender: Callback is not a function');
            }
        }
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
    init(callback = this.options.callbackOnInit) {
        if (!this.supports) console.error('init: Your browser doesn\'nt support shit');
        this.initialised = true;
        this.renderInput(this.passedElement);
        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback();
            } else {
                console.error('callbackOnInit: Callback is not a function');
            }
        }
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
    const choices1 = new Choices('#choices-1', {
        delimiter: ' ',
        editItems: true,
        maxItems: 5,
        // callbackOnRemoveItem: function(value) {
        //     console.log(value);
        // },
        // callbackOnAddItem: function(item, value) {
        //     console.log(item, value);
        // },
        callbackOnRender: function(items) {
            console.log(items);
        }
    });

    const choices2 = new Choices('#choices-2', {
        allowDuplicates: false,
        editItems: true,
    });

    const choices3 = new Choices('#choices-3', {
        allowDuplicates: false,
        editItems: true,
        regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    });

    const choices4 = new Choices('#choices-4', {
        addItems: false,
        removeItems: false,
    });

    const choices5 = new Choices('#choices-5', {
        prependValue: 'item-',
        appendValue: `-${Date.now()}`,
    });

    choices5.removeAllItems();

    const choices6 = new Choices('#choices-6', {
        items: ['josh@joshuajohnson.co.uk', 'joe@bloggs.co.uk'],
    });

    const choices7 = new Choices('#choices-7', {
        callbackOnRender: function(items, options) {
            console.log(items);
        }
    });

    const choicesMultiple = new Choices();

    choices6.addItem('josh2@joshuajohnson.co.uk', () => { console.log('Custom add item callback')});
    choices6.removeItem('josh@joshuajohnson.co.uk');
    console.log(choices6.getItemById(1));
});