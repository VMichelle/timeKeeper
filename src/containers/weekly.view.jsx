/* eslint-disable */
import React, {useState, useEffect} from 'react';
import TimeInputField from '../components/time.input.field';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { setEditWeek, setAvailableWeeks, setSelectedWeek } from '../reducers/reducer';
//import { DropdownButton, Dropdown } from 'react-bootstrap'

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
    const editWorkWeek = useSelector(state => state.editWorkWeek);
    const {selectedWorkWeek, availableWorkWeeks} = useSelector(state => state);
    
    useEffect(() => {
        fetchWeeks()       
    }, [])

    const fetchWeeks = () => {
        db.collection("timeKeeper")
        .onSnapshot(querySnapshot => {
            let availWeeks = []
            querySnapshot.forEach(doc => availWeeks.push(doc.data()));
            dispatch(setAvailableWeeks(availWeeks));
        })
    }

    const onSave = () => {
        //console.log('save clicked', editWorkWeek);
        const docName = dayjs(selectedDate).format('MMDDYYYY');
        console.log(docName);
        db.collection('timeKeeper').doc(docName).set({
            ...editWorkWeek
        }, {merge: true})
        .then(function() {
            fetchWeeks();
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
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

        const editWorkWeek = {
            startDate: dayjs(selectedDate).format(),
            endDate: dayjs(selectedDate).add(7, 'day').format(),
            data: weeklyDefault
        }

        dispatch(setEditWeek(editWorkWeek));
    };

    const getTotalHours = () => {
        return editWorkWeek.data.reduce((acc, currValue) => {
            return acc + currValue.hours
        }, 0)
    };

    const getTotalPto = () => {
        return editWorkWeek.data.reduce((acc, curr) => acc + curr.pto, 0)
    };

    const displayWeek = () => {
        if(editWorkWeek === null) return console.log('no days');
        
        return <div className='d-flex mt-3 p-3'>
            <div className='flex-column' style={{fontSize: 12, height: 50, width: 75}}>
                <div className='border p-1' style={{height: 50}}>Date</div>
                <div className='border p-1'>Hours</div>
                <div className='border p-1'>PTO</div>
            </div>
            {editWorkWeek.data.map((day, index) => {
                return <TimeInputField key={index} date={day.date} day={day} />
            })}
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1' style={{height: 50}}>Total</div>
                <div className='border p-1'>{getTotalHours()}</div>
                <div className='border p-1'>{getTotalPto()}</div>
            </div>
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1' style={{height: 50}}>Remaining Hours</div>
                <div className='border p-1 align-items-stretch'>{40 - getTotalHours() - getTotalPto()}</div>
            </div>
        </div>;
    };

    const displaySelectedWeek = () => {
        if(selectedWorkWeek === null) return;
    };

    const getSelectedWeek = selectedStartDate => {
        console.log(selectedStartDate);
        if(selectedStartDate == 'resetToDefault') {
            return dispatch(setEditWeek(null));
        }

        db.collection("timeKeeper").where('startDate', '==', selectedStartDate).get()
        .then(querySnapshot => {
            let selectedWeek = []
            querySnapshot.forEach(doc => selectedWeek.push(doc.data()));
            dispatch(setSelectedWeek(selectedWeek));
            dispatch(setEditWeek(selectedWeek[0]));
        })  
    }

    const displayDropDown = () => {
        return(
            <select 
                className="form-control"
                onChange={e => getSelectedWeek(e.target.value)}
            >
                <option key='00' value='resetToDefault'>Select an existing work week</option>
                {availableWorkWeeks.map((week, index) => {
                    console.log(week.id);
                    const startDateFormatted = dayjs(week.startDate).format('L');
                    const endDateFormatted = dayjs(week.endDate).format('L');
                    return <option key={index} value={week.startDate}>{`${startDateFormatted} - ${endDateFormatted}`}</option>
                })}
            </select>
        )
    }

    return (
        <div className='p-3 d-flex flex-column'>
            <div>Today: {dayjs(date).format('L').toString()}</div>
            <div>{availableWorkWeeks && displayDropDown()}</div>
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
            {displaySelectedWeek()}
        </div>
    )
}

export default WeeklyView;

//future: a way for users to add different types/department of hours
    //a page of totals, like a report
    //

    //intead of hours and pto, make it a configurable array