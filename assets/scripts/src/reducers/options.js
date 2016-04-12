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

        case 'SELECT_OPTION':
            return state.map((option) => {
                if(option.id === parseInt(action.id)) {
                    option.selected = action.value;
                }

                return option;
            });

        default:
            return state;
    }
}

export default options;