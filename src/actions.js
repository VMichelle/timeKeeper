import { dispatch } from 'react-redux';
const ACTION = {
    UPDATE_HOURS: 'UPDATE_HOURS'
}

export const updateHours = payload => dispatch({
    type: ACTION.UPDATE_HOURS,
    payload
});