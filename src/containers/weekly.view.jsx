/* eslint-disable */
import React, {useState, useEffect} from 'react';
import TimeInputField from '../components/time.input.field';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
    setEditWeek,
    setAvailableWeeks,
    setSelectedWeek,
    setChargeCodes,
    //setEditChargeCodes
} from '../reducers/reducer';
import CreateNewWeek from './create.new.week';

const WeeklyView = () => {
    const dispatch = useDispatch();

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };
    
    require("firebase/firestore");
    const db = firebase.firestore();
    dayjs.extend(localizedFormat);

    const date = useSelector(state => state.currentDay);
    const editWorkWeek = useSelector(state => state.editWorkWeek);
    const {
        selectedWorkWeek,
        availableWorkWeeks, 
    } = useSelector(state => state);
    const [showCreateWeek, setShowCreateWeek] = useState(true);
    
    useEffect(() => {
        Promise.all([
            fetchWeeks(),
            fetchChargecodes()
        ])
    }, [])

    const fetchWeeks = async () => {
        try {
            return new Promise(resolve => {
                db.collection("timeKeeper")
                    .onSnapshot(querySnapshot => {
                        let availWeeks = [];

                        querySnapshot.forEach(doc => availWeeks.push(doc.data()));
                        availWeeks.sort((a, b) => a.startDate - b.startDate);
                        dispatch(setAvailableWeeks(availWeeks));
                        resolve(true);
                    });
            });
        } catch (err) {
            console.log(err);
        }
        
    };

   const fetchChargecodes = () => {
        db.collection("chargeCodes")
        .onSnapshot(querySnapshot => {
            console.log(querySnapshot);
            const listOfChargeCodes = [];
            querySnapshot.forEach(code => listOfChargeCodes.push(code.data()));
            dispatch(setChargeCodes(listOfChargeCodes));
        })
    } 

    const getTotalHours = chargeCodeName => {
        return editWorkWeek.data.reduce((acc, currValue) => {
            let totalDayHours = 0;
            if(!currValue.hours) return;
            for(let chargeCode in currValue.hours) {
                if(chargeCode === chargeCodeName) {
                    totalDayHours = totalDayHours + chargeCode.hours
                }  
            }
            return acc + totalDayHours;
        }, 0)
    };

    const displayWeek = () => {
        if(editWorkWeek === null) return;
        const { data } = editWorkWeek;
        
        return <div className='d-flex mt-3 p-3'>
            <div className='flex-column' style={{fontSize: 12, height: 50, width: 100}}>
                <div className='border p-1' style={{height: 50}}>Date</div>
                {data[0].hours.map((item, index) => {
                    return <div key={index} className='border p-1'>{item.chargeCodeName}</div>
                })}
            </div>
            {data.map((day, index) => {
                return <TimeInputField key={index} day={day} />
            })}
            <div className='flex-column' style={{fontSize: 12}}>
                <div className='border p-1' style={{height: 50}}>Total</div>
                {data[0].hours.map((item, index) => {
                    return <div key={index} className='border p-1'>{getTotalHours(item.chargeCode)}</div>
                })}
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
                    const startDateFormatted = dayjs(week.startDate).format('L');
                    const endDateFormatted = dayjs(week.endDate).format('L');
                    return <option key={index} value={week.startDate}>{`${startDateFormatted} - ${endDateFormatted}`}</option>
                })}
            </select>
        )
    };

    const displayCreateWeek = () => {
        return <CreateNewWeek />
    }

    return (
        <div className='p-3 d-flex flex-column'>
            <div>Today: {dayjs(date).format('L').toString()}</div>
            <button onClick={() => setShowCreateWeek(!showCreateWeek)} className='mb-4'>Create New Week</button>
            {showCreateWeek && displayCreateWeek()}

            <div>{availableWorkWeeks && displayDropDown()}</div>            
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

    //check if week exists before saving a newly created week
    //ordering list
    //allow for custom charge codes