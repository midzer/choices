const groups = (state = [], action) => {
    switch (action.type) {
        case 'ADD_GROUP':
            return [...state, {
                id: parseInt(action.id),
                value: action.value,
                disabled: false,
            }];

        default:
            return state;
    }
}

export default groups;