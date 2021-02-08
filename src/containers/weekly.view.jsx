/* eslint-disable */
import React, {useState, useEffect} from 'react';
import TimeInputField from '../components/time.input.field';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import firebase from 'firebase';
import { firestore } from 'firebase'
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
    setEditWeek,
    setSelectedWeek,
    setChargeCodes,
} from '../reducers/reducer';
import CreateNewWeek from './create.new.week';
import { Button } from 'react-bootstrap';
import * as actions from './actions';

const WeeklyView = () => {
    const dispatch = useDispatch();

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };
    
    require("firebase/firestore");
    const db = firestore();
    dayjs.extend(localizedFormat);

    const date = useSelector(state => state.currentDay);
    const editWorkWeek = useSelector(state => state.editWorkWeek);
    const {
        availableWorkWeeks,
        chargeCodes
    } = useSelector(state => state);
    const [showCreateWeek, setShowCreateWeek] = useState(false);
    
    useEffect(() => {
        dispatch(actions.fetchWeeks());
        fetchChargecodes();
    }, [dispatch])

   const fetchChargecodes = () => {
        db.collection("chargeCodes")
        .onSnapshot(querySnapshot => {
            console.log(querySnapshot);
            const listOfChargeCodes = [];
            querySnapshot.forEach(code => listOfChargeCodes.push(code.data()));
            dispatch(setChargeCodes(listOfChargeCodes));
        })
    };

    const getTotalHours = name => {
        return editWorkWeek.data.reduce((acc, currValue) => {
            let totalDayHours = 0;
            const indexOfCode = currValue.hours.findIndex(_ => _.chargeCodeName === name);
            totalDayHours = totalDayHours + parseFloat(currValue.hours[indexOfCode].hours)

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
                    return <div key={index} className='border p-1'>{getTotalHours(item.chargeCodeName)}</div>
                })}
            </div>
        </div>;
    };

    const getSelectedWeek = selectedStartDate => {
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
                className="form-control mt-4"
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

    const onSave = () => {
        const { startDate } = editWorkWeek;
        const docName = dayjs(startDate).format('MMDDYYYY');
        saveNewChargeCodes();

        db.collection('timeKeeper').doc(docName).set({
            ...editWorkWeek
        }, {merge: true})
        .then(function() {
            alert("Update Saved");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    };

    const saveNewChargeCodes = () => {
        const [firstEntry] = editWorkWeek?.data;
        const editChargeCodeList = firstEntry.hours.map(entry => entry.chargeCodeName);
        const currentCodeList  = chargeCodes.map(code => code.name);
        let newCodes = [];
        
        for (const code of editChargeCodeList) {
            const hasCode = currentCodeList.includes(code);
            
            if(!hasCode) {
                newCodes.push(code);
            }
        };

        if(newCodes.length > 0) {
            newCodes.forEach(code => {
                db.collection('chargeCodes').doc().set({
                    name: code,
                    userId: 101
                })
                .catch(error => {
                    console.log(error)
                });
            })  
        }
    };

    return (
        <div className='p-3 d-flex flex-column'>
            <div>Today: {dayjs(date).format('L').toString()}</div>
            <Button onClick={() => setShowCreateWeek(!showCreateWeek)}>Create New Week</Button>
            {showCreateWeek && displayCreateWeek()}

            <div>{availableWorkWeeks && !showCreateWeek && displayDropDown()}</div>            
            {displayWeek()}
            {editWorkWeek !== null &&
                <div>
                    <Button className='m-3' onClick={onSave}>Save</Button>
                </div>
            }
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