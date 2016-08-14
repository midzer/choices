const groups = (state = [], action) => {
    switch (action.type) {
        case 'ADD_GROUP': {
            return [...state, {
                id: action.id,
                value: action.value,
                active: action.active,
                disabled: action.disabled,
            }];
        }

        default: {
            return state;
        }
    }
};

export default groups;