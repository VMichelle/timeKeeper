/* eslint-disable */
import React from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useDispatch } from 'react-redux';
import { updateHours } from '../reducers/reducer';

const TimeInputField = props => {
    const dispatch = useDispatch();
    dayjs.extend(localizedFormat);

    const { date } = props;


    const updateHour = (value, inputType) => {
        console.log(value, date);
        dispatch(updateHours({date, type: inputType, inputHour: value}))
    };

    const updatePto = (value, inputType) => {
        console.log(value, date);
        dispatch(updateHours({date, type: inputType, inputHour: value}))
    }

    return (
        <div className='d-flex flex-column text-center' style={{fontSize: 12}}>
            <div className='border p-1'>
                {dayjs(date).format('ddd')} - {dayjs(date).format('MM/DD')}
            </div>
            <div>
                <input
                    className='border p-1 text-center'
                    type='number'
                    onChange={event => updateHour(event.target.value, 'hours')}
                />
            </div>
            <div>
                <input
                    className='border p-1 text-center'
                    type='number'
                    onChange={event => updatePto(event.target.value, 'pto')}
                />
            </div>
        </div>
        
    )
};

export default TimeInputField;
