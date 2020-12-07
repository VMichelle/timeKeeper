/* eslint-disable */
import React, {useState, useEffect} from 'react';
import TimeInputField from '../components/time.input.field';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { setEditWeek, setAvailableWeeks, setSelectedWeek, setChargeCodes } from '../reducers/reducer';
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
    const {selectedWorkWeek, availableWorkWeeks, chargeCodes, editChargeCodes} = useSelector(state => state);
    const [showCreateWeek, setShowCreateWeek] = useState(false);
    const [selectedChargeCode, setSelectedChargeCode] = useState(null);
    
    useEffect(() => {
        Promise.all([
            fetchWeeks(),
            fetchChargecodes()
        ])
            
        
    }, [])

    const fetchWeeks = () => {
        return new Promise((resolve, reject) => {
            db.collection("timeKeeper")
            .onSnapshot(querySnapshot => {
            let availWeeks = []

            querySnapshot.forEach(doc => availWeeks.push(doc.data()));
            availWeeks.sort((a, b) => a.startDate - b.startDate);
            dispatch(setAvailableWeeks(availWeeks));
            resolve(true);
            })
        }).catch(err => {

        })
        
    };

    const fetchChargecodes = () => {
        db.collection("chargeCodes").doc('mvu')
        .onSnapshot(querySnapshot => {
            console.log(querySnapshot);
            dispatch(setChargeCodes(querySnapshot.data()));
        })
    }

    const checkForExisitingWeek = date => {
        const hasExistingWeek = availableWorkWeeks.find(week => {
            return dayjs(date).isSame(dayjs(week.startDate));
        })

        return hasExistingWeek;
    }

    const onSave = () => {
        const docName = dayjs(selectedDate).format('MMDDYYYY');

        db.collection('timeKeeper').doc(docName).set({
            ...editWorkWeek
        }, {merge: true})
        .then(function() {
            fetchWeeks();
            alert("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    };

    const onCreate = () => {
                
        const hasExistingWeek = checkForExisitingWeek(selectedDate);
        if (hasExistingWeek) {
            return alert('Week already exists');
        };

        let daysToAdd = 0;
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
                    const startDateFormatted = dayjs(week.startDate).format('L');
                    const endDateFormatted = dayjs(week.endDate).format('L');
                    return <option key={index} value={week.startDate}>{`${startDateFormatted} - ${endDateFormatted}`}</option>
                })}
            </select>
        )
    };

    const chargeCodeDropdown = () => {
        const {codes} = chargeCodes;

        return <>
            <select className='form-control mt-2' onChange={e => setSelectedChargeCode(e.target.value)}>
                <option key='00' value='custom'>Custom</option>
                {codes.map((code, index) => {
                    return <option key={index} value={code}>{code}</option>
                })}
            </select>
        </>
    };

    const displayEditChargeCodes = () => {
        return editChargeCodes.map(code => {
            return <div>
                <div>{code}</div>
                <button>Delete</button>
            </div>
        })
    };

    const addEditChargecode = () => {
        //set edit charge code to redux, in array of objects with id?
    };

    const displayCreateWeek = () => {
        return <div className='p-4 border-bottom mb-4'>
            <label>Start Date: </label>
            <div className='d-flex flex-column'>
                <input
                    type='date'
                    value={selectedDate}
                    onChange={value => setSelectedDate(value.target.value)}
                    className='ml-2'
                    />
                <div className='mt-2'>Add Charge Code:</div>
                <div className='d-flex'>
                    {chargeCodeDropdown()}
                    <button className='px-4 ml-3' onClick={() => addEditChargecode(selectedChargeCode)}>Add</button>
                </div>
                {editChargeCodes && displayEditChargeCodes()}
                
            </div>
            

            <button onClick={onCreate} className='mx-2'>Create</button>
            <button className='m-2' onClick={onSave}>Save</button>
        </div>
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