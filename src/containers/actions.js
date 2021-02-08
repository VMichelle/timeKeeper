import { firestore } from 'firebase';
import {
    setAvailableWeeks,
    setChargeCodes,
    setSelectedChargeCode
} from '../reducers/reducer';
import * as dayjs from 'dayjs';

export const fetchWeeks = () => {
    return dispatch => {
        const db = firestore();
        db.collection("timeKeeper")
            .onSnapshot(querySnapshot => {
                let availWeeks = [];

                querySnapshot.forEach(doc => availWeeks.push(doc.data()));
                availWeeks.sort((a, b) => dayjs(b.startDate) - dayjs(a.startDate));

                dispatch(setAvailableWeeks(availWeeks));
            });
    };
};

export const fetchChargecodes = () => {
    return dispatch => {
        const db = firestore();
        db.collection("chargeCodes")
        .onSnapshot(querySnapshot => {
            const listOfChargeCodes = [];

            querySnapshot.forEach(code => listOfChargeCodes.push(code.data()));

            dispatch(setChargeCodes(listOfChargeCodes));
        })
    };
};

export const updateSelectedChargeCode = chargeCode => {
    return dispatch => {
        dispatch(setSelectedChargeCode(chargeCode));
    }
}