/* eslint-disable */
import React, {useState} from 'react';
import TimeInputField from '../components/time.input.field';
import { dates } from '../2020days';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector } from 'react-redux';

const WeeklyView = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    require("firebase/firestore");
    const db = firebase.firestore();
    dayjs.extend(localizedFormat);

    const date = useSelector(state => state.currentDay);
    const [selectedDate, setSelectedDate] = useState(dayjs(date).format('YYYY-MM-DD'));
    const [workWeek, setWorkWeek] = useState([])

    const onSave = () => {
        console.log('save clicked');
    };

    const onCreate = () => {
        console.log('onCreate click');
        let daysToAdd = 1;
        let newWorkWeek = [];

        while (daysToAdd <= 7) {
            let addedDay = dayjs(selectedDate).add(daysToAdd, 'day');
            newWorkWeek.push(addedDay.format('L'));
            ++daysToAdd;
        };

        setWorkWeek(newWorkWeek);
        
 
    };

    const displayWeek = () => {
        if(workWeek.length === 0) return console.log('no days');
        
        return <div className='d-flex mt-3 p-3'>
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1'>Date</div>
                <div className='border p-1'>Hours</div>
                <div className='border p-1'>PTO</div>
            </div>
            {workWeek.map((day, index) => {
                return <TimeInputField key={index} date={day} />
            })}
        </div>;
    }

    return (
        <div className='p-3 d-flex flex-column'>
            <div>Today: {dayjs(date).format('L').toString()}</div>
            <div>
                <label>Select start date for work week: </label>
                <input
                    type='date'
                    value={selectedDate}
                    onChange={value => setSelectedDate(value.target.value)}
                />
                <button onClick={onCreate}>Create</button>
                <button className='m-2' onClick={onSave}>Save</button>
            </div>
            
            {displayWeek()}
        </div>
    )
}

export default WeeklyView;

//button to add new week based on start date