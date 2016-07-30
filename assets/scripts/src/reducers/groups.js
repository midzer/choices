import { sortByAlpha } from './../lib/utils.js';

const groups = (state = [], action) => {
    switch (action.type) {
        case 'ADD_GROUP':
            return [...state, {
                id: action.id,
                value: action.value,
                active: action.active,
                disabled: action.disabled,
            }].sort(sortByAlpha);;

        default:
            return state;
    }
}

export default groups;