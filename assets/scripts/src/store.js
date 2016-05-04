'use strict';

import { createStore } from 'redux';
import rootReducer from './reducers/index.js';

export class Store {
    constructor() {
        this.store = createStore(rootReducer);
    }
    
    getState() {
        return this.store.getState();
    }

    dispatch(callback) {
        this.store.dispatch(callback);
    }

    subscribe(callback) {
        this.store.subscribe(callback);
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
    getItemsReducedToValues() {
        const items = this.getItems();

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
            return option.active === true && option.selected !== true;
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

window.Store = module.exports = Store;