import React, {useEffect, useState} from 'react';
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions';
import {Table} from 'react-bootstrap';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import ReportTableRow from './report.table.row';

const Report = () => {
    const dispatch = useDispatch();
    dayjs.extend(localizedFormat);
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };
    require("firebase/firestore");

    const { availableWorkWeeks, chargeCodes } = useSelector(state => state);

    useEffect(() => {
        if(!availableWorkWeeks) {
            dispatch(actions.fetchWeeks());
            dispatch(actions.fetchChargecodes());
        } 
    }, [availableWorkWeeks, dispatch]);

    const [selectedChargeCode, setSelectedChargeCode] = useState(null);

    const displayReport = () => {
        if(!availableWorkWeeks) return;

        return availableWorkWeeks.map(week => {
            return <ReportTableRow key={week.startDate} week={week} />;
        })
    };

    const onChangeChargeCode = value => {
        let codeName = value;
        if(codeName === 'none') {
            codeName = null;
        }

        setSelectedChargeCode(codeName);
        dispatch(actions.updateSelectedChargeCode(codeName));
    };

    const chargeCodeDropdown = () => {
        if(!chargeCodes) return;
        
        return <>
            <select className='form-control' onChange={e => onChangeChargeCode(e.target.value)}>
                <option key='00' value={'none'}>Select a charge code</option>
                {chargeCodes.map((code, index) => {
                    const { name } = code;
                    return <option key={index} value={name}>{name}</option>
                })}
            </select>
        </>
    };

    return (
        <div className='p-4'>
            <div className='pb-3'>
                <div>{chargeCodeDropdown()}</div>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Charge Codes</th>
                        <th>Total Hours</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {displayReport()}
                </tbody>
            </Table> 
        </div>
    )
}

export default Report;
