'use client';

import { CalendarDate } from 'calendar-base';
import { HORIZONTAL_CALENDAR_SLOT_AMOUNT } from '../constants';
import { useCalendarGrid } from '../hooks/useCalendarGrid';
import { FromTo } from '../types/FromTo';
import CalendarSlot from './CalendarSlot';
import DaysLegend from './DaysLegend';

const renderCalendarSlots = (
    calendarMonth: CalendarDate[],
    fromToMonth: FromTo[]
) => {
    return calendarMonth.map(({ day, siblingMonth }, i) => {
        return (
            <CalendarSlot
                slotId={i}
                day={day}
                from={fromToMonth[i].from}
                to={fromToMonth[i].to}
                addRightBorder={
                    i % HORIZONTAL_CALENDAR_SLOT_AMOUNT ===
                    HORIZONTAL_CALENDAR_SLOT_AMOUNT - 1
                }
                addBottomBorder={
                    i >= calendarMonth.length - HORIZONTAL_CALENDAR_SLOT_AMOUNT
                }
                isSiblingMonth={siblingMonth || false}
                key={i}
            />
        );
    });
};

type Props = {};

const CalendarGrid = (props: Props) => {
    const { selectedMonth, fromToMonth } = useCalendarGrid();

    return (
        <>
            <DaysLegend />
            {renderCalendarSlots(selectedMonth!, fromToMonth)}
        </>
    );
};

export default CalendarGrid;
