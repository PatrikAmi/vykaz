'use client';

import {
    EMPTY_FROM_TO,
    MIDDLE_DAY_OF_THE_MONTH,
} from '@/features/Calendar/constants';
import { FromTo } from '@/features/Calendar/types/FromTo';
import { FromToKey, FromToState } from '@/types/FromToState';
import { CalendarDate } from 'calendar-base';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCalendarMonthContext } from './CalendarContext';

const FromToContext = createContext<FromToState>({} as FromToState);

export const useFromToContext = () => {
    return useContext(FromToContext);
};

const createEmptyFromToMonth = (calendarMonth: CalendarDate[]): FromTo[] => {
    const fromToMonth: FromTo[] = [];

    for (let i = 0; i < calendarMonth.length; i++) {
        //if (!calendarMonth[i].siblingMonth) {
        fromToMonth.push(EMPTY_FROM_TO);
        //}
    }

    return fromToMonth;
};

type Props = {
    children: React.ReactNode;
};

export const FromToContextProvider = ({ children }: Props) => {
    const { selectedCalendarMonth } = useCalendarMonthContext();
    const [fromToState, setFromToState] = useState<FromToState>({
        fromToMonth: createEmptyFromToMonth(selectedCalendarMonth!),
    } as FromToState);

    useEffect(() => {
        const middleDay = selectedCalendarMonth![MIDDLE_DAY_OF_THE_MONTH];
        const month = middleDay.month;
        const year = middleDay.year;

        const fromToMonth: FromTo[] = JSON.parse(
            localStorage.getItem(
                JSON.stringify({
                    month,
                    year,
                })
            ) || '[]'
        );

        if (fromToMonth.length) {
            setFromToState(state => ({
                ...state,
                fromToMonth: createEmptyFromToMonth(selectedCalendarMonth!),
            }));
        }
    }, [selectedCalendarMonth]);

    const setFromToDay = (
        slotId: number,
        fromToKey: FromToKey,
        value: string
    ) => {
        setFromToState(state => {
            const middleDay = selectedCalendarMonth![MIDDLE_DAY_OF_THE_MONTH];
            const month = middleDay.month;
            const year = middleDay.year;

            const fromToToReplace = state.fromToMonth[slotId];
            const newFromToMonth = [...state.fromToMonth];
            newFromToMonth[slotId] = {
                ...fromToToReplace,
                [fromToKey]: value,
            };

            localStorage.setItem(
                JSON.stringify({ month, year }),
                JSON.stringify(newFromToMonth)
            );

            return {
                ...state,
                fromToMonth: newFromToMonth,
            };
        });
    };

    const setFromToMonth = (fromToMonth: FromTo[]) => {
        setFromToState(state => ({ ...state, fromToMonth }));
    };

    setFromToState(state => ({ ...state, setFromToDay, setFromToMonth }));

    return <div></div>;
};
