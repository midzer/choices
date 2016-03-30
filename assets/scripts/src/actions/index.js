let initialId = 0;
export const addItem = (value, element) => {
    return {
        id: initialId++;
        type: 'ADD_ITEM',
        value: value,
        element: element,
        active: true
    }
}

export const removeItem = (element) => {
    return {
        type: 'REMOVE_ITEM',
        active: false
    }
}

export const updateItem = (value, element) => {
    return {
        type: 'UPDATE_ITEM',
        value: value
    }
}