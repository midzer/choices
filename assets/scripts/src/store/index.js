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
     * Get choices from store 
     * @return {Array} Option objects
     */
    getChoices() {
        const state = this.store.getState();
        
        return state.choices;
    }

    /**
     * Get active choices from store
     * @return {Array} Option objects
     */
    getChoicesFilteredByActive() {
        const choices = this.getChoices();

        const values = choices.filter((choice) => {
            return choice.active === true;
        },[]);

        return values;
    }

    /**
     * Get selectable choices from store
     * @return {Array} Option objects
     */
    getChoicesFilteredBySelectable() {
        const choices = this.getChoices();
        const values = choices.filter((choice) => {
            return choice.disabled !== true;
        },[]);

        return values;
    }

    /**
     * Get single choice by it's ID
     * @return {Object} Found choice
     */
    getChoiceById(id) {
        if(!id) return;
        const choices = this.getChoicesFilteredByActive();
        const foundChoice = choices.find((choice) => choice.id === parseInt(id));
        
        return foundChoice;
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
        const choices = this.getChoices();

        const values = groups.filter((group) => {
            const isActive = group.active === true && group.disabled === false;
            const hasActiveOptions = choices.some((choice) => {
                return choice.active === true && choice.disabled === false;
            });
            return isActive && hasActiveOptions ? true : false;
        },[]);

        return values;
    }
};

module.exports = Store;