const options = (state = [], action) => {
    switch (action.type) {
        case 'ADD_OPTION':
            return [...state, {
                id: parseInt(action.id),
                value: action.value,
                disabled: false,
                selected: false
            }];;

        case 'SELECT_OPTION':
            return state.map((option) => {
                if(option.id === parseInt(action.id)) {
                    option.selected = action.selected;
                }

                return option;
            });

        case 'REMOVE_ITEM':
            // When an item is removed and it has an associated option,
            // we want to re-enable it so it can be chosen again
            if(action.optionId > -1) {
                return state.map((option) => {
                    if(option.id === parseInt(action.optionId)) {
                        option.selected = action.selected;
                    }
                    return option;
                });
            } else {
                return state;
            }
            

        default:
            return state;
    }
}

export default options;