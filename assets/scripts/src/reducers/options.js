const options = (state = [], action) => {
    switch (action.type) {
        case 'ADD_OPTION':
            // Add object to items array
            let newState = [...state, {
                id: parseInt(action.id),
                value: action.value,
                disabled: false,
                selected: false
            }];

            return newState;
        default:
            return state;
    }
}

export default options;