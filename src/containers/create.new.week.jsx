import React, {useState} from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
    setEditWeek
} from '../reducers/reducer';

const CreateNewWeek = () => {
    const dispatch = useDispatch();

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };

    require("firebase/firestore");
    const db = firebase.firestore();
    dayjs.extend(localizedFormat);

    const date = useSelector(state => state.currentDay);
    const {availableWorkWeeks, chargeCodes, editWorkWeek} = useSelector(state => state);
    const [selectedDate, setSelectedDate] = useState(dayjs(date).format('YYYY-MM-DD'));
    const [selectedChargeCode, setSelectedChargeCode] = useState(null);
    const [editChargeCodeList, setEditChargeCodeList] = useState([]);
    const [customeCode, setCustomCode] = useState('');

    const chargeCodeDropdown = () => {
        if(!chargeCodes) return;
        
        return <>
            <select className='form-control' onChange={e => setSelectedChargeCode(e.target.value)}>
                {/* <option key='00' value='custom'>Custom</option> */}
                {chargeCodes.map((code, index) => {
                    const { name } = code;
                    return <option key={index} value={name}>{name}</option>
                })}
            </select>
        </>
    };

    const addEditChargecode = chargeCode => {
        console.log(chargeCode);
        setEditChargeCodeList([...editChargeCodeList, chargeCode]);
        //console.log(editChargeCodeList);
    };

    const removeChargeCode = chargeCodeName => {
        //console.log(index);
        const newList = editChargeCodeList.filter(item => item !== chargeCodeName)
        setEditChargeCodeList(newList);
    };

    const displayEditChargeCodes = () => {
        if(!editChargeCodeList) return;

        return editChargeCodeList.map((code, index) => {
            // //console.log(code);
            // if(code === null || code === 'custom') {
            //     return <div key={index} className='d-flex mt-2'>
            //         <input
            //             type='text'
            //             value={editChargeCodeList[index] ? editChargeCodeList[index] : ''}
            //             onChange={event => updateCustomCode(index, event.target.value)}
            //         />
            //         <button onClick={() => removeChargeCode(code)}>X</button>
            //     </div>
            // }
            return <div key={index} className='d-flex mt-2'>
                <input value={code} disabled />
                <button onClick={() => removeChargeCode(code)}>X</button>
            </div>
        })
    };

    const onSave = () => {
        const docName = dayjs(selectedDate).format('MMDDYYYY');

        db.collection('timeKeeper').doc(docName).set({
            ...editWorkWeek
        }, {merge: true})
        .then(function() {
            //fetchWeeks();
            alert("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    };

    const onCreate = () => {          
        const hasExistingWeek = checkForExisitingWeek(selectedDate);
        const hasChargeCodes = editChargeCodeList.length !== 0;
        if (hasExistingWeek) {
            return alert('Week already exists');
        };

        if(!hasChargeCodes) {
            return alert('Needs charge codes');
        }

        let daysToAdd = 0;
        let newWorkWeek = [];

        while (daysToAdd <= 7) {
            let addedDay = dayjs(selectedDate).add(daysToAdd, 'day');
            const date = addedDay.format('L');
            newWorkWeek.push(date);
            ++daysToAdd;
        };

        const weeklyDefault = newWorkWeek.map((day) => {
            return editChargeCodeList.map(code => {
                return {[code]: 0}
            })
            //return {date: day, hours: 0, pto: 0};
        })

        const editWorkWeek = {
            startDate: dayjs(selectedDate).format(),
            endDate: dayjs(selectedDate).add(7, 'day').format(),
            data: weeklyDefault
        }

        dispatch(setEditWeek(editWorkWeek));
    };

    const checkForExisitingWeek = date => {
        const hasExistingWeek = availableWorkWeeks.find(week => {
            return dayjs(date).isSame(dayjs(week.startDate));
        })

        return hasExistingWeek;
    };

    return <div className='p-4 border-bottom mb-4'>
            <label>Start Date: </label>
            <div className='d-flex flex-column mb-5'>
                <input
                    type='date'
                    value={selectedDate}
                    onChange={value => setSelectedDate(value.target.value)}
                    className='ml-2'
                    />

                <div className='d-flex flex-row pt-2 pb-2'>
                    <div className='d-flex flex-column'>
                        <div className='mt-2'>Existing Charge Code:</div>
                        <div className='d-flex flex-row'>
                            {chargeCodeDropdown()}
                            <button className='px-3 ml-3' onClick={() => addEditChargecode(selectedChargeCode)}>Add</button>
                        </div>
                    </div>
                       
                    <div className='ml-4 d-flex flex-column'>
                        <div className='mt-2'>Add New Charge Code:</div>
                        <div className='d-flex flex-row'>
                            <input type='text' 
                                value={customeCode}
                                onChange={e => setCustomCode(e.target.value)}
                            />
                            <button className='px-4 ml-3' onClick={() => addEditChargecode(customeCode)}>Add</button>
                        </div>
                    </div>
                    
                    
                </div> 
                {editChargeCodeList && displayEditChargeCodes()}
            </div> 

            <button onClick={onCreate} className='mx-2'>Create</button>
            <button className='m-2' onClick={onSave}>Save</button>
        </div>
}

export default CreateNewWeek;
