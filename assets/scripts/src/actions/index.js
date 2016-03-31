export const addItemToStore = (value, element, id) => {
    return {
        type: 'ADD_ITEM',
        value: value,
        element: element,
        id: id
    }
}

export const removeItemFromStore = (id) => {
    return {
        type: 'REMOVE_ITEM',
        id: id,
    }
}

export const updateItemInStore = (value) => {
    return {
        type: 'UPDATE_ITEM',
        value: value
    }
}