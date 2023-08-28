import { FromToKey } from '../types/FromToState';
import { ChangeEvent, useEffect, useState } from 'react';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';
import { FromTo } from '../types/FromTo';

export const useCalendarSlot = (slotId: number) => {
    /*const [fromError, setFromError] = useState<boolean>(true);
    const [toError, setToError] = useState<boolean>(true);*/
    const setFromToDay = useCalendarMonthStore(store => store.setFromToDay);
    const selectedMonth = useCalendarMonthStore(
        store => store.selectedCalendarMonth
    );

    const { month, year } = getSelectedMonthYear(selectedMonth!);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fromToKey: FromToKey
    ) => {
        setFromToDay(slotId, fromToKey, e.target.value);
    };

    return { handleChange /*, fromError, toError*/ };
};
