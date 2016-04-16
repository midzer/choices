const items = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            // Add object to items array
            let newState = [...state, {
                id: action.id,
                optionId: action.optionId,
                value: action.value,
                label: action.label,
                active: true,
                selected: false
            }];

            return newState.map((item) => {
                if(item.selected) {
                    item.selected = false;
                }
                return item;
            });

        case 'REMOVE_ITEM':
            // Set item to inactive
            return state.map((item) => {
                if(item.id === action.id) {
                    item.active = false;
                }
                return item;
            });

        case 'SELECT_ITEM':        
            return state.map((item) => {
                if(item.id === action.id) {
                    item.selected = action.selected;
                }

                return item;
            });

        default:
            return state;
    }
}

export default items;