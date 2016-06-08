import { combineReducers } from 'redux';
import items from './items';
import groups from './groups';
import options from './options';

const appReducer = combineReducers({
    items,
    groups,
    options
});

const rootReducer = (state, action) => {
    // If we are clearing all items, groups and options we reassign 
    // state and then pass that state to our proper reducer. This isn't
    // mutating our actual state.
    // 
    // See: http://stackoverflow.com/a/35641992
    if (action.type === 'CLEAR_ALL') {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;