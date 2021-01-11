import React, {useEffect} from 'react';
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions';
import {Table} from 'react-bootstrap';
import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'

const Report = () => {
    const dispatch = useDispatch();
    dayjs.extend(localizedFormat);
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };
    require("firebase/firestore");

    const { availableWorkWeeks } = useSelector(state => state);

    useEffect(() => {
        if(!availableWorkWeeks) {
            dispatch(actions.fetchWeeks());
        } 
    }, [availableWorkWeeks, dispatch])

    const displayReport = () => {
        if(!availableWorkWeeks) return;

        return availableWorkWeeks.map(week => {
            const { startDate, endDate, data } = week;
            return <>
                <tr>
                    <td>{dayjs(startDate).format('L')}</td>
                    <td>{dayjs(endDate).format('L')}</td>
                    <td>{data[0].hours.map(item => <div>{item.chargeCodeName}</div>)}</td>
                    <td>{getTotalHours(data)}</td>
                </tr>                   
            </>
        })
    };

    const getTotalHours = data => {
        return data.reduce((acc, currValue) => {
            let totalDayHours = 0;
            const total = currValue.hours.reduce((acc, curr) => {
                return acc + parseFloat(curr.hours);
            }, 0)
            totalDayHours = totalDayHours + total;

            return acc + totalDayHours;
        }, 0)
    };

    return (
        <div className='p-4'>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Charge Codes</th>
                        <th>Total Hours</th>
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
