export const addItem = (value, label, id, optionId) => {
    return {
        type: 'ADD_ITEM',
        value,
        label,
        id,
        optionId,
    }
};

export const removeItem = (id, optionId) => {
    return {
        type: 'REMOVE_ITEM',
        id,
        optionId,
    }
};

export const selectItem = (id, selected) => {
    return {
        type: 'SELECT_ITEM',
        id,
        selected,
    }
};

export const addOption = (value, label, id, groupId, disabled) => {
    return {
        type: 'ADD_OPTION',
        value,
        label,
        id,
        groupId,
        disabled,
    }
};

export const filterOptions = (results) => {
    return {
        type: 'FILTER_OPTIONS',
        results,
    }
};

export const activateOptions = (active = true) => {
    return {
        type: 'ACTIVATE_OPTIONS',
        active,
    }
};

export const addGroup = (value, id, active, disabled) => {
    return {
        type: 'ADD_GROUP',
        value,
        id,
        active,
        disabled,
    }
};

export const clearAll = () => {
    return {
        type: 'CLEAR_ALL',
    }
};