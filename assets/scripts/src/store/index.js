'use strict';

import { createStore } from 'redux';
import rootReducer from './../reducers/index.js';


export class Store {
    constructor() {
        this.store = createStore(
            rootReducer, 
            window.devToolsExtension ? window.devToolsExtension() : undefined
        );
    }
    
    /**
     * Get store object (wrapping Redux method)
     * @return {Object} State
     */
    getState() {
        return this.store.getState();
    }

    /**
     * Dispatch event to store (wrapped Redux method)
     * @param  {Function} action Action function to trigger
     * @return
     */
    dispatch(action) {
        this.store.dispatch(action);
    }

    /**
     * Subscribe store to function call (wrapped Redux method)
     * @param  {Function} onChange Function to trigger when state changes
     * @return
     */
    subscribe(onChange) {
        this.store.subscribe(onChange);
    }

    /**
     * Get items from store
     * @return {Array} Item objects
     */
    getItems() {
        const state = this.store.getState();
        return state.items;
    }

    /**
     * Get active items from store
     * @return {Array} Item objects
     */
    getItemsFilteredByActive() {
        const items = this.getItems();

        const values = items.filter((item) => {
            return item.active === true;
        }, []);

        return values;
    }

    /**
     * Get items from store reduced to just their values
     * @return {Array} Item objects
     */
    getItemsReducedToValues(items = this.getItems()) {
        const values = items.reduce((prev, current) => {
            prev.push(current.value);
            return prev;
        }, []);

        return values;
    }

    /**
     * Get options from store 
     * @return {Array} Option objects
     */
    getOptions() {
        const state = this.store.getState();
        return state.options;
    }

    /**
     * Get active options from store
     * @return {Array} Option objects
     */
    getOptionsFilteredByActive() {
        const options = this.getOptions();
        const values = options.filter((option) => {
            return option.active === true;
        },[]);

        return values;
    }

    /**
     * Get selectable options from store
     * @return {Array} Option objects
     */
    getOptionsFiltedBySelectable() {
        const options = this.getOptions();
        const values = options.filter((option) => {
            return option.selected === false && option.disabled !== true;
        },[]);

        return values;
    }

    /**
     * Get groups from store
     * @return {Array} Group objects
     */
    getGroups() {
        const state = this.store.getState();
        return state.groups;
    }

    /**
     * Get active groups from store
     * @return {Array} Group objects
     */
    getGroupsFilteredByActive() {
        const groups = this.getGroups();
        const options = this.getOptions();

        const values = groups.filter((group) => {
            const isActive = group.active === true && group.disabled === false;
            const hasActiveOptions = options.some((option) => {
                return option.active === true && option.disabled === false;
            });
            return isActive && hasActiveOptions ? true : false;
        },[]);

        return values;
    }
};

module.exports = Store;