'use strict';

import './lib/polyfills.js';
import { addItem, removeItem, highlightItem, addChoice, filterChoices, activateChoices, addGroup, clearAll } from './actions/index';
import { isScrolledIntoView, getAdjacentEl, findAncestor, wrap, isType, isElement, strToEl, extend, getWidthOfInput, debounce } from './lib/utils.js';
import Fuse from 'fuse.js';
import Store from './store/index.js';

/**
 * Choices
 */
export class Choices {
    constructor(element = '[data-choice]', userConfig = {}) {

        // If there are multiple elements, create a new instance 
        // for each element besides the first one (as that already has an instance)
        if(isType('String', element)) {
            const elements = document.querySelectorAll(element);
            if(elements.length > 1) {
                for (let i = 1; i < elements.length; i++) {
                    const el = elements[i];
                    new Choices(el, userConfig);
                }
            }
        }

        const defaultConfig = {
            items: [],
            choices: [],
            maxItemCount: -1,
            addItems: true,
            removeItems: true,
            removeItemButton: false,
            editItems: false,
            duplicateItems: true,
            delimiter: ',',
            paste: true,
            search: true, 
            regexFilter: null,
            placeholder: true,
            placeholderValue: null,
            prependValue: null,
            appendValue: null,
            loadingText: 'Loading...',
            classNames: {
                containerOuter: 'choices',
                containerInner: 'choices__inner',
                input: 'choices__input',
                inputCloned: 'choices__input--cloned',
                list: 'choices__list',
                listItems: 'choices__list--multiple',
                listSingle: 'choices__list--single',
                listDropdown: 'choices__list--dropdown',
                item: 'choices__item',
                itemSelectable: 'choices__item--selectable',
                itemDisabled: 'choices__item--disabled',
                itemChoice: 'choices__item--choice',
                group: 'choices__group',
                groupHeading : 'choices__heading',
                button: 'choices__button',
                activeState: 'is-active',
                focusState: 'is-focused',
                openState: 'is-open',
                disabledState: 'is-disabled',
                highlightedState: 'is-highlighted',
                hiddenState: 'is-hidden',
                flippedState: 'is-flipped',
                loadingState: 'is-loading',
            },
            callbackOnInit: () => {},
            callbackOnAddItem: (id, value, passedInput) => {},
            callbackOnRemoveItem: (id, value, passedInput) => {},
            callbackOnChange: (value, passedInput) => {},
        };

        // Merge options with user options
        this.config = extend(defaultConfig, userConfig);

        // Create data store
        this.store = new Store(this.render);

        // State tracking
        this.initialised  = false;
        this.currentState = {};
        this.prevState    = {};
        this.currentValue = '';

        // Retrieve triggering element (i.e. element with 'data-option' trigger)
        this.passedElement = isType('String', element) ? document.querySelector(element) : element;

        this.highlightPosition = 0;
        this.canSearch = this.config.search;

        // Assing preset choices from passed object
        this.presetChoices = this.config.choices;

        // Assign preset items from passed object first
        this.presetItems = this.config.items;

        // Then add any values passed from attribute
        if(this.passedElement.value) {
            this.presetItems = this.presetItems.concat(this.passedElement.value.split(this.config.delimiter));
        }

        // Bind methods
        this.init    = this.init.bind(this);
        this.render  = this.render.bind(this);
        this.destroy = this.destroy.bind(this);
        this.disable = this.disable.bind(this);
        
        // Bind event handlers
        this._onFocus     = this._onFocus.bind(this);
        this._onBlur      = this._onBlur.bind(this);
        this._onKeyUp     = this._onKeyUp.bind(this);
        this._onKeyDown   = this._onKeyDown.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
        this._onPaste     = this._onPaste.bind(this);
        this._onInput     = this._onInput.bind(this);

        // Cutting the mustard
        const cuttingTheMustard = 'querySelector' in document && 'addEventListener' in document && 'classList' in document.createElement("div");
        if (!cuttingTheMustard) console.error('Choices: Your browser doesn\'t support Choices');

        // Input type check
        const canInit = this.passedElement && isElement(this.passedElement) && ['select-one', 'select-multiple', 'text'].some(type => type === this.passedElement.type);

        if(canInit) {
            // If element has already been initalised with Choices
            if(this.passedElement.getAttribute('data-choice') === 'active') return;

            // Let's go 
            this.init();
        } else {
            console.error('Incompatible input passed');
        }
    }

    /**
     * Initialise Choices
     * @return
     * @public
     */
    init(callback) {
        if(this.initialised !== true) {

            this.initialised = true;

            // Create required elements
            this._createTemplates();

            // Generate input markup
            this._createInput();

            this.store.subscribe(this.render);

            // Render any items
            this.render();

            // Trigger event listeners 
            this._addEventListeners();

            // Run callback if it is a function
            if(callback = this.config.callbackOnInit){
                if(isType('Function', callback)) {
                    callback();
                } else {
                    console.error('callbackOnInit: Callback is not a function');
                }
            }
        }
    }
    
    /**
     * Destroy Choices and nullify values
     * @return
     * @public
     */
    destroy() {
        this._removeEventListeners();

        this.passedElement.classList.remove(this.config.classNames.input, this.config.classNames.hiddenState);
        this.passedElement.tabIndex = '';
        this.passedElement.removeAttribute('style', 'display:none;');
        this.passedElement.removeAttribute('aria-hidden');
                
        this.containerOuter.outerHTML = this.passedElement.outerHTML;

        this.passedElement = null;
        this.userConfig   = null;
        this.config       = null;
        this.store         = null;
    }

    /**
     * Select item (a selected item can be deleted)
     * @param  {Element} item Element to select
     * @return {Object} Class instance
     * @public
     */
    highlightItem(item) {
        if(!item) return;
        const id = item.id;
        this.store.dispatch(highlightItem(id, true));

        return this;
    }

    /** 
     * Deselect item
     * @param  {Element} item Element to de-select
     * @return {Object} Class instance
     * @public
     */
    unhighlightItem(item) {
        if(!item) return;
        const id = item.id;
        this.store.dispatch(highlightItem(id, false));

        return this;
    }

    /**
     * Highlight items within store
     * @return {Object} Class instance
     * @public
     */
    highlightAll() {
        const items = this.store.getItems();
        items.forEach((item) => {
            this.highlightItem(item);
        });

        return this;
    }

    /**
     * Deselect items within store
     * @return {Object} Class instance
     * @public
     */
    unhighlightAll() {
        const items = this.store.getItems();
        items.forEach((item) => {
            this.unhighlightItem(item);
        });

        return this;
    }

    /**
     * Remove an item from the store by its value
     * @param  {String} value Value to search for
     * @return {Object} Class instance
     * @public
     */
    removeItemsByValue(value) {
        if(!value || !isType('String', value)) console.error('removeItemsByValue: No value was passed to be removed'); return;

        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.value === value) {
                this._removeItem(item);
            }
        });

        return this;
    }

    /**
     * Remove all items from store array
     * Note: removed items are soft deleted
     * @param  {Number} excludedId Optionally exclude item by ID
     * @return {Object} Class instance
     * @public
     */
    removeActiveItems(excludedId) {
        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.active && excludedId !== item.id) {
                this._removeItem(item);   
            } 
        });

        return this;
    }

    /** 
     * Remove all selected items from store
     * Note: removed items are soft deleted
     * @return {Object} Class instance
     * @public
     */
    removeHighlightedItems() {
        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.highlighted && item.active) {
                this._removeItem(item);
            }
        });

        return this;
    }

    /** 
     * Show dropdown to user by adding active state class
     * @return {Object} Class instance
     * @public
     */
    showDropdown() { 
        this.containerOuter.classList.add(this.config.classNames.openState);
        this.dropdown.classList.add(this.config.classNames.activeState);

        const dimensions = this.dropdown.getBoundingClientRect();
        const shouldFlip = dimensions.top + dimensions.height >= document.body.offsetHeight;

        // Whether or not the dropdown should appear above or below input
        if(shouldFlip) {
            this.containerOuter.classList.add(this.config.classNames.flippedState);
        } else {
            this.containerOuter.classList.remove(this.config.classNames.flippedState);
        }

        return this;
    }

    /** 
     * Hide dropdown from user
     * @return {Object} Class instance
     * @public
     */
    hideDropdown() {
        // A dropdown flips if it does not have space below the input
        const isFlipped = this.containerOuter.classList.contains(this.config.classNames.flippedState);

        this.containerOuter.classList.remove(this.config.classNames.openState);
        this.dropdown.classList.remove(this.config.classNames.activeState);

        if(isFlipped) {
            this.containerOuter.classList.remove(this.config.classNames.flippedState);
        }

        return this;
    }

    /** 
     * Determine whether to hide or show dropdown based on its current state
     * @return {Object} Class instance
     * @public
     */
    toggleDropdown() {
        if(this.dropdown.classList.contains(this.config.classNames.activeState)) {
            this.hideDropdown()  
        } else {
            this.showDropdown();  
        } 

        return this;
    }

    /**
     * Set value of input. If the input is a select box, a choice will be created and selected otherwise
     * an item will created directly.
     * @param {Array} args Array of value objects or value strings
     * @return {Object} Class instance
     * @public
     */
    setValue(args) {
        if(this.initialised === true) {
            // Convert args to an itterable array
            const values = [...args];

            values.forEach((item, index) => {
                if(isType('Object', item)) {
                    if(!item.value) return;
                    // If we are dealing with a select input, we need to create an option first 
                    // that is then selected. For text inputs we can just add items normally.
                    if(this.passedElement.type !== 'text') {
                        this._addChoice(true, false, item.value, item.label, -1);
                    } else {
                        this._addItem(item.value, item.label, item.id);    
                    }
                } else if(isType('String', item)) {
                    if(this.passedElement.type !== 'text') {
                        this._addChoice(true, false, item, item, -1);
                    } else {
                        this._addItem(item);
                    }
                }
            });
        }

        return this;
    }

    /**
     * Select value of select box via the value of an existing choice
     * @param {Array/String} value An array of strings of a single string
     * @return {Object} Class instance
     * @public
     */
    setValueByChoice(value) {
        if (this.passedElement.type !== 'text') {
            const choices = this.store.getChoices();
            
            // If only one value has been passed, convert to array
            if (!isType('Array', value)) {
                value = [value];
            }
            
            // Loop through each value and 
            value.forEach((val, index) => {
                const foundChoice = choices.find((choice) => {
                    // Check 'value' property exists and the choice isn't already selected
                    if(choice.value === val) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if(foundChoice) {
                    if(!foundChoice.selected) {
                        this._addItem(foundChoice.value, foundChoice.label, foundChoice.id);    
                    } else {
                        console.warn('Attempting to select choice already selected');
                    }
                } else {
                    console.warn('Attempting to select choice that does not exist');
                }
            })
        }
        return this;
    }

    /**
    * Direct populate choices
    * @param  {Array} choices - Choices to insert 
    * @param  {string} value - Name of 'value' property
    * @param  {string} label - Name of 'label' property
    * @return {Object} Class instance
    * @public
    */
    setChoices(choices, value, label){
        if(this.initialised === true) {
            if(this.passedElement.type === 'select-one' || this.passedElement.type === 'select-multiple') {
                if(!isType('Array', choices) || !value) return;

                if(choices && choices.length) {
                    this.containerOuter.classList.remove(this.config.classNames.loadingState);
                    choices.forEach((result, index) => {
                        // Select first choice in list if single select input
                        if(index === 0 && this.passedElement.type === 'select-one') { 
                            this._addChoice(true, result.disabled ? result.disabled : false, result[value], result[label]);
                        } else {
                            this._addChoice(result.selected ? result.selected : false, result.disabled ? result.disabled : false, result[value], result[label]);    
                        }
                    });
                }
            }
        }
        return this;
    }

    /**
     * Clear value of inputs
     * @return {Object} Class instance
     * @public
     */
    clearValue() {
        this.store.dispatch(clearAll());
        return this;
    }

    /**
     * Disable 
     * @return {Object} Class instance
     * @public
     */
    disable() {
        this.passedElement.disabled = true;
        if(this.initialised) {
            this.input.disabled = true;
            this.containerOuter.classList.add(this.config.classNames.disabledState);
        }
        return this;
    }

    /** 
     * Populate options via ajax callback
     * @param  {Function} fn Passed 
     * @return {Object} Class instance
     * @public
     */
    ajax(fn) {
        if(this.initialised === true) {
            if(this.passedElement.type === 'select-one' || this.passedElement.type === 'select-multiple') {
                this.containerOuter.classList.add(this.config.classNames.loadingState);
                if(this.passedElement.type === 'select-one') { 
                    const placeholderItem = this._getTemplate('item', { id: -1, value: 'Loading', label: this.config.loadingText, active: true});
                    this.itemList.appendChild(placeholderItem);
                }
                const callback = (results, value, label) => {
                    if(!isType('Array', results) || !value) return;

                    if(results && results.length) {
                        this.containerOuter.classList.remove(this.config.classNames.loadingState);
                        results.forEach((result, index) => {
                            // Select first choice in list if single select input
                            if(index === 0 && this.passedElement.type === 'select-one') { 
                                this._addChoice(true, false, result[value], result[label]);
                            } else {
                                this._addChoice(false, false, result[value], result[label]);    
                            }
                        });
                    }
                };
                fn(callback);
            }
        }
        return this;
    }

    /** 
     * Set value of input to blank
     * @return {Object} Class instance
     * @public
     */
    clearInput() {
        if (this.input.value) this.input.value = '';
        if(this.passedElement.type !== 'select-one') {
            this.input.style.width = getWidthOfInput(this.input);
        }
        return this;
    }

    /** 
     * Call change callback
     * @param  {string} value - last added/deleted/selected value
     * @return
     * @private
     */
    _triggerChange(value) {
        if(!value) return;
        // Run callback if it is a function
        if(this.config.callbackOnChange){
            const callback = this.config.callbackOnChange;
            if(isType('Function', callback)) {
                callback(value, this.passedElement);
            } else {
                console.error('callbackOnChange: Callback is not a function');
            }
        }
    }

    /** 
     * Process enter key event
     * @param  {Array} activeItems Items that are currently active
     * @return
     * @private
     */
    _handleEnter(activeItems, value) {
        let canUpdate = true;

        if(this.config.addItems) {
            if (this.config.maxItemCount && this.config.maxItemCount > 0 && this.config.maxItemCount <= this.itemList.children.length) {
                // If there is a max entry limit and we have reached that limit
                // don't update
                canUpdate = false;
            } else if(this.config.duplicateItems === false && this.passedElement.value) {
                // If no duplicates are allowed, and the value already exists
                // in the array, don't update
                canUpdate = !activeItems.some((item) => item.value === value);
            }   
        } else {
            canUpdate = false;
        }

        if (canUpdate) {
            let canAddItem = true;

            // If a user has supplied a regular expression filter
            if(this.config.regexFilter) {
                // Determine whether we can update based on whether 
                // our regular expression passes 
                canAddItem = this._regexFilter(value);
            }
            
            // All is good, add
            if(canAddItem) {
                this.toggleDropdown();
                this._addItem(value);
                this._triggerChange(value);
                this.clearInput(this.passedElement);
            }
        }
    };

    /**
     * Process back space event
     * @param  {Array} Active items
     * @return
     * @private
     */
    _handleBackspace(activeItems) {
        if(this.config.removeItems && activeItems) {
            const lastItem = activeItems[activeItems.length - 1];
            const hasHighlightedItems = activeItems.some((item) => item.highlighted === true);

            // If editing the last item is allowed and there are not other selected items, 
            // we can edit the item value. Otherwise if we can remove items, remove all selected items
            if(this.config.editItems && !hasHighlightedItems && lastItem) {
                this.input.value = lastItem.value;
                this._removeItem(lastItem);
                this._triggerChange(lastItem.value);
            } else {
                if(!hasHighlightedItems) { this.highlightItem(lastItem); }
                this.removeHighlightedItems();    
            }
        }
    };

    /**
     * Key down event
     * @param  {Object} e Event
     * @return
     */
    _onKeyDown(e) {
        if(e.target !== this.input) return;

        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const backKey     = 46;
        const deleteKey   = 8;
        const enterKey    = 13;
        const aKey        = 65;
        const escapeKey   = 27;
        const upKey       = 38;
        const downKey     = 40;

        const activeItems       = this.store.getItemsFilteredByActive();
        const activeChoices     = this.store.getChoicesFilteredByActive();
        
        const hasFocusedInput   = this.input === document.activeElement;
        const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
        const hasItems          = this.itemList && this.itemList.children;
        const keyString         = String.fromCharCode(e.keyCode);

        // If a user is typing and the dropdown is not active
        if(this.passedElement.type !== 'text' && /[a-zA-Z0-9-_ ]/.test(keyString) && !hasActiveDropdown) {
            this.showDropdown();
        }

        this.canSearch = this.config.search;

        switch (e.keyCode) {
            case aKey:
                // If CTRL + A or CMD + A have been pressed and there are items to select
                if(ctrlDownKey && hasItems) {
                    this.canSearch = false;
                    if(this.config.removeItems && !this.input.value && this.input === document.activeElement) {
                        // Highlight items
                        this.highlightAll(this.itemList.children);
                    }
                }
                break;

            case enterKey:
                // If enter key is pressed and the input has a value
                if(e.target.value && this.passedElement.type === 'text') {
                    const value = this.input.value;
                    this._handleEnter(activeItems, value);                    
                }

                if(hasActiveDropdown) {
                    const highlighted = this.dropdown.querySelector(`.${this.config.classNames.highlightedState}`);
                
                    if(highlighted) {
                        const value = highlighted.getAttribute('data-value');
                        const label = highlighted.innerHTML;
                        const id    = highlighted.getAttribute('data-id');
                        this._addItem(value, label, id);
                        this._triggerChange(value);
                        this.clearInput(this.passedElement);

                        if(this.passedElement.type === 'select-one') {
                            this.isSearching = false;
                            this.store.dispatch(activateChoices());
                            this.toggleDropdown();
                        }
                    }
                }

                break;

            case escapeKey:
                if(hasActiveDropdown) this.toggleDropdown();
                break;

            case downKey:
            case upKey:
                // If up or down key is pressed, traverse through options
                if(hasActiveDropdown) {
                    const currentEl    = this.dropdown.querySelector(`.${this.config.classNames.highlightedState}`);
                    const directionInt = e.keyCode === downKey ? 1 : -1;
                    let nextEl;

                    this.canSearch = false;

                    if(currentEl) {
                        nextEl = getAdjacentEl(currentEl, '[data-option-selectable]', directionInt);
                    } else {
                        nextEl = this.dropdown.querySelector('[data-option-selectable]');
                    }
                
                    if(nextEl) {
                        // We prevent default to stop the cursor moving 
                        // when pressing the arrow
                        if(!isScrolledIntoView(nextEl, this.choiceList, directionInt)) {
                            this._scrollToChoice(nextEl, directionInt);
                        }
                        this._highlightChoice(nextEl);
                    }

                    // Prevent default to maintain cursor position whilst
                    // traversing dropdown options
                    e.preventDefault();
                }
                break

            case backKey:
            case deleteKey:
                // If backspace or delete key is pressed and the input has no value
                if(hasFocusedInput && !e.target.value && this.passedElement.type !== 'select-one') {
                    this._handleBackspace(activeItems);
                    e.preventDefault();
                }
                break;

            default:
                break;
        }
    }

    /**
     * Key up event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onKeyUp(e) {
        if(e.target !== this.input) return;
        const keyString = String.fromCharCode(e.keyCode);

        // We are typing into a text input and have a value, we want to show a dropdown
        // notice. Otherwise hide the dropdown
        if(this.passedElement.type === 'text') {
            const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
            let dropdownItem;
            if(this.input.value) {
                const activeItems = this.store.getItemsFilteredByActive();
                const isUnique = !activeItems.some((item) => item.value === this.input.value);

                if (this.config.maxItemCount && this.config.maxItemCount > 0 && this.config.maxItemCount <= this.itemList.children.length) {
                    dropdownItem = this._getTemplate('notice', `Only ${ this.config.maxItemCount } options can be added.`);
                } else if(!this.config.duplicateItems && !isUnique) {
                    dropdownItem = this._getTemplate('notice', `Only unique values can be added.`);
                } else {
                    dropdownItem = this._getTemplate('notice', `Add "${ this.input.value }"`);
                }
                
                if((this.config.regexFilter && this._regexFilter(this.input.value)) || !this.config.regexFilter) {
                    this.dropdown.innerHTML = dropdownItem.outerHTML;
                    if(!this.dropdown.classList.contains(this.config.classNames.activeState)) {
                        this.showDropdown();    
                    }
                }

            } else {
                if(hasActiveDropdown) {
                    this.hideDropdown();  
                }
            }
        }

        // If we have enabled text search
        if(this.canSearch) {
            // .. and our input is in focus
            if(this.input === document.activeElement) {
                const choices            = this.store.getChoices();
                const hasUnactiveChoices = choices.some((option) => option.active !== true);

                // Check that we have a value to search and the input was an alphanumeric character
                if(this.input.value && this.input.value.length > 1) {
                    const handleFilter = () => {
                        const newValue = isType('String', this.input.value) ? this.input.value.trim() : this.input.value;
                        const currentValue = isType('String', this.currentValue) ? this.currentValue.trim() : this.currentValue;

                        if(newValue.length >= 1 && newValue !== currentValue + ' ') {
                            const haystack = this.store.getChoicesFiltedBySelectable();
                            const needle   = newValue;
                            const fuse = new Fuse(haystack, { 
                                keys: ['label', 'value'],
                                shouldSort: true,
                                include: 'score',
                            });
                            const results = fuse.search(needle);

                            this.currentValue = newValue;
                            this.highlightPosition = 0;
                            this.isSearching = true;
                            this.store.dispatch(filterChoices(results));
                        }
                    };
    
                    handleFilter();
                } else if(hasUnactiveChoices) {
                    // Otherwise reset choices to active
                    this.isSearching = false;
                    this.store.dispatch(activateChoices(true));
                }
            }
        } 
    }

    /**
     * Input event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onInput(e) {
        if(this.passedElement.type !== 'select-one') {
            this.input.style.width = getWidthOfInput(this.input);
        }
    }

    /**
     * Click event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onMouseDown(e) {
        const activeItems = this.store.getItemsFilteredByActive();
        const target = e.target || e.touches[0].target;

        // If click is affecting a child node of our element
        if(this.containerOuter.contains(target)) {

            // Prevent blur event triggering causing dropdown to close
            // in a race condition
            e.preventDefault();

            const hasShiftKey = e.shiftKey ? true : false;

            if(!this.dropdown.classList.contains(this.config.classNames.activeState)) {
                if(this.passedElement.type !== 'text') {
                    // For select inputs we always want to show the dropdown if it isn't already showing
                    this.showDropdown();
                }
                
                // If input is not in focus, it ought to be 
                if(this.input !== document.activeElement) {
                    this.input.focus();
                }
            } else if(this.passedElement.type === 'select-one' && this.dropdown.classList.contains(this.config.classNames.activeState) && e.target === this.containerInner) {
                this.hideDropdown();
            }

            if(target.hasAttribute('data-button')) {
                // If we are clicking on a button
                if(this.config.removeItems && this.config.removeItemButton) {
                    const itemId       = target.parentNode.getAttribute('data-id');
                    const itemToRemove = activeItems.find((item) => item.id === parseInt(itemId));

                    // Remove item associated with button
                    this._removeItem(itemToRemove);
                    this._triggerChange(itemToRemove.value);
                }
            } else if(target.hasAttribute('data-item')) {
                // If we are clicking on an item
                if(this.config.removeItems) {
                    const passedId = target.getAttribute('data-id');

                    // We only want to select one item with a click
                    // so we deselect any items that aren't the target
                    // unless shift is being pressed
                    activeItems.forEach((item) => {
                        if(item.id === parseInt(passedId) && !item.highlighted) {
                            this.highlightItem(item);
                        } else if(!hasShiftKey) {
                            this.unhighlightItem(item);
                        }
                    });
                }
            } else if(target.hasAttribute('data-option')) {
                // If we are clicking on an option
                const id = target.getAttribute('data-id');
                const choices = this.store.getChoicesFilteredByActive();
                const choice = choices.find((choice) => choice.id === parseInt(id));

                if(!choice.selected && !choice.disabled) {
                    this._addItem(choice.value, choice.label, choice.id);
                    this._triggerChange(choice.value);
                    if(this.passedElement.type === 'select-one') {
                        this.input.value = "";
                        this.isSearching = false;
                        this.store.dispatch(activateChoices(true));
                        this.toggleDropdown();
                    }
                }
            }

        } else {
            // Click is outside of our element so close dropdown and de-select items
            const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
            const hasHighlightedItems  = activeItems.some((item) => item.highlighted === true);

            // De-select any highlighted items
            if(hasHighlightedItems) {
                this.unhighlightAll();
            }
        
            // Remove focus state
            this.containerOuter.classList.remove(this.config.classNames.focusState);

            // Close all other dropdowns
            if(hasActiveDropdown) {
                this.toggleDropdown();
            }
        }
    }

    /**
     * Mouse over (hover) event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onMouseOver(e) {
        // If the dropdown is either the target or one of its children is the target
        if((e.target === this.dropdown || findAncestor(e.target, this.config.classNames.listDropdown))) {
            if(e.target.hasAttribute('data-option')) this._highlightChoice(e.target);
        }
    }

    /**
     * Paste event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onPaste(e) {
        if(e.target !== this.input) return;
        // Disable pasting into the input if option has been set
        if(!this.config.paste) {
            e.preventDefault();  
        }
    }


    /**
     * Focus event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onFocus(e) {
        const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);
        if(e.target === this.input && !hasActiveDropdown) {
            this.containerOuter.classList.add(this.config.classNames.focusState);
            if(this.passedElement.type === 'select-one' || this.passedElement.type === 'select-multiple'){
                this.showDropdown();  
            }
        } else if(this.passedElement.type === 'select-one' && e.target === this.containerOuter && !hasActiveDropdown) {            
            this.containerOuter.classList.add(this.config.classNames.focusState);
            this.showDropdown();
            if(this.canSearch) {
                this.input.focus();
            }
        }
    }

    /**
     * Blur event
     * @param  {Object} e Event
     * @return
     * @private
     */
    _onBlur(e) {
        const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);

        // If the blurred element is this input
        if(e.target === this.input) {
            // Remove the focus state
            this.containerOuter.classList.remove(this.config.classNames.focusState);
        }

        // Close the dropdown if there is one
        if(hasActiveDropdown) {
            this.hideDropdown();
        }
    }


    /**
     * Tests value against a regular expression
     * @param  {string} value   Value to test
     * @return {Boolean}        Whether test passed/failed
     * @private
     */
    _regexFilter(value) {
        if(!value) return;
        const expression = new RegExp(this.config.regexFilter, 'i');
        return expression.test(value);
    }

    /**
     * Scroll to an option element
     * @param  {HTMLElement} option  Option to scroll to
     * @param  {Number} direction  Whether option is above or below 
     * @return
     * @private
     */
    _scrollToChoice(choice, direction) {
        if(!choice) return;
        
        const dropdownHeight = this.choiceList.offsetHeight;
        const choiceHeight   = choice.offsetHeight;

        // Distance from bottom of element to top of parent
        const choicePos = choice.offsetTop + choiceHeight;
        
        // Scroll position of dropdown
        const containerScrollPos = this.choiceList.scrollTop + dropdownHeight;
        
        // Difference between the choice and scroll position
        let endPoint = direction > 0 ? ((this.choiceList.scrollTop + choicePos) - containerScrollPos) : choice.offsetTop;

        const animateScroll = (time, endPoint, direction) => {
            let continueAnimation = false;
            let easing, distance;
            const strength = 4;

            if(direction > 0) {
                easing = (endPoint - this.choiceList.scrollTop)/strength;
                distance = easing > 1 ? easing : 1;

                this.choiceList.scrollTop = this.choiceList.scrollTop + distance;
                if(this.choiceList.scrollTop < endPoint) {
                    continueAnimation = true;
                }
            } else {
                easing = (this.choiceList.scrollTop - endPoint)/strength;
                distance = easing > 1 ? easing : 1;

                this.choiceList.scrollTop = this.choiceList.scrollTop - distance;
                if(this.choiceList.scrollTop > endPoint) {
                    continueAnimation = true;
                }
            }

            if(continueAnimation) {
                requestAnimationFrame((time) => {
                    animateScroll(time, endPoint, direction);
                });
            }
        };

        requestAnimationFrame((time) => {
            animateScroll(time, endPoint, direction);
        });
    }

    /**
     * Highlight choice
     * @param  {HTMLElement} el Element to highlight
     * @return
     * @private
     */
    _highlightChoice(el) {
        // Highlight first element in dropdown
        const choices = Array.from(this.dropdown.querySelectorAll('[data-option-selectable]'));

        if(choices && choices.length) {
            const highlightedChoices = Array.from(this.dropdown.querySelectorAll(`.${this.config.classNames.highlightedState}`));
            
            // Remove any highlighted choices 
            highlightedChoices.forEach((el) => {
                el.classList.remove(this.config.classNames.highlightedState);
            });

            if(el){
                // Highlight given option
                el.classList.add(this.config.classNames.highlightedState); 
                this.highlightPosition = choices.indexOf(el);   
            } else {
                // Highlight option based on last known highlight location
                let el;

                if(choices.length > this.highlightPosition) {
                    // If we have an option to highlight 
                    el = choices[this.highlightPosition];
                } else {
                    // Otherwise highlight the option before
                    el = choices[choices.length - 1];
                }

                if(!el) el = choices[0];
                el.classList.add(this.config.classNames.highlightedState);    
            }        
        }
    }


    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     * @return {Object} Class instance
     * @public
     */
    _addItem(value, label, choiceId = -1) {
        const items        = this.store.getItems();
        let passedValue    = isType('String', value) ? value.trim() : value;
        let passedLabel    = label || passedValue;
        let passedOptionId = parseInt(choiceId) || -1;

        // If a prepended value has been passed, prepend it
        if(this.config.prependValue) {
            passedValue = this.config.prependValue + passedValue.toString();
        }

        // If an appended value has been passed, append it
        if(this.config.appendValue) {
            passedValue = passedValue + this.config.appendValue.toString();
        }

        // Generate unique id
        const id = items ? items.length + 1 : 1;

        this.store.dispatch(addItem(passedValue, passedLabel, id, passedOptionId));

        if(this.passedElement.type === 'select-one') {
            this.removeActiveItems(id);
        }  

        // Run callback if it is a function
        if(this.config.callbackOnAddItem){
            const callback = this.config.callbackOnAddItem;
            if(isType('Function', callback)) {
                callback(id, passedValue, this.passedElement);
            } else {
                console.error('callbackOnAddItem: Callback is not a function');
            }
        }

        return this;
    }

    /**
     * Remove item from store
     * @param
     * @return {Object} Class instance
     * @public
     */
    _removeItem(item, callback = this.config.callbackOnRemoveItem) {
        if(!item || !isType('Object', item)) {
            console.error('removeItem: No item object was passed to be removed');
            return;
        }

        const id       = item.id;
        const value    = item.value;
        const choiceId = item.choiceId;

        this.store.dispatch(removeItem(id, choiceId));

        // Run callback
        if(callback){
            if(!isType('Function', callback)) console.error('callbackOnRemoveItem: Callback is not a function'); return;
            callback(id, value, this.passedElement);
        }

        return this;
    }

    /** 
     * Add choice to dropdoww
     * @return
     * @private
     */
    _addChoice(isSelected, isDisabled, value, label, groupId = -1) {
        if(!value) return

        if(!label) { label = value; }

        // Generate unique id
        const choices    = this.store.getChoices();
        const id         = choices ? choices.length + 1 : 1;

        this.store.dispatch(addChoice(value, label, id, groupId, isDisabled));

        if(isSelected && !isDisabled) {
            this._addItem(value, label, id);
        }
    }

    /**
     * Add group to dropdown
     * @param {Object} group Group to add
     * @param {Number} index Whether this is the first group to add
     * @return
     * @private
     */
    _addGroup(group, id, isFirst) {
        const groupChoices = Array.from(group.getElementsByTagName('OPTION'));
        const groupId      = id;

        if(groupChoices) {
            this.store.dispatch(addGroup(group.label, groupId, true, group.disabled));
            groupChoices.forEach((option, optionIndex) => {
                const isDisabled = option.disabled || option.parentNode.disabled;
                this._addChoice(option.selected, isDisabled, option.value, option.innerHTML, groupId);   
            });
        } else {
            this.store.dispatch(addGroup(group.label, group.id, false, group.disabled));
        }
    }

    /**
     * Get template from name
     * @param  {String}    template Name of template to get
     * @param  {...}       args     Data to pass to template
     * @return {HTMLElement}        Template
     * @private
     */
    _getTemplate(template, ...args) {
        if(!template) return;
        const templates = this.config.templates;
        return templates[template](...args);
    }

    /**
     * Create HTML element based on type and arguments
     * @return
     * @private
     */
    _createTemplates() {
        const classNames = this.config.classNames;
        const templates = {
            containerOuter: () => {
                if(this.passedElement.type === 'select-one') {
                    return strToEl(`
                        <div class="${ classNames.containerOuter }" data-type="${ this.passedElement.type }" tabindex="0"></div>
                    `);
                } else {
                    return strToEl(`
                        <div class="${ classNames.containerOuter }" data-type="${ this.passedElement.type }"></div>
                    `);
                }
            },
            containerInner: () => {
                return strToEl(`<div class="${ classNames.containerInner }"></div>`);
            },
            itemList: () => {
                return strToEl(`<div class="${ classNames.list } ${ this.passedElement.type === 'select-one' ? classNames.listSingle : classNames.listItems }"></div>`);
            },
            item: (data) => {
                if(this.config.removeItemButton && this.passedElement.type !== 'select-one') {
                    return strToEl(`
                        <div class="${ classNames.item } ${ data.highlighted ? classNames.highlightedState : ''} ${ !data.disabled ? classNames.itemSelectable : '' }" data-item data-id="${ data.id }" data-value="${ data.value }" data-deletable>
                            ${ data.label }
                            <button class="${ classNames.button }" data-button>Remove item</button>
                        </div>
                    `);
                } else {
                    return strToEl(`
                        <div class="${ classNames.item } ${ data.highlighted ? classNames.highlightedState : classNames.itemSelectable }" data-item data-id="${ data.id }" data-value="${ data.value }">
                            ${ data.label }
                        </div>
                    `);
                }   
            },
            choiceList: () => {
                return strToEl(`<div class="${ classNames.list }"></div>`);
            },
            choiceGroup: (data) => {
                return strToEl(`
                    <div class="${ classNames.group } ${ data.disabled ? classNames.itemDisabled : '' }" data-group data-id="${ data.id }" data-value="${ data.value }">
                        <div class="${ classNames.groupHeading }">${ data.value }</div>
                    </div>
                `);
            },
            choice: (data) => {
                return strToEl(`
                    <div class="${ classNames.item } ${ classNames.itemChoice } ${ data.disabled ? classNames.itemDisabled : classNames.itemSelectable }" data-option ${ data.disabled ? 'data-option-disabled' : 'data-option-selectable' } data-id="${ data.id }" data-value="${ data.value }">
                        ${ data.label }
                    </div>
                `);
            },
            input: () => {
                return strToEl(`<input type="text" class="${ classNames.input } ${ classNames.inputCloned }">`);
            },
            dropdown: () => {
                return strToEl(`<div class="${ classNames.list } ${ classNames.listDropdown }"></div>`);
            },
            notice: (label, clickable) => {
                return strToEl(`<div class="${ classNames.item } ${ classNames.itemChoice }">${ label }</div>`);
            },
            option: (data) => {
                return strToEl(`<option value="${ data.value }" selected>${ data.label }</option>`);
            },
        };

        // this.config.templates = extend(this.config.templates, templates);
        this.config.templates = templates;
    }

    /**
     * Create DOM structure around passed select element
     * @return
     * @private
     */
    _createInput() {
        const containerOuter = this._getTemplate('containerOuter');
        const containerInner = this._getTemplate('containerInner');
        const itemList       = this._getTemplate('itemList');
        const choiceList     = this._getTemplate('choiceList');
        const input          = this._getTemplate('input');
        const dropdown       = this._getTemplate('dropdown');

        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input          = input;
        this.choiceList     = choiceList;
        this.itemList       = itemList;
        this.dropdown       = dropdown;

        // Hide passed input
        this.passedElement.classList.add(this.config.classNames.input, this.config.classNames.hiddenState);
        this.passedElement.tabIndex = '-1';
        this.passedElement.setAttribute('style', 'display:none;');
        this.passedElement.setAttribute('aria-hidden', 'true');
        this.passedElement.setAttribute('data-choice', 'active');

        // Wrap input in container preserving DOM ordering
        wrap(this.passedElement, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);
        
        // If placeholder has been enabled and we have a value
        if (this.config.placeholder && (this.config.placeholderValue || this.passedElement.placeholder)) {
            const placeholder = this.config.placeholderValue || this.passedElement.placeholder;
            input.placeholder = placeholder;  
            if(this.passedElement.type !== 'select-one') {
                input.style.width = getWidthOfInput(input);
            }
        }

        if(!this.config.addItems) this.disable();

        containerOuter.appendChild(containerInner);
        containerOuter.appendChild(dropdown);
        containerInner.appendChild(itemList);
        dropdown.appendChild(choiceList);

        if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'text') {
            containerInner.appendChild(input);
        } else if(this.config.search) {
            dropdown.insertBefore(input, dropdown.firstChild);
        }

        if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'select-one') {
            const passedGroups = Array.from(this.passedElement.getElementsByTagName('OPTGROUP'));

            this.highlightPosition = 0;
            this.isSearching = false;
            
            if(passedGroups && passedGroups.length) {
                passedGroups.forEach((group, index) => {
                    const isFirst = index === 0 ? true : false;
                    this._addGroup(group, index, isFirst);
                });
            } else {
                const passedOptions = Array.from(this.passedElement.options);
                let allChoices = [];

                // Create array of options from option elements
                passedOptions.forEach((o) => {
                    allChoices.push({
                        value: o.value,
                        label: o.innerHTML,
                        selected: o.selected,
                        disabled: o.disabled || o.parentNode.disabled
                    });
                });

                // Join choices with preset choices and add them
                allChoices
                    .concat(this.presetChoices)
                    .forEach((o, index) => {
                        if(index === 0) {
                            this._addChoice(true, o.disabled ? o.disabled : false, o.value, o.label);
                        } else {
                            this._addChoice(o.selected ? o.selected : false, o.disabled ? o.disabled : false, o.value, o.label);
                        }
                    });
            }
        } else if(this.passedElement.type === 'text') {
            // Add any preset values seperated by delimiter
            this.presetItems.forEach((item) => {
                if(isType('Object', item)) {
                    if(!item.value) return;
                    this._addItem(item.value, item.label, item.id);
                } else if(isType('String', item)) {
                    this._addItem(item);
                }
            });
        }
    }

    /**
     * Render group choices into a DOM fragment and append to choice list
     * @param  {Array} groups    Groups to add to list
     * @param  {Array} choices   Choices to add to groups
     * @param  {DocumentFragment} fragment Fragment to add groups and options to (optional)
     * @return {DocumentFragment} Populated options fragment
     * @private
     */
    renderGroups(groups, choices, fragment) {
        const groupFragment = fragment || document.createDocumentFragment();

        groups.forEach((group, i) => {
            // Grab options that are children of this group
            const groupChoices = choices.filter((choice) => {
                if(this.passedElement.type === 'select-one') {
                    return choice.groupId === group.id    
                } else {
                    return choice.groupId === group.id && !choice.selected;
                }
            });

            if(groupChoices.length >= 1) {
                const dropdownGroup = this._getTemplate('choiceGroup', group);

                groupFragment.appendChild(dropdownGroup);

                this.renderChoices(groupChoices, groupFragment);
            }
        });

        return groupFragment;
    }

    /**
     * Render choices into a DOM fragment and append to choice list
     * @param  {Array} choices    Choices to add to list
     * @param  {DocumentFragment} fragment Fragment to add choices to (optional)
     * @return {DocumentFragment} Populated choices fragment
     * @private
     */
    renderChoices(choices, fragment) {
        // Create a fragment to store our list items (so we don't have to update the DOM for each item)
        const choicesFragment = fragment || document.createDocumentFragment();

        choices.forEach((choice, i) => {
            const dropdownItem = this._getTemplate('choice', choice);

            if(this.passedElement.type === 'select-one') {
                choicesFragment.appendChild(dropdownItem);    
            } else if(!choice.selected) {
                choicesFragment.appendChild(dropdownItem);   
            }
        });

        return choicesFragment;
    }

    /**
     * Render items into a DOM fragment and append to items list
     * @param  {Array} items    Items to add to list
     * @param  {DocumentFragment} fragment Fragrment to add items to (optional)
     * @return
     * @private
     */
    renderItems(items, fragment) {
        // Create fragment to add elements to
        const itemListFragment = fragment || document.createDocumentFragment();
        // Simplify store data to just values
        const itemsFiltered = this.store.getItemsReducedToValues(items);

        if(this.passedElement.type === 'text') {
            // Assign hidden input array of values
            this.passedElement.setAttribute('value', itemsFiltered.join(this.config.delimiter));          
        } else {
            const selectedOptionsFragment = document.createDocumentFragment();

            // Add each list item to list
            items.forEach((item) => {
                // Create a standard select option
                const option = this._getTemplate('option', item);

                // Append it to fragment
                selectedOptionsFragment.appendChild(option);
            });

            // Update selected choices
            this.passedElement.innerHTML = "";
            this.passedElement.appendChild(selectedOptionsFragment);
        }

        // Add each list item to list
        items.forEach((item) => {
            // Create new list element 
            const listItem = this._getTemplate('item', item);

            // Append it to list
            itemListFragment.appendChild(listItem);
        });

        return itemListFragment;
    }

    /**
     * Render DOM with values
     * @return
     * @private
     */
    render() {
        this.currentState = this.store.getState();

        // Only render if our state has actually changed
        if(this.currentState !== this.prevState) {

            // Choices
            if((this.currentState.choices !== this.prevState.choices || this.currentState.groups !== this.prevState.groups)) {
                if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'select-one') {
                    // Get active groups/choices
                    const activeGroups    = this.store.getGroupsFilteredByActive();
                    const activeChoices   = this.store.getChoicesFilteredByActive();

                    let choiceListFragment = document.createDocumentFragment();

                    // Clear choices
                    this.choiceList.innerHTML = '';
                    // Scroll back to top of choices list
                    this.choiceList.scrollTop = 0;

                    // If we have grouped options
                    if(activeGroups.length >= 1 && this.isSearching !== true) {
                        choiceListFragment = this.renderGroups(activeGroups, activeChoices, choiceListFragment);
                    } else if(activeChoices.length >= 1) {
                        choiceListFragment = this.renderChoices(activeChoices, choiceListFragment);
                    }
        
                    if(choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
                        // If we actually have anything to add to our dropdown
                        // append it and highlight the first choice
                        this.choiceList.appendChild(choiceListFragment);
                        this._highlightChoice();
                    } else {
                        // Otherwise show a notice
                        const dropdownItem = this.isSearching ? this._getTemplate('notice', 'No results found') : this._getTemplate('notice', 'No choices to choose from');
                        this.choiceList.appendChild(dropdownItem);
                    }
                }
            }
            
            // Items
            if(this.currentState.items !== this.prevState.items) {
                const activeItems = this.store.getItemsFilteredByActive();
                if(activeItems) {
                    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
                    const itemListFragment = this.renderItems(activeItems);

                    // Clear list
                    this.itemList.innerHTML = '';

                    // If we have items to add
                    if(itemListFragment.children && itemListFragment.children.length) {
                        // Update list
                        this.itemList.appendChild(itemListFragment);
                    }
                }
            }

            this.prevState = this.currentState;
        }
    }

    /**
     * Trigger event listeners
     * @return
     * @private
     */
    _addEventListeners() {
        document.addEventListener('keyup', this._onKeyUp);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('mousedown', this._onMouseDown);
        document.addEventListener('mouseover', this._onMouseOver);

        if(this.passedElement.type && this.passedElement.type === 'select-one') {
            this.containerOuter.addEventListener('focus', this._onFocus);
        }

        this.input.addEventListener('input', this._onInput);
        this.input.addEventListener('paste', this._onPaste);
        this.input.addEventListener('focus', this._onFocus);
        this.input.addEventListener('blur', this._onBlur);
    }

    /**
     * Destroy event listeners
     * @return
     * @private
     */
    _removeEventListeners() {
        document.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mouseover', this._onMouseOver);

        if(this.passedElement.type && this.passedElement.type === 'select-one') {
            this.containerOuter.removeEventListener('focus', this._onFocus);
        }
        
        this.input.removeEventListener('input', this._onInput);
        this.input.removeEventListener('paste', this._onPaste);
        this.input.removeEventListener('focus', this._onFocus);
        this.input.removeEventListener('blur', this._onBlur);
    }
};

window.Choices = module.exports = Choices;