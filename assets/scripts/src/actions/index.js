export const addItem = (value, id, optionId) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        id: parseInt(id),
        optionId: parseInt(optionId)
    }
};

export const removeItem = (id, optionId) => {
    return {
        type: 'REMOVE_ITEM',
        id: parseInt(id),
        optionId: parseInt(optionId)
    }
};

export const selectItem = (id, selected) => {
    return {
        type: 'SELECT_ITEM',
        id: parseInt(id),
        selected: selected,
    }
};

export const addOption = (value, id) => {
    return {
        type: 'ADD_OPTION',
        value: value,
        id: parseInt(id),
    }
};

export const selectOption = (id, selected) => {
    return {
        type: 'SELECT_OPTION',
        id: parseInt(id),
        selected: selected,
    }
};