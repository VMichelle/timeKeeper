import React, {useEffect} from 'react';
import * as firebase from "firebase/app";
import { firebaseConfig } from '../config';
import { useSelector } from 'react-redux';
import * as actions from './actions';

const Report = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };

    const { availableWorkWeeks } = useSelector(state => state);

    useEffect(() => {
        if(!availableWorkWeeks) {
            actions.fetchWeeks();
        } 
    }, [availableWorkWeeks])



    return (
        <div>
            REPORT COMPONENT
        </div>
    )
}

export default Report;
