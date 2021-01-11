import React, {useState} from 'react';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
    setEditWeek
} from '../reducers/reducer';
import { Button } from 'react-bootstrap';

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
                <option key='00'>Select a charge code</option>
                {chargeCodes.map((code, index) => {
                    const { name } = code;
                    return <option key={index} value={name}>{name}</option>
                })}
            </select>
        </>
    };

    const addEditChargecode = chargeCode => {
        if(!chargeCode) return;

        const hasExisting = editChargeCodeList.some(code => code.toLowerCase() === chargeCode.toLowerCase());
        if(hasExisting) return alert('Cannot add duplicate charge code');

        setEditChargeCodeList([...editChargeCodeList, chargeCode]);
    };

    const removeChargeCode = chargeCodeName => {
        const newList = editChargeCodeList.filter(item => item !== chargeCodeName)
        setEditChargeCodeList(newList);
    };

    const displayEditChargeCodes = () => {
        if(!editChargeCodeList) return;

        return editChargeCodeList.map((code, index) => {
            return <div key={index} className='d-flex mt-2'>
                <Button
                    size='sm'
                    onClick={() => removeChargeCode(code)}
                    variant='outline-danger'>X</Button>
                <div className='pl-3'>{code}</div>  
            </div>
        })
    };

    const onCancel = () => {
        dispatch(setEditWeek(null))
    }

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

        while (daysToAdd < 7) {
            let addedDay = dayjs(selectedDate).add(daysToAdd, 'day');
            const date = addedDay.format('L');
            newWorkWeek.push(date);
            ++daysToAdd;
        };

        const defaultHours = [];
        
        editChargeCodeList.forEach(item => {
            defaultHours.push({chargeCodeName: item, hours: 0})
        });

        const weeklyDefault = newWorkWeek.map(day => {
            return {date: day, hours: defaultHours}
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
        <div className='d-flex'>
            <div className='d-flex flex-column mb-5'>
            <label>Start Date</label>
                <input
                    type='date'
                    value={selectedDate}
                    onChange={value => setSelectedDate(value.target.value)}
                    className='p-1'
                    />
                <div className='d-flex flex-row pt-2 pb-2'>
                    <div className='d-flex flex-column'>
                        <div className='mt-2'>Charge Codes</div>
                        <div className='d-flex flex-row'>
                            {chargeCodeDropdown()}
                            <Button className='px-3 ml-3' onClick={() => addEditChargecode(selectedChargeCode)}>Add</Button>
                        </div>
                    </div>
                    <div className='ml-4 d-flex flex-column'>
                        <div className='mt-2'>Add New Charge Code</div>
                        <div className='d-flex flex-row'>
                            <input type='text' 
                                value={customeCode}
                                onChange={e => setCustomCode(e.target.value)}
                            />
                            <Button className='px-4 ml-3' onClick={() => addEditChargecode(customeCode)}>Add</Button>
                        </div>
                    </div>
                </div>
            </div> 
            {editChargeCodeList && displayEditChargeCodes()}
        </div> 
        <Button onClick={onCreate} className='mx-2'>Create</Button>
        <Button className='m-2' onClick={onCancel}>Cancel</Button>
    </div>
}

export default CreateNewWeek;
