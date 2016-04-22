const options = (state = [], action) => {
    switch (action.type) {
        case 'ADD_OPTION':
            return [...state, {
                id: action.id,
                groupId: action.groupId,
                value: action.value,
                label: action.label,
                disabled: false,
                selected: false,
                active: true,
            }];

        case 'SELECT_OPTION':
            return state.map((option) => {
                if(option.id === parseInt(action.id)) {
                    option.selected = action.selected;
                }

                return option;
            });

        case 'FILTER_OPTIONS':
            const filteredResults = action.results.items;
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