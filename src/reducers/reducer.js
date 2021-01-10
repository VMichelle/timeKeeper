//<reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable from 'immutable';

const defaultState = {
    currentDay: new Date(),
    selectedWorkWeek: null,
    availableWorkWeeks: null,
    editWorkWeek: null,
    chargeCodes: null,
    editChargeCodes: null
}

const updateHourByDate = (state, payload) => {
    //const editWorkWeek = state.editWorkWeek;
    const data = state.editWorkWeek.data;
    const {date, type, inputHour} = payload;
    
    const indexOfDate = data.findIndex(item => item.date === date);
    const indexOfHour = data[0].hours.findIndex(item => item.chargeCodeName === type);

    return Immutable.setIn(state, ['editWorkWeek', 'data', `${[indexOfDate]}`, 'hours', `${[indexOfHour]}`, 'hours'], inputHour);
};

//Reducer
export function reducer(state = defaultState, {type, payload}) {
    switch(type) {
        case CONSTANTS.SET_EDIT_WEEK:
            return Immutable.set(state, 'editWorkWeek', payload);
        case CONSTANTS.UPDATE_HOURS:
            return updateHourByDate(state, payload);
        case CONSTANTS.SET_AVAIL_WEEKS:
            return Immutable.set(state, 'availableWorkWeeks', payload);
        case CONSTANTS.SET_SELECTED_WEEK:
            return Immutable.set(state, 'selectedWorkWeek', payload);
        case CONSTANTS.SET_CHARGE_CODES:
            return Immutable.set(state, 'chargeCodes', payload);
        case CONSTANTS.SET_EDIT_CHARGE_CODES:
            return Immutable.set(state, 'editChargeCodes', payload);
        default: return state;
    }
};

export default reducer;

const CONSTANTS = {
    UPDATE_HOURS: 'UPDATE_HOURS',
    SET_EDIT_WEEK: 'SET_EDIT_WEEK',
    SET_AVAIL_WEEKS: 'SET_AVAIL_WEEKS',
    SET_SELECTED_WEEK: 'SET_SELECTED_WEEK',
    SET_CHARGE_CODES: 'SET_CHARGE_CODES',
    SET_EDIT_CHARGE_CODES: 'SET_EDIT_CHARGE_CODES'
};

export const updateHours = payload => ({
    type: CONSTANTS.UPDATE_HOURS,
    payload
});

export const setEditWeek = data => ({
    type: CONSTANTS.SET_EDIT_WEEK,
    payload: data
});

export const setAvailableWeeks = payload => ({
    type: CONSTANTS.SET_AVAIL_WEEKS,
    payload
});

export const setSelectedWeek = payload => ({
    type: CONSTANTS.SET_SELECTED_WEEK,
    payload
});

export const setChargeCodes = payload => ({
    type: CONSTANTS.SET_CHARGE_CODES,
    payload
});

export const setEditChargeCodes = payload => ({
    type: CONSTANTS.SET_EDIT_CHARGE_CODES,
    payload
});