const items = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            // Add object to items array
            let newState = [...state, {
                id: parseInt(action.id),
                value: action.value,
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
                if(item.id === parseInt(action.id)) {
                    item.active = false;
                }
                return item;
            });

        case 'SELECT_ITEM':        
            return state.map((item) => {
                if(item.id === parseInt(action.id)) {
                    item.selected = action.value;
                }

                return item;
            });

        default:
            return state;
    }
}

const initialState = {
    dropdownItems: [],
    items: []
}

const choices = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return state;

        case 'REMOVE_ITEM':
            return state;
            
        case 'SELECT_ITEM': 
            return state;       
            
        default:
            return state;
    }
}

export default items;