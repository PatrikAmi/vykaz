import { useEffect } from 'react';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';

export const useCalendarGrid = () => {
    const selectedMonth = useCalendarMonthStore(
        store => store.selectedCalendarMonth
    );
    const fromToMonth = useCalendarMonthStore(store => store.fromToMonth);
    const setFromToMonth = useCalendarMonthStore(store => store.setFromToMonth);
    const { month, year } = getSelectedMonthYear(selectedMonth!);

    useEffect(() => {
        setFromToMonth();
    }, [setFromToMonth, month, year]);

    return { selectedMonth, fromToMonth };
};
