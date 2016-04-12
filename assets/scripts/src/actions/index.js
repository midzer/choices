export const addItem = (value, id) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        id: id,
    }
};

export const removeItem = (id) => {
    return {
        type: 'REMOVE_ITEM',
        id: id,
    }
};

export const selectItem = (id, selected) => {
    return {
        type: 'SELECT_ITEM',
        id: id,
        selected: selected,
    }
};

export const addOption = (value, id) => {
    return {
        type: 'ADD_OPTION',
        value: value,
        id: id,
    }
};

export const selectOption = (id, selected) => {
    return {
        type: 'SELECT_OPTION',
        id: id,
        selected: selected,
    }
};