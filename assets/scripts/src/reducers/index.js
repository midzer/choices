import { combineReducers } from 'redux';
import items from './items';
import options from './options';

const rootReducer = combineReducers({
    items,
    // options
})

export default rootReducer;