//<reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable from 'immutable';

const defaultState = {
    currentDay: new Date(),
    selectedWorkWeek: null,
    availableWorkWeek: null,
    editWorkWeek: null
}

const updateHourByDate = (state, payload) => {
    const editWorkWeek = state.editWorkWeek;
    const data = state.editWorkWeek.data;
    const {date, type, inputHour} = payload;
    const newData = data.map(day => {
        if (day.date === date) {
            return {...day, [type]: +inputHour};
        }

        return day;
    });

    const newEditWorkWeek = {
        ...editWorkWeek,
        data: newData
    };

    return Immutable.merge(state, {editWorkWeek: newEditWorkWeek});
    //return {...state, editWorkWeek: editWorkWeek}
}

//Reducer
export function reducer(state = defaultState, {type, payload}) {
    switch(type) {
        case CONSTANTS.SET_EDIT_WEEK:
            return {...state, editWorkWeek: payload};
        case CONSTANTS.UPDATE_HOURS:
            return updateHourByDate(state, payload);
        case CONSTANTS.SET_AVAIL_WEEK:
            return Immutable.set('availableWorkWeek', payload);
        default: return state;
    }
};

export default reducer;

const CONSTANTS = {
    UPDATE_HOURS: 'UPDATE_HOURS',
    SET_EDIT_WEEK: 'SET_EDIT_WEEK'
}

export const updateHours = payload => ({
    type: CONSTANTS.UPDATE_HOURS,
    payload
})

export const setEditWeek = data => ({
    type: CONSTANTS.SET_EDIT_WEEK,
    payload: data
})