/* eslint-disable */
import React from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useDispatch } from 'react-redux';
import { updateHours } from '../reducers/reducer';

const TimeInputField = props => {
    const dispatch = useDispatch();
    dayjs.extend(localizedFormat);

    const { date, day } = props;


    const updateHour = (value, inputType) => {
        console.log(value, date);
        dispatch(updateHours({date, type: inputType, inputHour: value}))
    };

    const updatePto = (value, inputType) => {
        console.log(value, date);
        dispatch(updateHours({date, type: inputType, inputHour: value}))
    }

    return (
        <div className='d-flex flex-column text-center' style={{fontSize: 12, width: 75}}>
            <div className='border p-1' style={{height: 50}}>
                {dayjs(date).format('ddd')} <br /> {dayjs(date).format('MM/DD')}
            </div>
            <input
                value={day.hours ? day.hours : ''}
                className='border p-1 text-center'
                type='number'
                onChange={event => updateHour(event.target.value, 'hours')}
            />
            <input
                value={day.pto ? day.pto : ''}
                className='border p-1 text-center'
                type='number'
                onChange={event => updatePto(event.target.value, 'pto')}
            /> 
        </div>
        
    )
};

export default TimeInputField;
