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
                score: 9999,
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
            const filteredResults = action.results;
            const filteredState = state.map((option, index) => {
                // Set active state based on whether option is 
                // within filtered results
        
                option.active = filteredResults.some((result) => {
                    if(result.item.id === option.id) {
                        option.score = result.score;
                        return true;
                    }
                });

                return option;
            }).sort((prev, next) => {
                return prev.score - next.score;
            });

            return filteredState;

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