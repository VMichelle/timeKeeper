const defaultState = {
    currentDay: new Date(),
    selectedWorkWeek: null
}

function reducer(state = defaultState, action) {
    switch(action.type) {
        default: return state;
    }
};

export default reducer;