/* eslint-disable */
import React, {useState} from 'react';
import TimeInputField from '../components/time.input.field';
import { dates } from '../2020days';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';

const WeeklyView = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    require("firebase/firestore");
    //const db = firebase.firestore();

    dayjs.extend(localizedFormat);
    const date = dayjs();
    const workWeek = [];
    const [selectedDate, setSelectedDate] = useState(dayjs(date).format('YYYY-MM-DD'));

    const onSave = () => {
        console.log('save clicked');
    };

    const onCreate = () => {
        console.log('onCreate click');


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
            </div>
            <button className='m-2' onClick={onSave}>Save</button>
            
            {workWeek && <div className='d-flex'>
                {workWeek.map((day, index) => {
                    return <TimeInputField key={index} date={day} />
                })}
            </div>}
        </div>
    )
}

export default WeeklyView;

//button to add new week based on start date