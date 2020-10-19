/* eslint-disable */
import React from 'react';
import TimeInputField from '../components/time.input.field';
import { dates } from '../2020days';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import firebaseConfig from '../config';

const WeeklyView = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    // require("firebase/firestore");
    // const db = firebase.firestore();

    dayjs.extend(localizedFormat);
    const date = dayjs();
    const workWeek = dates[0];

    return (
        <div className='p-3'>
            {dayjs(date).format('L').toString()}
            <button className='m-2' onClick={onSave}>Save</button>
            <div className='d-flex'>
                {workWeek.map((day, index) => {
                    return <TimeInputField key={index} date={day} />
                })}
            </div>
        </div>
    )
}

export default WeeklyView;

//date library
//write to json file
//button to add new week based on start date