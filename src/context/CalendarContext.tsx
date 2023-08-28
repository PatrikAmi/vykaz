'use client';

import { MIDDLE_DAY_OF_THE_MONTH } from '@/features/Calendar/constants';
import { getCalendarMonths } from '@/features/Calendar/utils/getCalendarMonths';
import { CalendarMonthState } from '@/features/Calendar/types/CalendarMonthState';
import React, { useContext, useState } from 'react';

const CalendarMonthContext = React.createContext<CalendarMonthState>(
    {} as CalendarMonthState
);

export const useCalendarMonthContext = () => {
    return useContext(CalendarMonthContext);
};

type Props = { children: React.ReactNode };

export const CalendarMonthContextProvider = ({ children }: Props) => {
    const [calendarMonthState, setCalendarMonthState] =
        useState<CalendarMonthState>({} as CalendarMonthState);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const calendarMonths = getCalendarMonths();
    let indexOfSelectedCalendarMonth: number = 0;

    const selectedCalendarMonth =
        calendarMonths.find((calMonth, i) => {
            const month = calMonth[MIDDLE_DAY_OF_THE_MONTH];
            if (month.year === currentYear && month.month === currentMonth) {
                indexOfSelectedCalendarMonth = i;

                return true;
            }
        }) || null;

    const increaseSelectedMonth = () => {
        setCalendarMonthState(state => {
            if (
                state.indexOfSelectedCalendarMonth + 1 <
                calendarMonths.length
            ) {
                const newCalendarMonth =
                    calendarMonths[state.indexOfSelectedCalendarMonth + 1];

                return {
                    ...state,
                    indexOfSelectedCalendarMonth:
                        state.indexOfSelectedCalendarMonth + 1,
                    selectedCalendarMonth: newCalendarMonth,
                };
            }

            return { ...state };
        });
    };

    const decreaseSelectedMonth = () => {
        setCalendarMonthState(state => {
            if (state.indexOfSelectedCalendarMonth - 1 >= 0) {
                const newCalendarMonth =
                    calendarMonths[state.indexOfSelectedCalendarMonth - 1];

                return {
                    ...state,
                    indexOfSelectedCalendarMonth:
                        state.indexOfSelectedCalendarMonth - 1,
                    selectedCalendarMonth: newCalendarMonth,
                    year: newCalendarMonth[MIDDLE_DAY_OF_THE_MONTH].year,
                    month: newCalendarMonth[MIDDLE_DAY_OF_THE_MONTH].month,
                };
            }

            return { ...state };
        });
    };

    setCalendarMonthState({
        selectedCalendarMonth,
        indexOfSelectedCalendarMonth,
        increaseSelectedMonth,
        decreaseSelectedMonth,
    });

    return (
        <CalendarMonthContext.Provider value={calendarMonthState}>
            {children}
        </CalendarMonthContext.Provider>
    );
};
