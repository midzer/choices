'use strict';

import { createStore } from 'redux';
import rootReducer from './reducers/index.js';
import { addItem, removeItem, selectItem, addOption, filterOptions, activateOptions, addGroup } from './actions/index';
import { hasClass, wrap, getSiblings, isType, strToEl, extend, getWidthOfInput, debounce } from './lib/utils.js';
import Sifter from 'sifter';

/**
 * Choices
 *
 * To do:
 *    - Dispatch events
 *    - Remove item by clicking a target
 *    - Set input width based on the size of the contents
 *    - Single select input support
 *    - Populate options by function
 */
export class Choices {
    constructor(element = '[data-choice]', options) {
        
        // Cutting the mustard
        const fakeEl = document.createElement("fakeel");
        const cuttingTheMustard = 'querySelector' in document && 'addEventListener' in document && 'classList' in fakeEl;
        if (!cuttingTheMustard) console.error('init: Your browser doesn\'nt support Choices');

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
            allowPaste: true,
            allowSearch: true, 
            regexFilter: false,
            debug: false,
            placeholder: true,
            placeholderValue: '',
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
                group: 'choices__group',
                groupHeading : 'choices__heading',
                activeState: 'is-active',
                disabledState: 'is-disabled',
                highlightedState: 'is-highlighted',
                hiddenState: 'is-hidden',
                flippedState: 'is-flipped',
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

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPaste = this.onPaste.bind(this);

        const classNames = this.options.classNames;

        this.templates = {
            option: (data) => {
                return strToEl(`
                    <div class="${ classNames.item } ${ classNames.itemOption } ${ data.selected ? classNames.selectedState + ' ' + classNames.itemDisabled : classNames.itemSelectable }" data-choice-option data-choice-id="${ data.id }" data-choice-value="${ data.value }">
                        ${ data.label }
                    </div>
                `);
            },
            optgroup: (data) => {
                return strToEl(`
                    <div class="${ classNames.group } ${ data.disabled ? classNames.itemDisabled : '' }" data-choice-value="${ data.value }" data-choice-group-id="${ data.id }">
                        <div class="${ classNames.groupHeading }">${ data.value }</div>
                    </div>
                `);
            },
            item: (data) => {
                return strToEl(`
                    <div class="${ classNames.item } ${ classNames.itemOption } ${ data.selected ? classNames.selectedState + ' ' + classNames.itemDisabled : classNames.itemSelectable }" data-choice-option data-choice-id="${ data.id }" data-choice-value="${ data.value }">
                        ${ data.label }
                    </div>
                `);
            },
            notice: (label) => {
                return strToEl(`
                    <div class="${ classNames.item } ${ classNames.itemOption }" data-choice-notice>
                        ${ label }
                    </div>
                `);
            },
        };

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

    hasSelectedItems() {
        const items = this.getItems();
        return items.some((item) => {
            return item.selected === true;
        });
    }

    /* Event handling */
    handleSelectAll() {
        if(this.options.removeItems && !this.input.value && this.options.selectAll && this.input === document.activeElement) {
            this.selectAll(this.list.children);
        }
    };
    
    handleEnter(activeItems, value = null) {
        let canUpdate = true;

        if(this.passedElement.type === 'text') {
            if(this.options.addItems) {
                if (this.options.maxItems && this.options.maxItems <= this.list.children.length) {
                    // If there is a max entry limit and we have reached that limit
                    // don't update
                    canUpdate = false;
                } else if(this.options.allowDuplicates === false && this.passedElement.value) {
                    // If no duplicates are allowed, and the value already exists
                    // in the array, don't update
                    canUpdate = !activeItems.some((item) => {
                        return item.value === value;
                    });
                }   
            } else {
                canUpdate = false;
            }
        }

        // All is good, update
        if (canUpdate) {
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

            if(this.passedElement.type === 'select-multiple') {
                console.log('hit');
            }
        }
    };

    handleBackspaceKey(activeItems) {
        if(this.options.removeItems && activeItems) {
            const lastItem = activeItems[activeItems.length - 1];
            const hasSelectedItems = activeItems.some((item) => {
                return item.selected === true;
            });

            // If editing the last item is allowed and there are not other selected items, 
            // we can edit the item value. Otherwise if we can remove items, remove all selected items
            if(this.options.editItems && !hasSelectedItems && lastItem) {
                this.input.value = lastItem.value;
                this.removeItem(lastItem);
            } else {
                this.selectItem(lastItem);
                this.removeAllSelectedItems();
            }
        }
    };

    handleClick(activeItems, target, shiftKey) {
        if(this.options.removeItems && target) {
            const passedId = target.getAttribute('data-choice-id');

            // We only want to select one item with a click
            // so we deselect any items that aren't the target
            // unless shift is being pressed
            activeItems.forEach((item) => {
                if(item.id === parseInt(passedId) && !item.selected) {
                    this.selectItem(item);
                } else if(!shiftKey) {
                    this.deselectItem(item);
                }
            });
        }
    }

    /** 
     * Handle keydown event 
     * @param  {Object} e Event
     * @return
     */
    onKeyDown(e) {
        const activeItems = this.getItemsFilteredByActive();
        const activeOptions = this.getOptionsFilteredByActive();
        const inputIsFocussed = this.input === document.activeElement;
        const ctrlDownKey = e.ctrlKey || e.metaKey;
        const backKey = 46;
        const deleteKey = 8;
        const enterKey = 13;
        const aKey = 65;
        const escapeKey = 27;
        const upKey = 38;
        const downKey = 40;
        const hasActiveDropDown = this.dropdown && this.dropdown.classList.contains(this.options.classNames.activeState);
        const hasItems = this.list && this.list.children;

        // If we are typing in the input
        if(e.target === this.input) {
            // this.input.style.width = getWidthOfInput(this.input);
            switch (e.keyCode) {
                case aKey:
                    // If CTRL + A or CMD + A have been pressed and there are items to select
                    if(ctrlDownKey && hasItems) {
                        this.handleSelectAll();
                    }
                    break;
                case enterKey:
                    // If enter key is pressed and the input has a value
                    if(e.target.value && this.passedElement.type === 'text') {
                        const value = this.input.value;
                        this.handleEnter(activeItems, value);                    
                    }

                    if(this.passedElement.type === 'select-multiple' && hasActiveDropDown) {
                        const highlighted = this.dropdown.querySelector(`.${this.options.classNames.highlightedState}`);
                    
                        if(highlighted) {
                            const value = highlighted.getAttribute('data-choice-value');
                            const label = highlighted.innerHTML;
                            const id = highlighted.getAttribute('data-choice-id');
                            this.addItem(value, label, id);
                            this.input.value = "";
                        }
                    }
                    break;
                case escapeKey:
                    if(this.passedElement.type === 'select-multiple' && hasActiveDropDown) {
                        this.toggleDropdown();
                    }
                    break;
                case downKey:
                case upKey:
                    // If up or down key is pressed, traverse through options
                    if(this.passedElement.type === 'select-multiple' && hasActiveDropDown) {
                        const selectableOptions = activeOptions.filter((option) => {
                            return !option.selected;
                        });

                        let canHighlight = true;

                        if(e.keyCode === downKey) {
                            this.highlightPosition < (selectableOptions.length - 1) ? this.highlightPosition++ : canHighlight = false;
                        } else if(e.keyCode === upKey) {
                            this.highlightPosition > 0 ? this.highlightPosition-- : canHighlight = false;
                        }

                        if(canHighlight) {
                            const option = selectableOptions[this.highlightPosition];
                            if(option) {
                                const previousElement = this.dropdown.querySelector(`.${this.options.classNames.highlightedState}`);
                                const currentElement = this.dropdown.querySelector(`[data-choice-id="${option.id}"]`);

                                if(previousElement) {
                                    previousElement.classList.remove(this.options.classNames.highlightedState);
                                }

                                if(currentElement) {
                                    currentElement.classList.add(this.options.classNames.highlightedState);                         
                                }
                            }
                        }
                    }
                    break
                case backKey:
                case deleteKey:
                    // If backspace or delete key is pressed and the input has no value
                    if(inputIsFocussed && !e.target.value) {
                        this.handleBackspaceKey(activeItems);
                        e.preventDefault();
                    }
                    break;
                default:
                    break;
            }
        }
    }

    onKeyUp(e) {
        if(e.target === this.input) {
            if(this.passedElement.type === 'select-multiple' && this.options.allowSearch) {
                const charStr = String.fromCharCode(e.keyCode);
                if(this.input === document.activeElement && /[a-z0-9]/i.test(charStr)) {
                    if(this.input.value) {
                        // If we have a value, filter options based on it 
                        const handleFilter = debounce(() => {
                            const options = this.getOptionsFiltedBySelectable();
                            const sifter = new Sifter(options);
                            const results = sifter.search(this.input.value, {
                                fields: ['label', 'value'],
                                sort: [{field: 'value', direction: 'asc'}],
                                limit: 10
                            });
                            this.store.dispatch(filterOptions(results));
                        }, 100)
                        
                        handleFilter();
                    } else {
                        // Otherwise reset options to active
                        this.store.dispatch(activateOptions());
                    }
                }
            } 
        }
    }


    /** 
     * Handle click event 
     * @param  {Object} e Event
     * @return
     */
    onClick(e) {
        const shiftKey = e.shiftKey;

        if(this.dropdown) {
            this.toggleDropdown();
        }

        // If click is affecting a child node of our element
        if(this.containerOuter.contains(e.target)) {
            if(this.input !== document.activeElement) {
                this.input.focus();
            }

            if(e.target.hasAttribute('data-choice-item')) {
                // If we are clicking on an item
                const activeItems = this.getItemsFilteredByActive();
                const target = e.target;
                
                this.handleClick(activeItems, target, shiftKey);

            } else if(e.target.hasAttribute('data-choice-option')) {
                // If we are clicking on an option
                const options = this.getOptionsFilteredByActive();
                const id = e.target.getAttribute('data-choice-id');
                const option = options.find((option) => {
                    return option.id === parseInt(id);
                });

                if(!option.selected) {
                    this.addItem(option.value, option.label, option.id);                    
                }
            }

        } else {
            // Click is outside of our element so close dropdown and de-select items
            if(this.hasSelectedItems()) {
                this.deselectAll();
            }
            // If there is a dropdown and it is active
            if(this.passedElement.type === 'select-multiple' && this.dropdown.classList.contains(this.options.classNames.activeState)) {
                this.toggleDropdown();
            }
        }
    }

    onPaste(e) {
        // Disable pasting into the input if option has been set
        if(!this.options.allowPaste) {
            e.preventDefault();
        }
    }

    onFocus(e) {
        this.containerOuter.classList.add(this.options.classNames.activeState);
    }

    onBlur(e) {
        this.containerOuter.classList.remove(this.options.classNames.activeState);
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
        if(!id || !isType('Number', id)) {
            console.error('getItemById: An id was not given or was not a number');
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


    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     */
    addItem(value, label, optionId = -1, callback = this.options.callbackOnAddItem) {
        if (this.options.debug) console.debug('Add item');

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
        const id = this.store.getState().items.length + 1;

        this.store.dispatch(addItem(passedValue, passedLabel, id, passedOptionId));

        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback(id, value);
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
            if(isType('Function', callback)) {
                callback(value);
            } else {
                console.error('callbackOnRemoveItem: Callback is not a function');
            }
        }
    }

    removeItemsByValue(value) {
        if(!value || !isType('String', value)) {
            console.error('removeItemsByValue: No value was passed to be removed');
        }

        const items = this.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.value === value) {
                this.removeItem(item);
            }
        });
    }

    /**
     * Remove all items from array
     * @param  {Boolean} selectedOnly Optionally remove only selected items
     * @return
     */
    removeAllItems() {
        const items = this.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.active) {
                this.removeItem(item);    
            }
        });
    }

    removeAllSelectedItems() {
        const items = this.getItemsFilteredByActive();

        items.forEach((item) => {
            if(item.selected && item.active) {
                this.removeItem(item);
            }
        });
    }

    showDropdown() {
        this.dropdown.classList.add(this.options.classNames.activeState);

        const dimensions = this.dropdown.getBoundingClientRect();
        if(dimensions.top + dimensions.height >= document.body.offsetHeight) {
            this.dropdown.classList.add(this.options.classNames.flippedState);
        } else {
            this.dropdown.classList.remove(this.options.classNames.flippedState);
        }
    }

    hideDropdown() {
        // A dropdown flips if it does not have space below the input
        const isFlipped = this.dropdown.classList.contains(this.options.classNames.flippedState);

        this.dropdown.classList.remove(this.options.classNames.activeState);

        if(isFlipped) {
            this.dropdown.classList.remove(this.options.classNames.flippedState);
        }
    }

    toggleDropdown() {
        if(!this.dropdown) return;
        const isActive = this.dropdown.classList.contains(this.options.classNames.activeState);

        if(isActive) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }

    addOption(option, groupId = -1, disabled = false) {
        // Generate unique id
        const state = this.store.getState();
        const id = state.options.length + 1;
        const value = option.value;
        const label = option.innerHTML;
        const isSelected = option.selected;

        this.store.dispatch(addOption(value, label, id, groupId, disabled));

        if(isSelected) {
            this.addItem(value, label, id);
        }
    }

    addGroup(value, id, active, disabled) {
        this.store.dispatch(addGroup(value, id, active, disabled));
    }

    /* Getters */

    /**
     * Get items in state
     * @return {Array} Array of item objects
     */
    getItems() {
        const state = this.store.getState();
        return state.items;
    }

    /**
     * Get items in state if they are active
     * @return {Array} Array of item objects
     */
    getItemsFilteredByActive() {
        const items = this.getItems();

        const valueArray = items.filter((item) => {
            return item.active === true;
        }, []);

        return valueArray;
    }

    /**
     * Get items in state reduced to just their values
     * @return {Array} Array of items 
     */
    getItemsReducedToValues() {
        const items = this.getItems();

        const valueArray = items.reduce((prev, current) => {
            prev.push(current.value);
            return prev;
        }, []);

        return valueArray;
    }

    /**
     * Get options in state 
     * @return {Array} Array of item options
     */
    getOptions() {
        const state = this.store.getState();
        return state.options;
    }

    getOptionsFilteredByActive() {
        const options = this.getOptions();
        const valueArray = options.filter((option) => {
            return option.active === true && option.disabled === false && option.selected !== true;
        },[]);

        return valueArray;
    }

    getOptionsFiltedBySelectable() {
        const options = this.getOptions();
        const valueArray = options.filter((option) => {
            return option.disabled === false;
        },[]);

        return valueArray;
    }

    getGroups() {
        const state = this.store.getState();
        return state.groups;
    }

    getGroupsFilteredByActive() {
        const groups = this.getGroups();
        const options = this.getOptions();

        const valueArray = groups.filter((group) => {
            const isActive = group.active === true && group.disabled === false;
            const hasActiveOptions = options.some((option) => {
                return option.active === true && option.disabled === false;
            });
            return isActive && hasActiveOptions ? true : false;
        },[]);

        return valueArray;
    }
    
    /* Rendering */

    /**
     * Create DOM structure around passed select element
     * @return
     */
    generateInput() {
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
        

        // If placeholder has been enabled and we have a value
        if (this.options.placeholder && this.options.placeholderValue) {
            input.placeholder = this.options.placeholderValue;  
            input.style.width = getWidthOfInput(input);
        }

        if(!this.options.addItems) {
            input.disabled = true;
            containerOuter.classList.add(this.options.classNames.disabledState);
        }

        containerOuter.appendChild(containerInner);
        
        containerInner.appendChild(list);
        containerInner.appendChild(input);

        if(this.passedElement.type === 'select-multiple') {
            this.highlightPosition = 0;
            const dropdown = strToEl(`<div class="${ this.options.classNames.list } ${ this.options.classNames.listDropdown }"></div>`);
            const passedGroups = Array.from(this.passedElement.getElementsByTagName('OPTGROUP'));
            
            containerOuter.appendChild(dropdown);

            this.dropdown = dropdown;
        
            if(passedGroups.length) {
                passedGroups.forEach((group, index) => {
                    const groupOptions = Array.from(group.getElementsByTagName('OPTION'));
                    const groupId = index;

                    if(groupOptions) {
                        this.addGroup(group.label, groupId, true, group.disabled);
                        groupOptions.forEach((option, optionIndex) => {
                            // We want to pre-highlight the first option
                            const highlighted = index === 0 && optionIndex === 0 ? true : false;

                            // If group is disabled, disable all of its children
                            if(group.disabled) {
                                this.addOption(option, groupId, true);
                            } else {
                                this.addOption(option, groupId);    
                            }
                        });
                    } else {
                        this.addGroup(group.label, groupId, false, group.disabled);
                    }
                
                });
            } else {
                const passedOptions = Array.from(this.passedElement.options);

                passedOptions.forEach((option) => {
                    this.addOption(option);
                });
            }
        } else if(this.passedElement.type === 'text') {
            // Add any preset values seperated by delimiter
            this.presetItems.forEach((value) => {
                this.addItem(value);
            });
        }
        
        this.containerOuter = containerOuter;
        this.containerInner = containerInner;
        this.input = input;
        this.list = list;
        
    }

    /**
     * Render DOM with values
     * @return
     */
    render(callback = this.options.callbackOnRender) {
        const classNames = this.options.classNames;
        const activeItems = this.getItemsFilteredByActive();
    

        // OPTIONS
        if(this.passedElement.type === 'select-multiple') {
            const activeOptions = this.getOptionsFilteredByActive();
            const activeGroups = this.getGroupsFilteredByActive();

            // Clear options
            this.dropdown.innerHTML = '';

            // Create a fragment to store our list items (so we don't have to update the DOM for each item)
            const optionListFragment = document.createDocumentFragment();

            // If we have grouped options
            if(activeGroups.length >= 1) {
                activeGroups.forEach((group, i) => {
                    // Grab options that are children of this group
                    const groupOptions = activeOptions.filter((option) => {
                        return option.groupId === group.id;
                    });

                    if(groupOptions.length >= 1) {
                        const dropdownGroup = this.templates['optgroup'](group);

                        groupOptions.forEach((option, j) => {
                            const dropdownItem = this.templates['option'](option);

                            dropdownGroup.appendChild(dropdownItem);
                        });

                        optionListFragment.appendChild(dropdownGroup);
                    }
                });
            } else if(activeOptions.length >= 1) {
                activeOptions.forEach((option, i) => {
                    const dropdownItem = this.templates['option'](option);    
                    optionListFragment.appendChild(dropdownItem);
                });
            }
            
            this.dropdown.appendChild(optionListFragment);

            // If dropdown is empty, show a no content message
            if(this.dropdown.innerHTML === "") {
                const dropdownItem = this.templates['notice']('No options to select');      

                optionListFragment.appendChild(dropdownItem);
                this.dropdown.appendChild(optionListFragment);
            }
        }
        
        // ITEMS
        if(activeItems) {
            // Simplify store data to just values
            const itemsFiltered = this.getItemsReducedToValues();

            // Assign hidden input array of values
            this.passedElement.value = itemsFiltered.join(this.options.delimiter);

            // Clear list
            this.list.innerHTML = '';

            // Create a fragment to store our list items (so we don't have to update the DOM for each item)
            const itemListFragment = document.createDocumentFragment();
            
            // Add each list item to list
            activeItems.forEach((item) => {
                // Create new list element 
                const listItem = this.templates['item'](item);

                // Append it to list
                itemListFragment.appendChild(listItem);
            });

            this.list.appendChild(itemListFragment);
        }

        // Run callback if it is a function
        if(callback){
            if(isType('Function', callback)) {
                callback(activeItems);
            } else {
                console.error('callbackOnRender: Callback is not a function');
            }
        }
    }

    /**
     * Trigger event listeners
     */
    addEventListeners() {
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onClick);
        document.addEventListener('paste', this.onPaste);

        this.input.addEventListener('focus', this.onFocus);
        this.input.addEventListener('blur', this.onBlur);
    }

    /**
     * Destroy event listeners
     */
    removeEventListeners() {
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('click', this.onClick);
        document.removeEventListener('paste', this.onPaste);

        this.input.removeEventListener('focus', this.onFocus);
        this.input.removeEventListener('blur', this.onBlur);
    }

    /**
     * Initialise Choices
     * @return
     */
    init(callback = this.options.callbackOnInit) {
        this.initialised = true;

        // Generate input markup
        this.generateInput();

        // Subscribe to store
        this.store.subscribe(this.render);

        // Render any items
        this.render();

        // Trigger event listeners 
        this.addEventListeners();

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
        this.passedElement = null;
        this.userOptions = null;
        this.options = null;
        this.initialised = null;
        this.store = null;
    }
};

window.Choices = module.exports = Choices;