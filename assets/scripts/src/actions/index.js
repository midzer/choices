export const addItem = (value, id) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        id: id
    }
};

export const removeItem = (id) => {
    return {
        type: 'REMOVE_ITEM',
        id: id
    }
};

export const selectItem = (id, value) => {
    return {
        type: 'SELECT_ITEM',
        id: id,
        value: value
    }
};

export const addOption = (value, id) => {
    return {
        type: 'ADD_OPTION',
        value: value,
        id: id
    }
};