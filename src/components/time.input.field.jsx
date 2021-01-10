/* eslint-disable */
import React from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useDispatch } from 'react-redux';
import { updateHours } from '../reducers/reducer';

const TimeInputField = props => {
    const dispatch = useDispatch();
    dayjs.extend(localizedFormat);

    const { day } = props;
    const { date } = day;

    const updateHour = (value, inputType) => {
        dispatch(updateHours({date: date, type: inputType, inputHour: value}))
    };

    return (
        <div className='d-flex flex-column text-center' style={{fontSize: 12, width: 75}}>
            <div className='border p-1' style={{height: 50}}>
                {dayjs(date).format('ddd')} <br /> {dayjs(date).format('MM/DD')}
            </div>

            {day.hours.map((item, index) => {
                return <input
                    key={index}
                    value={item.hours ? item.hours : ''}
                    className='border p-1 text-center'
                    type='number'
                    onChange={event => updateHour(event.target.value, item.chargeCodeName)}
                />
            })}
        </div>
        
    )
};

export default TimeInputField;
