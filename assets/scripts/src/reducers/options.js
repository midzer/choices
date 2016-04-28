const options = (state = [], action) => {
    switch (action.type) {
        case 'ADD_OPTION':
            return [...state, {
                id: action.id,
                groupId: action.groupId,
                value: action.value,
                label: action.label,
                disabled: action.disabled,
                selected: false,
                active: true,
            }];

        case 'ADD_ITEM':
            // When an item is added and it has an associated option,
            // we want to disable it so it can't be chosen again
            if(action.optionId > -1) {
                return state.map((option) => {
                    if(option.id === parseInt(action.optionId)) {
                        option.selected = true;
                    }
                    return option;
                });
            } else {
                return state;
            }

        case 'REMOVE_ITEM':
            // When an item is removed and it has an associated option,
            // we want to re-enable it so it can be chosen again
            if(action.optionId > -1) {
                return state.map((option) => {
                    if(option.id === parseInt(action.optionId)) {
                        option.selected = false;
                    }
                    return option;
                });
            } else {
                return state;
            }

        case 'FILTER_OPTIONS':
            const filteredResults = action.results.items;
            let firstActive = false;
            const newState = state.map((option, index) => {
                // Set active state based on whether option is 
                // within filtered results
                option.active = filteredResults.some((result) => {
                    return result.id === index;
                });

                return option;
            });

            return newState;

        case 'ACTIVATE_OPTIONS':
            return state.map((option) => {
                option.active = action.active;

                return option;
            });
            

        default:
            return state;
    }
}

export default options;