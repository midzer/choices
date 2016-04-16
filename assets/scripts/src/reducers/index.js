import { combineReducers } from 'redux';
import items from './items';
import groups from './groups';
import options from './options';

const rootReducer = combineReducers({
    items,
    groups,
    options
})

export default rootReducer;