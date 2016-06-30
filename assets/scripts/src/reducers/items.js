const items = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            // Add object to items array
            let newState = [...state, {
                id: action.id,
                choiceId: action.choiceId,
                value: action.value,
                label: action.label,
                active: true,
                highlighted: false
            }];

            return newState.map((item) => {
                if(item.highlighted) {
                    item.highlighted = false;
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

        case 'HIGHLIGHT_ITEM':      
            return state.map((item) => {
                if(item.id === action.id) {
                    item.highlighted = action.highlighted;
                }

                return item;
            });

        default:
            return state;
    }
}

export default items;