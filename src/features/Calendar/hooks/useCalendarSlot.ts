import { FromToKey } from '../types/FromToState';
import { ChangeEvent, useEffect } from 'react';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';
import { FromTo } from '../types/FromTo';

export const useCalendarSlot = (slotId: number) => {
    const setFromToDay = useCalendarMonthStore(store => store.setFromToDay);
    const selectedMonth = useCalendarMonthStore(
        store => store.selectedCalendarMonth
    );

    const { month, year } = getSelectedMonthYear(selectedMonth!);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fromToKey: FromToKey
    ) => {
        /*const newFromToMonth = [...fromToMonth];

        newFromToMonth[slotId] = {
            ...newFromToMonth[slotId],
            [fromToKey]: e.target.value,
        };*/

        setFromToDay(slotId, fromToKey, e.target.value);

        /*localStorage.setItem(
            JSON.stringify({ month, year }),
            JSON.stringify(newFromToMonth)
        );*/
    };

    return { handleChange };
};
