const choice = (state = [], action) => {
    console.log('Choice', action);
    switch(action.type) {
        case 'ADD_VALUE':
            return {
                value: action.value,
                element: action.element,
                active: true
            };
        case 'REMOVE_VALUE':
            return Object.assign({}, state, {
                active: false
            });
        default:
            return state;
    }
}

const choices = (state = {}, action) => {
    console.log('Choices', action);
    switch(action.type) {
        case 'ADD_VALUE':
            return [
            ...state,
                choice(undefined, action)
            ]
        case 'REMOVE_VALUE':
            return state.map(t =>
                choice(t, action)
              )
        default:
            return state;
    }
}

export default choices