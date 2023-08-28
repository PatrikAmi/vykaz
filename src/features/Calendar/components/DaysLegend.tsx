import React from 'react';
import { HORIZONTAL_CALENDAR_SLOT_AMOUNT, DAY_NAMES } from '../constants';
import DayLegend from './DayLegend';

const days: (typeof DayLegend)[] = [...Array(HORIZONTAL_CALENDAR_SLOT_AMOUNT)];

const renderDays = (days: (typeof DayLegend)[]) =>
    days.map((_, i) => (
        <DayLegend
            dayName={DAY_NAMES[i]}
            addRightBorder={i === HORIZONTAL_CALENDAR_SLOT_AMOUNT - 1}
            key={i}
        />
    ));

type Props = {};

const DaysLegend = (props: Props) => {
    return <>{renderDays(days)}</>;
};

export default DaysLegend;
