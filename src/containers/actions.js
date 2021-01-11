import * as firebase from "firebase/app";
import {
    setAvailableWeeks
} from '../reducers/reducer';
//import { firebaseConfig } from '../config';

export const fetchWeeks = () => {
    return dispatch => {
        const db = firebase.firestore();
        db.collection("timeKeeper")
            .onSnapshot(querySnapshot => {
                let availWeeks = [];

                querySnapshot.forEach(doc => availWeeks.push(doc.data()));
                availWeeks.sort((a, b) => a.startDate - b.startDate);

                dispatch(setAvailableWeeks(availWeeks));
            });
    } 
};