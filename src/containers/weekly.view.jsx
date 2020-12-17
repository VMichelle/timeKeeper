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
    const [showCreateWeek, setShowCreateWeek] = useState(false);
    
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

    const getTotalHours = () => {
        return editWorkWeek.data.reduce((acc, currValue) => {
            return acc + currValue.hours
        }, 0)
    };

    const getTotalPto = () => {
        return editWorkWeek.data.reduce((acc, curr) => acc + curr.pto, 0)
    };

    const displayWeek = () => {
        if(editWorkWeek === null) return;
        
        return <div className='d-flex mt-3 p-3'>
            <div className='flex-column' style={{fontSize: 12, height: 50, width: 75}}>
                <div className='border p-1' style={{height: 50}}>Date</div>
                {editWorkWeek.data[0].hours.map(item => {
                    return <div className='border p-1'>{item.chargeCodeName}</div>
                })}
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

    // const chargeCodeDropdown = () => {

    //     return <>
    //         <select className='form-control mt-2' onChange={e => setSelectedChargeCode(e.target.value)}>
    //             <option key='00' value='custom'>Custom</option>
    //             {chargeCodes.map((code, index) => {
    //                 const { name } = code;
    //                 return <option key={index} value={name}>{name}</option>
    //             })}
    //         </select>
    //     </>
    // };

    // const displayEditChargeCodes = () => {
    //     if(!editChargeCodeList) return;

    //     return editChargeCodeList.map((code, index) => {
    //         //console.log(code);
    //         if(code === null || code === 'custom') {
    //             return <div key={index} className='d-flex mt-2'>
    //                 <input
    //                     type='text'
    //                     onChange={event => console.log(event.target.value)}
    //                 />
    //                 <button>X</button>
    //             </div>
    //         }
    //         return <div key={index} className='d-flex mt-2'>
    //             <input value={code} disabled />
    //             <button onClick={() => removeChargeCode(code)}>X</button>
    //         </div>
    //     })
    // };

    // const removeChargeCode = chargeCodeName => {
    //     //console.log(index);
    //     const newList = editChargeCodeList.filter(item => item !== chargeCodeName)
    //     setEditChargeCodeList(newList);
    // };

    // const addEditChargecode = chargeCode => {
    //     console.log(chargeCode);
    //     setEditChargeCodeList([...editChargeCodeList, chargeCode]);
    //     console.log(editChargeCodeList);
    // };

    const displayCreateWeek = () => {
        return <CreateNewWeek />
        // return <div className='p-4 border-bottom mb-4'>
        //     <label>Start Date: </label>
        //     <div className='d-flex flex-column'>
        //         <input
        //             type='date'
        //             value={selectedDate}
        //             onChange={value => setSelectedDate(value.target.value)}
        //             className='ml-2'
        //             />
        //         <div className='mt-2'>Add Charge Code:</div>
        //         <div className='d-flex'>
        //             {chargeCodeDropdown()}
        //             <button className='px-4 ml-3' onClick={() => addEditChargecode(selectedChargeCode)}>Add</button>
        //         </div>
        //         {editChargeCodeList && displayEditChargeCodes()}
                
        //     </div> 

        //     <button onClick={onCreate} className='mx-2'>Create</button>
        //     <button className='m-2' onClick={onSave}>Save</button>
        // </div>
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