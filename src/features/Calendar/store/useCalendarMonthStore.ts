import { getCalendarMonths } from '@/features/Calendar/utils/getCalendarMonths';
import { CalendarDate } from 'calendar-base';
import { create } from 'zustand';
import {
    EMPTY_FROM_TO,
    MIDDLE_DAY_OF_THE_MONTH,
    SATURDAY,
    SUNDAY,
} from '../constants';
import { CalendarMonthState } from '../types/CalendarMonthState';
import { FromTo } from '../types/FromTo';
import { FromToKey } from '../types/FromToState';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';

const createEmptyFromToMonth = (calendarMonth: CalendarDate[]): FromTo[] => {
    const fromToMonth: FromTo[] = [];

    for (let i = 0; i < calendarMonth.length; i++) {
        //if (!calendarMonth[i].siblingMonth) {
        fromToMonth.push(EMPTY_FROM_TO);
        //}
    }

    return fromToMonth;
};

export const useCalendarMonthStore = create<CalendarMonthState>((set, get) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const calendarMonths = getCalendarMonths();
    let indexOfCalendarMonth: number = 0;

    const calendarMonth =
        calendarMonths.find((calMonth, i) => {
            const month = calMonth[MIDDLE_DAY_OF_THE_MONTH];
            if (month.year === currentYear && month.month === currentMonth) {
                indexOfCalendarMonth = i;

                return true;
            }
        }) || null;

    const changeSelectedMonth = (
        changeBy: number,
        state: CalendarMonthState
        //fromToFromStorage: FromTo[]
    ) => {
        const newCalendarMonth =
            calendarMonths[state.indexOfSelectedCalendarMonth + changeBy];

        /*const newFromToMonth: FromTo[] = fromToFromStorage.length
            ? fromToFromStorage
            : createEmptyFromToMonth(newCalendarMonth);*/

        const newFromToMonth: FromTo[] =
            createEmptyFromToMonth(newCalendarMonth);

        return {
            ...state,
            indexOfSelectedCalendarMonth:
                state.indexOfSelectedCalendarMonth + changeBy,
            selectedCalendarMonth: newCalendarMonth,
            fromToMonth: newFromToMonth,
        };
    };

    const increaseSelectedMonth = (/*fromToFromStorage: FromTo[]*/) => {
        set(state => {
            if (
                state.indexOfSelectedCalendarMonth + 1 <
                calendarMonths.length
            ) {
                return changeSelectedMonth(1, state /*, fromToFromStorage*/);
            }

            return { ...state };
        });
    };

    const decreaseSelectedMonth = (/*fromToFromStorage: FromTo[]*/) => {
        set(state => {
            if (state.indexOfSelectedCalendarMonth - 1 >= 0) {
                return changeSelectedMonth(-1, state /*, fromToFromStorage*/);
            }

            return { ...state };
        });
    };

    const setFromToDay = (
        slotId: number,
        fromToKey: FromToKey,
        value: string
    ) => {
        set(state => {
            const newFromToMonth = [...state.fromToMonth];
            const { month, year } = getSelectedMonthYear(
                state.selectedCalendarMonth!
            );

            newFromToMonth[slotId] = {
                ...newFromToMonth[slotId],
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

    const setFromToMonth = () => {
        set(state => {
            const { month, year } = getSelectedMonthYear(
                state.selectedCalendarMonth!
            );
            const fromToFromStorage = JSON.parse(
                localStorage.getItem(JSON.stringify({ month, year })) || '[]'
            );

            if (fromToFromStorage.length) {
                return { ...state, fromToMonth: fromToFromStorage };
            }

            return {
                ...state,
                fromToMonth: createEmptyFromToMonth(
                    state.selectedCalendarMonth!
                ),
            };
        });
    };

    const fillFromToMonth = (newFrom: string, newTo: string) => {
        set(state => {
            const { month, year } = getSelectedMonthYear(
                state.selectedCalendarMonth!
            );

            const filledFromToMonth: FromTo[] = state.fromToMonth.map(
                (fromTo, i) => {
                    const day = state.selectedCalendarMonth![i];
                    if (day.weekDay === 0 || day.weekDay === 6) {
                        return fromTo;
                    }

                    return { from: newFrom, to: newTo };
                }
            );

            localStorage.setItem(
                JSON.stringify({ month, year }),
                JSON.stringify(filledFromToMonth)
            );

            return { ...state, fromToMonth: filledFromToMonth };
        });
    };

    return {
        indexOfSelectedCalendarMonth: indexOfCalendarMonth,
        selectedCalendarMonth: calendarMonth,
        increaseSelectedMonth,
        decreaseSelectedMonth,
        fromToMonth: createEmptyFromToMonth(calendarMonth!),
        setFromToDay,
        setFromToMonth,
        fillFromToMonth,
    };
});
