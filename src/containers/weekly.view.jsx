/* eslint-disable */
import React, {useState} from 'react';
import TimeInputField from '../components/time.input.field';
import { dates } from '../2020days';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { setEditWeek } from '../reducers/reducer';

const WeeklyView = () => {
    const dispatch = useDispatch();
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    require("firebase/firestore");
    const db = firebase.firestore();
    dayjs.extend(localizedFormat);

    const date = useSelector(state => state.currentDay);
    const [selectedDate, setSelectedDate] = useState(dayjs(date).format('YYYY-MM-DD'));
    //const [workWeek, setWorkWeek] = useState([]);
    const editWorkWeek = useSelector(state => state.editWorkWeek);

    db.collection("timeKeeper").doc("userWeeks")
    .onSnapshot((doc) => {
        //console.log("Current data: ", doc.data());
    });

    const onSave = () => {
        console.log('save clicked', workWeek);
        db.collection('timeKeeper').add({
            workWeek
        })
    };

    const onCreate = () => {
        let daysToAdd = 1;
        let newWorkWeek = [];

        while (daysToAdd <= 7) {
            let addedDay = dayjs(selectedDate).add(daysToAdd, 'day');
            const date = addedDay.format('L');
            newWorkWeek.push(date);
            ++daysToAdd;
        };

        const weeklyDefault = newWorkWeek.map((day) => {
            return {date: day, hours: 0, pto: 0};
        })

        dispatch(setEditWeek(weeklyDefault));
    };

    const getTotalHours = () => {
        return editWorkWeek.reduce((acc, currValue) => {
            console.log(acc, currValue.hours);
            return acc + currValue.hours
        }, 0)
    };

    const getTotalPto = () => {
        return editWorkWeek.reduce((acc, curr) => acc + curr.pto, 0)
    };

    const displayWeek = () => {
        if(editWorkWeek === null) return console.log('no days');
        
        return <div className='d-flex mt-3 p-3'>
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1'>Date</div>
                <div className='border p-1'>Hours</div>
                <div className='border p-1'>PTO</div>
            </div>
            {editWorkWeek !== null && editWorkWeek.map((day, index) => {
                return <TimeInputField key={index} date={day.date} />
            })}
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1'>Total</div>
                <div className='border p-1'>{getTotalHours()}</div>
                <div className='border p-1'>{getTotalPto()}</div>
            </div>
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1'>Remaining Hours</div>
                <div className='border p-1'>{40 - getTotalHours() - getTotalPto()}</div>
                {/* {getWeeklyTotal()} */}
            </div>
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

//