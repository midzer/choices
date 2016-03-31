// Array of choices
const choices = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            // Add object to items array
            return [...state, {
                id: parseInt(action.id),
                value: action.value,
                element: action.element,
                active: true
            }];

        case 'REMOVE_ITEM':
            // Remove item from items array
            return state.filter(function(item) {
                if(item.id !== parseInt(action.id)) {
                    return item;
                }
            });

        default:
            return state;
    }
}

export default choices