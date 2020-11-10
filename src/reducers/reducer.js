const defaultState = {
    currentDay: new Date(),
    selectedWorkWeek: null,
    editWorkWeek: null
}

const updateHourByDate = (state, payload) => {
    const editWorkWeek = state.editWorkWeek


    return {...state, editWorkWeek: editWorkWeek}
}

//Reducer
export function reducer(state = defaultState, {type, payload}) {
    switch(type) {
        case CONSTANTS.SET_EDIT_WEEK:
            return {...state, editWorkWeek: {...payload}};
        case CONSTANTS.UPDATE_HOUR:
            return updateHourByDate(state, payload);
        default: return state;
    }
};

export default reducer;

const CONSTANTS = {
    UPDATE_HOUR: 'UPDATE_HOUR',
    SET_EDIT_WEEK: 'SET_EDIT_WEEK'
}

export const updateHour = data => ({
    type: CONSTANTS.UPDATE_HOUR,
    payload: data
})

export const setEditWeek = data => ({
    type: CONSTANTS.SET_EDIT_WEEK,
    payload: data
})