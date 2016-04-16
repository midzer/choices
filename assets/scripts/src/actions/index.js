export const addItem = (value, label, id, optionId) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        label: label,
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

export const addOption = (value, label, id, groupId) => {
    return {
        type: 'ADD_OPTION',
        value: value,
        label: label,
        id: parseInt(id),
        groupId: parseInt(groupId)
    }
};

export const selectOption = (id, selected) => {
    return {
        type: 'SELECT_OPTION',
        id: parseInt(id),
        selected: selected,
    }
};

export const addGroup = (value, id) => {
    return {
        type: 'ADD_GROUP',
        value: value,
        id: parseInt(id)
    }
};