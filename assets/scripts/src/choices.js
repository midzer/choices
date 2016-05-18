'use strict';

import { addItem, removeItem, selectItem, addOption, filterOptions, activateOptions, addGroup } from './actions/index';
import { isScrolledIntoView, getAdjacentEl, findAncestor, wrap, isType, strToEl, extend, getWidthOfInput, debounce } from './lib/utils.js';
import Fuse from 'fuse.js';
import Store from './store/index.js';

/**
 * Choices
 *
 * To do:
 *    - Pagination
 *    - Single select box search in dropdown
 */
export class Choices {
    constructor(element = '[data-choice]', userOptions = {}) {

        // If there are multiple elements, create a new instance 
        // for each element besides the first one (as that already has an instance)
        if(isType('String', element)) {
            const elements = document.querySelectorAll(element);
            if(elements.length > 1) {
                for (let i = 1; i < elements.length; i++) {
                    const el = elements[i];
                    new Choices(el, userOptions);
                }
            }
        }

        const defaultOptions = {
            items: [],
            addItems: true,
            removeItems: true,
            removeButton: false,
            editItems: false,
            maxItems: false,
            delimiter: ',',
            allowDuplicates: true,
            allowPaste: true,
            allowSearch: true, 
            regexFilter: false,
            placeholder: true,
            placeholderValue: '',
            prependValue: false,
            appendValue: false,
            selectAll: true,
            templates: {},
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
                itemOption: 'choices__item--option',
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
                selectedState: 'is-selected',
            },
            callbackOnInit: () => {},
            callbackOnRemoveItem: () => {},
            callbackOnAddItem: () => {}
        };

        // Merge options with user options
        this.options = extend(defaultOptions, userOptions);

        // Create data store
        this.store = new Store(this.render);

        // State tracking
        this.initialised = false;
        this.currentState = {};
        this.prevState = {};

        // Retrieve triggering element (i.e. element with 'data-choice' trigger)
        this.passedElement = isType('String', element) ? document.querySelector(element) : element;

        this.highlightPosition = 0;

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
        this.disable = this.disable.bind(this);
        
        // Bind event handlers
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onInput = this.onInput.bind(this);

        // Cutting the mustard
        const cuttingTheMustard = 'querySelector' in document && 'addEventListener' in document && 'classList' in document.createElement("div");
        if (!cuttingTheMustard) console.error('Choices: Your browser doesn\'t support Choices');

        // Input type check
        const inputTypes = ['select-one', 'select-multiple', 'text'];
        const canInit = this.passedElement && inputTypes.includes(this.passedElement.type);

        if(canInit) {
            // Let's have it large
            this.init();            
        } else {
            console.error('Choices: Incompatible input passed');
        }

    }
    
    /** 
     * Process enter key event
     * @param  {Array} activeItems Items that are currently active
     * @return
     */
    handleEnter(activeItems, value) {
        let canUpdate = true;

        if(this.options.addItems) {
            if (this.options.maxItems && this.options.maxItems <= this.itemList.children.length) {
                // If there is a max entry limit and we have reached that limit
                // don't update
                canUpdate = false;
            } else if(this.options.allowDuplicates === false && this.passedElement.value) {
                // If no duplicates are allowed, and the value already exists
                // in the array, don't update
                canUpdate = !activeItems.some((item) => item.value === value );
            }   
        } else {
            canUpdate = false;
        }

        if (canUpdate) {
            let canAddItem = true;

            // If a user has supplied a regular expression filter
            if(this.options.regexFilter) {
                // Determine whether we can update based on whether 
                // our regular expression passes 
                canAddItem = this.regexFilter(value);
            }
            
            // All is good, add
            if(canAddItem) {
                this.toggleDropdown();
                this.addItem(value);
                this.clearInput(this.passedElement);
            }
        }
    };

    /**
     * Process back space event
     * @param  {Array} Active items
     * @return
     */
    handleBackspace(activeItems) {
        if(this.options.removeItems && activeItems) {
            const lastItem = activeItems[activeItems.length - 1];
            const hasSelectedItems = activeItems.some((item) => item.selected === true);

            // If editing the last item is allowed and there are not other selected items, 
            // we can edit the item value. Otherwise if we can remove items, remove all selected items
            if(this.options.editItems && !hasSelectedItems && lastItem) {
                this.input.value = lastItem.value;
                this.removeItem(lastItem);
            } else {
                if(!hasSelectedItems) { this.selectItem(lastItem); }
                this.removeSelectedItems();    
            }
        }
    };

    /**
     * Key down event
     * @param  {Object} e Event
     * @return
     */
    onKeyDown(e) {
        if(e.target !== this.input) return;

        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const backKey = 46;
        const deleteKey = 8;
        const enterKey = 13;
        const aKey = 65;
        const escapeKey = 27;
        const upKey = 38;
        const downKey = 40;

        const activeItems = this.store.getItemsFilteredByActive();
        const activeOptions = this.store.getOptionsFilteredByActive();

        const hasFocusedInput = this.input === document.activeElement;
        const hasActiveDropdown = this.dropdown.classList.contains(this.options.classNames.activeState);
        const hasItems = this.itemList && this.itemList.children;
        const keyString = String.fromCharCode(event.keyCode);

        // If a user is typing and the dropdown is not active
        if(this.passedElement.type !== 'text' && /[a-zA-Z0-9-_ ]/.test(keyString) && !hasActiveDropdown) {
            this.showDropdown();
        }

        switch (e.keyCode) {
            case aKey:
                // If CTRL + A or CMD + A have been pressed and there are items to select
                if(ctrlDownKey && hasItems) {
                    if(this.options.removeItems && !this.input.value && this.options.selectAll && this.input === document.activeElement) {
                        this.selectAll(this.itemList.children);
                    }
                }
                break;

            case enterKey:
                if(this.passedElement.type === 'select-one') this.toggleDropdown();

                // If enter key is pressed and the input has a value
                if(e.target.value && this.passedElement.type === 'text') {
                    const value = this.input.value;
                    this.handleEnter(activeItems, value);                    
                }

                if(hasActiveDropdown) {
                    const highlighted = this.dropdown.querySelector(`.${this.options.classNames.highlightedState}`);
                
                    if(highlighted) {
                        const value = highlighted.getAttribute('data-value');
                        const label = highlighted.innerHTML;
                        const id = highlighted.getAttribute('data-id');
                        this.addItem(value, label, id);
                        this.clearInput(this.passedElement);
                    }
                }
                break;

            case escapeKey:
                if(hasActiveDropdown) {
                    this.toggleDropdown();
                }
                break;

            case downKey:
            case upKey:
                // If up or down key is pressed, traverse through options
                if(hasActiveDropdown) {
                    const currentEl = this.dropdown.querySelector(`.${this.options.classNames.highlightedState}`);
                    const directionInt = e.keyCode === downKey ? 1 : -1;
                    let nextEl;

                    if(currentEl) {
                        nextEl = getAdjacentEl(currentEl, '[data-option-selectable]', directionInt);
                    } else {
                        nextEl = this.dropdown.querySelector('[data-option-selectable]');
                    }
                
                    if(nextEl) {
                        // We prevent default to stop the cursor moving 
                        // when pressing the arrow
                        if(!isScrolledIntoView(nextEl, this.dropdown, directionInt)) {
                            this.scrollToOption(nextEl, directionInt);
                        }
                        this.highlightOption(nextEl);
                    }
                }
                break

            case backKey:
            case deleteKey:
                // If backspace or delete key is pressed and the input has no value
                if(hasFocusedInput && !e.target.value) {
                    this.handleBackspace(activeItems);
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
     */
    onKeyUp(e) {
        if(e.target !== this.input) return;

        // We are typing into a text input and have a value, we want to show a dropdown
        // notice. Otherwise hide the dropdown
        if(this.passedElement.type === 'text') {
            const hasActiveDropdown = this.dropdown.classList.contains(this.options.classNames.activeState);
            let dropdownItem;
            if(this.input.value) {

                const activeItems = this.store.getItemsFilteredByActive();
                const isUnique = !activeItems.some((item) => item.value === this.input.value);

                if (this.options.maxItems && this.options.maxItems <= this.itemList.children.length) {
                    dropdownItem = this.getTemplate('notice', `Only ${ this.options.maxItems } options can be added.`);
                } else if(!this.options.allowDuplicates && !isUnique) {
                    dropdownItem = this.getTemplate('notice', `Only unique values can be added.`);
                } else {
                    dropdownItem = this.getTemplate('notice', `Add "${ this.input.value }"`);
                }
                
                if((this.options.regexFilter && this.regexFilter(this.input.value)) || !this.options.regexFilter) {
                    this.dropdown.innerHTML = dropdownItem.outerHTML;
                    if(!this.dropdown.classList.contains(this.options.classNames.activeState)) {
                        this.showDropdown();    
                    }
                }

            } else {
                if(hasActiveDropdown) this.hideDropdown();
            }
        }

        if(this.options.allowSearch) {
            if(this.input === document.activeElement) {
                const options = this.store.getOptions();
                const hasUnactiveOptions = options.some((option) => option.active !== true);

                // Check that have a value to search
                if(this.input.value && options.length) {
                    const handleFilter = () => {
                        if(this.input.value.length >= 1) {
                            const haystack = this.store.getOptionsFiltedBySelectable();
                            const needle = this.input.value;

                            const fuse = new Fuse(haystack, { 
                                keys: ['label', 'value'],
                                shouldSort: true,
                                include: 'score',
                            });
                            
                            const results = fuse.search(needle);

                            this.highlightPosition = 0;
                            this.isSearching = true;
                            this.store.dispatch(filterOptions(results));
                        }
                    };

                    handleFilter();
                } else if(hasUnactiveOptions) {
                    // Otherwise reset options to active
                    this.isSearching = false;
                    this.store.dispatch(activateOptions());
                }
            }
        } 
    }

    onInput(e) {
        if(this.passedElement.type !== 'select-one') {
            this.input.style.width = getWidthOfInput(this.input);    
        }
    }

    /**
     * Click event
     * @param  {Object} e Event
     * @return
     */
    onMouseDown(e) {
        // If not a right click
        if(e.button !== 2) {
            const activeItems = this.store.getItemsFilteredByActive();

            // If click is affecting a child node of our element
            if(this.containerOuter.contains(e.target)) {

                // Prevent blur event triggering causing dropdown to close
                // in a race condition
                e.preventDefault();

                const hasShiftKey = e.shiftKey ? true : false;

                // If input is not in focus, it ought to be 
                if(this.input !== document.activeElement) {
                    this.input.focus();
                }

                if(this.passedElement.type !== 'text' && !this.dropdown.classList.contains(this.options.classNames.activeState)) {
                    // For select inputs we always want to show the dropdown if it isn't already showing
                    this.showDropdown();
                }

                if(e.target.hasAttribute('data-button')) {
                    if(this.options.removeItems && this.options.removeButton) {
                        const itemId = e.target.parentNode.getAttribute('data-id');
                        const itemToRemove = activeItems.find((item) => item.id === parseInt(itemId));
                        this.removeItem(itemToRemove);
                    }
                } else if(e.target.hasAttribute('data-item')) {
                    // If we are clicking on an item
                    if(this.options.removeItems) {
                        const passedId = e.target.getAttribute('data-id');

                        // We only want to select one item with a click
                        // so we deselect any items that aren't the target
                        // unless shift is being pressed
                        activeItems.forEach((item) => {
                            if(item.id === parseInt(passedId) && !item.selected) {
                                this.selectItem(item);
                            } else if(!hasShiftKey) {
                                this.deselectItem(item);
                            }
                        });
                    }
                } else if(e.target.hasAttribute('data-option')) {
                    // If we are clicking on an option
                    const options = this.store.getOptionsFilteredByActive();
                    const id = e.target.getAttribute('data-id');
                    const option = options.find((option) => option.id === parseInt(id));

                    if(!option.selected && !option.disabled) {
                        this.addItem(option.value, option.label, option.id);
                        if(this.passedElement.type === 'select-one') {
                            this.toggleDropdown();
                        }
                    }
                }

            } else {
                // Click is outside of our element so close dropdown and de-select items
                const hasActiveDropdown = this.dropdown.classList.contains(this.options.classNames.activeState);
                const hasSelectedItems = activeItems.some((item) => item.selected === true);

                // De-select any selected items
                if(hasSelectedItems) this.deselectAll();
            
                // Remove focus state
                this.containerOuter.classList.remove(this.options.classNames.focusState);

                // Close all other dropdowns
                if(hasActiveDropdown) this.toggleDropdown();
            }
        }
    }


    /**
     * Paste event
     * @param  {Object} e Event
     * @return
     */
    onPaste(e) {
        // Disable pasting into the input if option has been set
        if(!this.options.allowPaste) {
            e.preventDefault();
        }
    }

    /**
     * Mouse over (hover) event
     * @param  {Object} e Event
     * @return
     */
    onMouseOver(e) {
        // If the dropdown is either the target or one of its children is the target
        if((e.target === this.dropdown || findAncestor(e.target, this.options.classNames.listDropdown))) {
            if(e.target.hasAttribute('data-option')) {
                this.highlightOption(e.target);
            }
        }
    }

    /**
     * Focus event
     * @param  {Object} e Event
     * @return
     */
    onFocus(e) {
        const hasActiveDropdown = this.dropdown.classList.contains(this.options.classNames.activeState);
        if(e.target === this.input && !hasActiveDropdown) {
            this.containerOuter.classList.add(this.options.classNames.focusState);
            if(this.passedElement.type === 'select-one' || this.passedElement.type === 'select-multiple'){
                this.showDropdown();    
            }
        }
    }

    /**
     * Blur event
     * @param  {Object} e Event
     * @return
     */
    onBlur(e) {
        const hasActiveDropdown = this.dropdown.classList.contains(this.options.classNames.activeState);
        if(e.target === this.input && !hasActiveDropdown) {
            this.containerOuter.classList.remove(this.options.classNames.focusState);
        } else {
            this.hideDropdown();
        }
    }

    /** 
     * Set value of input to blank
     * @return
     */
    clearInput() {
        if (this.input.value) this.input.value = '';
        if(this.passedElement.type !== 'select-one') {
            this.input.style.width = getWidthOfInput(this.input);
        }
    }

    /**
     * Tests value against a regular expression
     * @param  {string} value   Value to test
     * @return {Boolean}        Whether test passed/failed
     */
    regexFilter(value) {
        if(!value) return;
        const expression = new RegExp(this.options.regexFilter, 'i');
        return expression.test(value);
    }

    /**
     * Scroll to an option element
     * @param  {HTMLElement} option  Option to scroll to
     * @param  {Number} direction  Whether option is above or below 
     * @return
     */
    scrollToOption(option, direction) {
        if(!option) return;
        
        const dropdownHeight = this.dropdown.offsetHeight;
        const optionHeight = option.offsetHeight;

        // Distance from bottom of element to top of parent
        const optionPos = option.offsetTop + optionHeight;

        // Scroll position of dropdown
        const containerScrollPos = this.dropdown.scrollTop + dropdownHeight;

        // Difference between the option and scroll position
        let endPoint;

        const animateScroll = (time, endPoint, direction) => {
            let continueAnimation = false;
            let easing, distance;
            const strength = 4;

            if(direction > 0) {
                easing = (endPoint - this.dropdown.scrollTop)/strength;
                distance = easing > 1 ? easing : 1;

                this.dropdown.scrollTop = this.dropdown.scrollTop + distance;
                if(this.dropdown.scrollTop < endPoint) {
                    continueAnimation = true;
                }
            } else {
                easing = (this.dropdown.scrollTop - endPoint)/strength;
                distance = easing > 1 ? easing : 1;

                this.dropdown.scrollTop = this.dropdown.scrollTop - distance;
                if(this.dropdown.scrollTop > endPoint) {
                    continueAnimation = true;
                }
            }

            if(continueAnimation) {
                requestAnimationFrame((time) => {
                    animateScroll(time, endPoint, direction);
                });
            }
        };

        // Scroll dropdown to top of option
        if(direction > 0) {
            endPoint = (this.dropdown.scrollTop + optionPos) - containerScrollPos;
            requestAnimationFrame((time) => {
                animateScroll(time, endPoint, 1);
            });
        } else {
            endPoint = option.offsetTop;
            requestAnimationFrame((time) => {
                animateScroll(time, endPoint, -1);
            });
        }
    }

    /**
     * Highlight option element 
     * @param  {HTMLElement} el Element to highlight
     * @return
     */
    highlightOption(el) {
        // Highlight first element in dropdown
        const options = Array.from(this.dropdown.querySelectorAll('[data-option-selectable]'));

        if(options.length) {
            const highlightedOptions = Array.from(this.dropdown.querySelectorAll(`.${this.options.classNames.highlightedState}`));
            
            // Remove any highlighted options 
            highlightedOptions.forEach((el) => {
                el.classList.remove(this.options.classNames.highlightedState);
            });

            if(el){
                // Highlight given option
                el.classList.add(this.options.classNames.highlightedState); 
                this.highlightPosition = options.indexOf(el);   
            } else {
                // Highlight option based on last known highlight location
                let el;

                if(options.length > this.highlightPosition) {
                    // If we have an option to highlight 
                    el = options[this.highlightPosition];
                } else {
                    // Otherwise highlight the option before
                    el = options[options.length - 1];
                }

                if(!el) el = options[0];
                el.classList.add(this.options.classNames.highlightedState);    
            }        
        }

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
     * Select items within store
     * @return
     */
    selectAll() {
        const items = this.store.getItems();
        items.forEach((item) => {
            this.selectItem(item);
        });
    }

    /**
     * Deselect items within store
     * @return
     */
    deselectAll() {
        const items = this.store.getItems();
        items.forEach((item) => {
            this.deselectItem(item);
        });
    }

    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     */
    addItem(value, label, optionId = -1, callback = this.options.callbackOnAddItem) {
        const items = this.store.getItems();
        let passedValue = value.trim();
        let passedLabel = label || passedValue;
        let passedOptionId = optionId || -1;

        // If a prepended value has been passed, prepend it
        if(this.options.prependValue) {
            passedValue = this.options.prependValue + passedValue.toString();
        }

        // If an appended value has been passed, append it
        if(this.options.appendValue) {
            passedValue = passedValue + this.options.appendValue.toString();
        }

        // Generate unique id
        const id = items ? items.length + 1 : 1;

        this.store.dispatch(addItem(passedValue, passedLabel, id, passedOptionId));

        if(this.passedElement.type === 'select-one') {
            this.removeActiveItems(id);
        }  

        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback(id, passedValue, this.passedElement);
            } else {
                console.error('callbackOnAddItem: Callback is not a function');
            }
        }
    }

    /**
     * Remove item from store
     * @param
     */
    removeItem(item, callback = this.options.callbackOnRemoveItem) {
        if(!item || !isType('Object', item)) {
            console.error('removeItem: No item object was passed to be removed');
            return;
        }

        const id = item.id;
        const value = item.value;
        const optionId = item.optionId;

        this.store.dispatch(removeItem(id, optionId));

        // Run callback
        if(callback){
            if(!isType('Function', callback)) console.error('callbackOnRemoveItem: Callback is not a function'); return;
            callback(id, value, this.passedElement);
        }
    }

    /**
     * Remove an item from the store by its value
     * @param  {String} value Value to search for
     * @return
     */
    removeItemsByValue(value) {
        if(!value || !isType('String', value)) console.error('removeItemsByValue: No value was passed to be removed'); return;

        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.value === value) {
                this.removeItem(item);
            }
        });
    }

    /**
     * Remove all items from store array
     * Note: removed items are soft deleted
     * @param  {Boolean} selectedOnly Optionally remove only selected items
     * @return
     */
    removeActiveItems(excludedId) {
        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.active && excludedId !== item.id) {
                this.removeItem(item);   
            } 
        });
    }

    /** 
     * Remove all selected items from store
     * Note: removed items are soft deleted
     * @return
     */
    removeSelectedItems() {
        const items = this.store.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.selected && item.active) {
                this.removeItem(item);
            }
        });
    }

    /** 
     * Add option to dropdown
     * @param {Object}  option   Option to add
     * @param {Number}  groupId  ID of the options group
     * @return
     */
    addOption(option, value, label, groupId = -1) {
        if(!value) return

        if(!label) { label = value; }

        // Generate unique id
        const options = this.store.getOptions();
        const id = options.length + 1;
        const isDisabled = option && (option.disabled || option.parentNode.disabled);

        this.store.dispatch(addOption(value, label, id, groupId, isDisabled));

        if(option && option.selected && !isDisabled) {
            this.addItem(value, label, id);
        }
    }

    /**
     * Add group to dropdown
     * @param {Object} group Group to add
     * @param {Number} index Whether this is the first group to add
     */
    addGroup(group, id, isFirst) {
        const groupOptions = Array.from(group.getElementsByTagName('OPTION'));
        const groupId = id;

        if(groupOptions) {
            this.store.dispatch(addGroup(group.label, groupId, true, group.disabled));

            groupOptions.forEach((option, optionIndex) => {
                // We want to pre-highlight the first option
                const highlighted = isFirst && optionIndex === 0 ? true : false;
                this.addOption(option, option.value, option.innerHTML, groupId);   
            });
        } else {
            this.store.dispatch(addGroup(group.label, group.id, false, group.disabled));
        }
    }

    /** 
     * Show dropdown to user by adding active state class
     * @return
     */
    showDropdown() { 
        this.containerOuter.classList.add(this.options.classNames.openState);
        this.dropdown.classList.add(this.options.classNames.activeState);

        const dimensions = this.dropdown.getBoundingClientRect();
        const shouldFlip = dimensions.top + dimensions.height >= document.body.offsetHeight;

        // Whether or not the dropdown should appear above or below input
        if(shouldFlip) {
            this.containerOuter.classList.add(this.options.classNames.flippedState);
        } else {
            this.containerOuter.classList.remove(this.options.classNames.flippedState);
        }
    }

    /** 
     * Hide dropdown from user
     * @return {[type]} [description]
     */
    hideDropdown() {
        // A dropdown flips if it does not have space below the input
        const isFlipped = this.containerOuter.classList.contains(this.options.classNames.flippedState);

        this.containerOuter.classList.remove(this.options.classNames.openState);
        this.dropdown.classList.remove(this.options.classNames.activeState);

        if(isFlipped) {
            this.containerOuter.classList.remove(this.options.classNames.flippedState);
        }
    }

    /** 
     * Determine whether to hide or show dropdown based on its current state
     * @return
     */
    toggleDropdown() {
        const isActive = this.dropdown.classList.contains(this.options.classNames.activeState);

        isActive ? this.hideDropdown() : this.showDropdown();
    }

    /**
     * Disable 
     * @return {[type]} [description]
     */
    disable() {
        this.passedElement.disabled = true;
        if(this.initialised) {
            this.input.disabled = true;
            this.containerOuter.classList.add(this.options.classNames.disabledState);
        }
    }

    /** 
     * Populate options via ajax callback
     * @param  {Function} fn Passed 
     * @return {[type]}      [description]
     */
    ajax(fn) {
        this.containerOuter.classList.add('is-loading');
        this.input.placeholder = "Loading...";

        const callback = (results, value, label) => {
            if(results && results.length) {
                this.containerOuter.classList.remove('is-loading');
                this.input.placeholder = "";
                results.forEach((result, index) => {
                    // Add each result to option dropdown
                    if(index === 0) { 
                       this.addItem(result[value], result[label], index);
                    }
                    this.addOption(null, result[value], result[label]);
                });
            }
        };

        fn(callback);
    }

    /**
     * Get template from name
     * @param  {String}    template Name of template to get
     * @param  {...}       args     Data to pass to template
     * @return {HTMLElement}        Template
     */
    getTemplate(template, ...args) {
        if(!template) return;
        const templates = this.options.templates;
        return templates[template](...args);
    }

    /**
     * Create HTML element based on type and arguments
     * @return
     */
    createTemplates() {
        const classNames = this.options.classNames;
        const templates = {
            containerOuter: () => {
                return strToEl(`<div class="${ classNames.containerOuter }" data-type="${ this.passedElement.type }"></div>`);
            },
            containerInner: () => {
                return strToEl(`<div class="${ classNames.containerInner }"></div>`);
            },
            itemList: () => {
                return strToEl(`<div class="${ classNames.list } ${ this.passedElement.type === 'select-one' ? classNames.listSingle : classNames.listItems }"></div>`);
            },
            optionList: () => {
                return strToEl(`<div class="${ classNames.list }"></div>`);
            },
            input: () => {
                return strToEl(`<input type="text" class="${ classNames.input } ${ classNames.inputCloned }">`);
            },
            dropdown: () => {
                return strToEl(`<div class="${ classNames.list } ${ classNames.listDropdown }"></div>`);
            },
            notice: (label, clickable) => {
                return strToEl(`<div class="${ classNames.item } ${ classNames.itemOption }">${ label }</div>`);
            },
            selectOption: (data) => {
                return strToEl(`<option value="${ data.value }" selected>${ data.label.trim() }</option>`);
            },
            option: (data) => {
                return strToEl(`
                    <div class="${ classNames.item } ${ classNames.itemOption } ${ data.disabled ? classNames.itemDisabled : classNames.itemSelectable }" data-option ${ data.disabled ? 'data-option-disabled' : 'data-option-selectable' } data-id="${ data.id }" data-value="${ data.value }">
                        ${ data.label }
                    </div>
                `);
            },
            optgroup: (data) => {
                return strToEl(`
                    <div class="${ classNames.group } ${ data.disabled ? classNames.itemDisabled : '' }" data-group data-id="${ data.id }" data-value="${ data.value }">
                        <div class="${ classNames.groupHeading }">${ data.value }</div>
                    </div>
                `);
            },
            item: (data) => {
                if(this.options.removeButton) {
                    return strToEl(`
                        <div class="${ classNames.item } ${ data.selected ? classNames.selectedState : ''} ${ !data.disabled ? classNames.itemSelectable : '' }" data-item data-id="${ data.id }" data-value="${ data.value }" data-deletable>
                            ${ data.label }
                            <button class="${ classNames.button }" data-button>Remove item</button>
                        </div>
                    `);
                } else {
                    return strToEl(`
                        <div class="${ classNames.item } ${ data.selected ? classNames.selectedState : classNames.itemSelectable }" data-item data-id="${ data.id }" data-value="${ data.value }">
                            ${ data.label }
                        </div>
                    `);
                }   
            },
        };

        this.options.templates = extend(this.options.templates, templates);
    }

    /**
     * Create DOM structure around passed select element
     * @return
     */
    generateInput() {
        const containerOuter = this.getTemplate('containerOuter');
        const containerInner = this.getTemplate('containerInner');
        const itemList = this.getTemplate('itemList');
        const optionList = this.getTemplate('optionList');
        const input = this.getTemplate('input');
        const dropdown = this.getTemplate('dropdown');

        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.optionList = optionList;
        this.itemList = itemList;
        this.dropdown = dropdown;

        // Hide passed input
        this.passedElement.classList.add(this.options.classNames.input, this.options.classNames.hiddenState);
        this.passedElement.tabIndex = '-1';
        this.passedElement.setAttribute('style', 'display:none;');
        this.passedElement.setAttribute('aria-hidden', 'true');
        this.passedElement.removeAttribute('data-choice');

        // Wrap input in container preserving DOM ordering
        wrap(this.passedElement, containerInner);

        // Wrapper inner container with outer container
        wrap(containerInner, containerOuter);
        
        // If placeholder has been enabled and we have a value
        if (this.options.placeholder && (this.options.placeholderValue || this.passedElement.placeholder)) {
            if(this.passedElement.type !== 'select-one') {
                const placeholder = this.options.placeholderValue || this.passedElement.placeholder;
                input.placeholder = placeholder;  
                input.style.width = getWidthOfInput(input);
            }
        }

        if(!this.options.addItems) this.disable();

        containerOuter.appendChild(containerInner);
        containerOuter.appendChild(dropdown);
        containerInner.appendChild(itemList);
        dropdown.appendChild(optionList);

        if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'text') {
            containerInner.appendChild(input);
        } else {
            dropdown.insertBefore(input, dropdown.firstChild);
        }

        if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'select-one') {
            this.highlightPosition = 0;
            
            const passedGroups = Array.from(this.passedElement.getElementsByTagName('OPTGROUP'));
        
            this.isSearching = false;
        
            if(passedGroups && passedGroups.length) {
                passedGroups.forEach((group, index) => {
                    const isFirst = index === 0 ? true : false;
                    this.addGroup(group, index, isFirst);
                });
            } else {
                const passedOptions = Array.from(this.passedElement.options);
                passedOptions.forEach((option) => {
                    this.addOption(option, option.value, option.innerHTML);
                });
            }

        } else if(this.passedElement.type === 'text') {
            // Add any preset values seperated by delimiter
            this.presetItems.forEach((value) => {
                this.addItem(value);
            });
        }
    }

    renderGroups(groups, options, fragment) {
        const groupFragment = fragment || document.createDocumentFragment();

        groups.forEach((group, i) => {
            // Grab options that are children of this group
            const groupOptions = options.filter((option) => {
                if(this.passedElement.type === 'select-one') {
                    return option.groupId === group.id    
                } else {
                    return option.groupId === group.id && !option.selected;
                }
            });

            if(groupOptions.length >= 1) {
                const dropdownGroup = this.getTemplate('optgroup', group);

                groupFragment.appendChild(dropdownGroup);

                this.renderOptions(groupOptions, groupFragment);
            }
        });

        return groupFragment;
    }

    renderOptions(options, fragment) {
        // Create a fragment to store our list items (so we don't have to update the DOM for each item)
        const optsFragment = fragment || document.createDocumentFragment();

        options.forEach((option, i) => {
            const dropdownItem = this.getTemplate('option', option);

            if(this.passedElement.type === 'select-one') {
                optsFragment.appendChild(dropdownItem);    
            } else if(!option.selected) {
                optsFragment.appendChild(dropdownItem);   
            }
        });

        return optsFragment;
    }

    renderItems(items, fragment) {
        const itemListFragment = fragment || document.createDocumentFragment();
        // Simplify store data to just values
        const itemsFiltered = this.store.getItemsReducedToValues(items);

        if(this.passedElement.type === 'text') {
            // Assign hidden input array of values
            this.passedElement.setAttribute('value', itemsFiltered.join(this.options.delimiter));          
        } else {
            const selectedOptionsFragment = document.createDocumentFragment();

            // Add each list item to list
            items.forEach((item) => {
                // Create a standard select option
                const option = this.getTemplate('selectOption', item);

                // Append it to fragment
                selectedOptionsFragment.appendChild(option);
            });

            // Update selected options
            this.passedElement.innerHTML = "";
            this.passedElement.appendChild(selectedOptionsFragment);
        }

        // Add each list item to list
        items.forEach((item) => {
            // Create new list element 
            const listItem = this.getTemplate('item', item);

            // Append it to list
            itemListFragment.appendChild(listItem);
        });

        // Clear list
        this.itemList.innerHTML = '';

        // Update list
        this.itemList.appendChild(itemListFragment);
    }

    /**
     * Render DOM with values
     * @return
     */
    render() {
        this.currentState = this.store.getState();
    
        if(this.currentState !== this.prevState) {

            // Options
            if((this.currentState.options !== this.prevState.options || this.currentState.groups !== this.prevState.groups)) {
                if(this.passedElement.type === 'select-multiple' || this.passedElement.type === 'select-one') {
                    // Get active groups/options
                    const activeGroups = this.store.getGroupsFilteredByActive();
                    const activeOptions = this.store.getOptionsFilteredByActive();

                    const optListFragment = document.createDocumentFragment();

                    // Clear options
                    this.optionList.innerHTML = '';

                    // If we have grouped options
                    if(activeGroups.length >= 1 && this.isSearching !== true) {
                        this.renderGroups(activeGroups, activeOptions, optListFragment);
                    } else if(activeOptions.length >= 1) {
                        this.renderOptions(activeOptions, optListFragment);
                    }

                    if(optListFragment.children.length) {
                        // If we actually have anything to add to our dropdown
                        // append it and highlight the first option
                        this.optionList.appendChild(optListFragment);
                        this.highlightOption();
                    } else {
                        // Otherwise show a notice
                        const dropdownItem = this.isSearching ? this.getTemplate('notice', 'No results found') : this.getTemplate('notice', 'No options to select');
            
                        this.optionList.appendChild(dropdownItem);
                    }
                }
            }
            
            // Items
            if(this.currentState.items !== this.prevState.items) {
                const activeItems = this.store.getItemsFilteredByActive();
                if(activeItems) {
                    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
                    this.renderItems(activeItems);
                }
            }

            this.prevState = this.currentState;
        }
    }

    /**
     * Trigger event listeners
     * @return
     */
    addEventListeners() {
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseover', this.onMouseOver);

        this.input.addEventListener('input', this.onInput);
        this.input.addEventListener('paste', this.onPaste);
        this.input.addEventListener('focus', this.onFocus);
        this.input.addEventListener('blur', this.onBlur);
    }

    /**
     * Destroy event listeners
     * @return
     */
    removeEventListeners() {
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mouseover', this.onMouseOver);
        
        this.input.removeEventListener('input', this.onInput);
        this.input.removeEventListener('paste', this.onPaste);
        this.input.removeEventListener('focus', this.onFocus);
        this.input.removeEventListener('blur', this.onBlur);
    }

    /**
     * Initialise Choices
     * @return
     */
    init(callback) {
        if(this.initialised !== true) {

            this.initialised = true;

            // Create required elements
            this.createTemplates();

            // Generate input markup
            this.generateInput();

            this.store.subscribe(this.render);

            // Render any items
            this.render();

            // Trigger event listeners 
            this.addEventListeners();

            // Run callback if it is a function
            if(callback = this.options.callbackOnInit){
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
     */
    destroy() {
        this.passedElement.classList.remove(this.options.classNames.input, this.options.classNames.hiddenState);
        this.passedElement.tabIndex = '';
        this.passedElement.removeAttribute('style', 'display:none;');
        this.passedElement.removeAttribute('aria-hidden');
                
        this.containerOuter.outerHTML = this.passedElement.outerHTML;

        this.passedElement = null;
        this.userOptions = null;
        this.options = null;
        this.store = null;

        this.removeEventListeners();
    }
};

window.Choices = module.exports = Choices;