import React from 'react'

const TimeInputField = props => {
    const { date } = props;

    const updateValue = value => {
        console.log(value);
    }

    return (
        <div style={{fontSize: 12}}>
            <div className='border p-1'>
                {date}
            </div>
            <input 
                onChange={event => updateValue(event.target.value)}
            />
        </div>
        
    )
};

export default TimeInputField;
