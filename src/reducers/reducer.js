const defaultState = {
    currentDay: new Date()
}

function reducer(state = defaultState, action) {
    switch(action.type) {
        default: return state;
    }
};

export default reducer;