export const addItemToStore = (value, id) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        id: id
    }
};

export const unselectAllFromStore = () => {
    return {
        type: 'UNSELECT_ALL'
    }
}

export const removeItemFromStore = (id) => {
    return {
        type: 'REMOVE_ITEM',
        id: id
    }
};

export const selectItemFromStore = (id, value) => {
    return {
        type: 'SELECT_ITEM',
        id: id,
        value: value
    }
};