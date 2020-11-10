import React from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const TimeInputField = props => {
    dayjs.extend(localizedFormat);

    const { date } = props;

    const updateHour = value => {
        console.log(value, date);
    };

    const updatePto = value => {
        console.log(value, date);
    }

    return (
        <div className='d-flex flex-column text-center' style={{fontSize: 12}}>
            <div className='border p-1'>
                {dayjs(date).format('ddd')} - {date}
            </div>
            <div>
                <input
                    className='border p-1 text-center'
                    type='number'
                    onChange={event => updateHour(event.target.value)}
                />
            </div>
            <div>
                <input
                    className='border p-1 text-center'
                    type='number'
                    onChange={event => updatePto(event.target.value)}
                />
            </div>
        </div>
        
    )
};

export default TimeInputField;
