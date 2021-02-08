import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const ReportTableRow = ({ week }) => {
    const { startDate, endDate, data } = week;
    const [showDetails, updateShowDetails] = useState(true);
    const { selectedChargeCode } = useSelector(state => state)

    const getTotalPerCode = (data, code) => {
        return data.reduce((acc, currValue) => {
            let totalDayHours = 0;
            const indexOfCode = currValue.hours.findIndex(_ => _.chargeCodeName === code);
            totalDayHours = totalDayHours + parseFloat(currValue.hours[indexOfCode].hours)

            return acc + totalDayHours;
        }, 0)
    };

    const getTotalHours = data => {
        return data.reduce((acc, currValue) => {
            let totalDayHours = 0;
            const total = currValue.hours.reduce((acc, curr) => {
                // if(selectedChargeCode && curr.chargeCodeName !== selectedChargeCode) {
                //     return acc + 0;
                // }

                return acc + parseFloat(curr.hours);
            }, 0)
            totalDayHours = totalDayHours + total;

            return acc + totalDayHours;
        }, 0)
    };
    
    return <>
        <tr onClick={() => updateShowDetails(!showDetails)}>
            <td>{dayjs(startDate).format('L')}</td>
            <td>{dayjs(endDate).format('L')}</td>
            <td></td>
            <td style={{fontWeight: 'bold'}}>{getTotalHours(data)}</td>
            <td>{showDetails ? 'v' : '>'}</td>
        </tr>
        {showDetails && data[0].hours.map((item, index) => {
            if(selectedChargeCode && item.chargeCodeName !== selectedChargeCode) {
                return <></>;
            };

            return <tr key={index}>
                <td />
                <td />
                <td>
                    {item.chargeCodeName}
                </td>
                <td>{getTotalPerCode(data, item.chargeCodeName)}</td>
            </tr>
        })}               
    </>
}

ReportTableRow.propTypes = {
    week: PropTypes.object
}

export default ReportTableRow
