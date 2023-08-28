import { MIDDLE_DAY_OF_THE_MONTH } from '../constants';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';

export const useCalendarNavbar = () => {
    const selectedMonth = useCalendarMonthStore(
        state => state.selectedCalendarMonth
    );
    const increaseSelectedMonth = useCalendarMonthStore(
        state => state.increaseSelectedMonth
    );
    const decreaseSelectedMonth = useCalendarMonthStore(
        state => state.decreaseSelectedMonth
    );
    const middleDay = selectedMonth![MIDDLE_DAY_OF_THE_MONTH];
    const month = middleDay.month;
    const year = middleDay.year;

    return {
        increaseSelectedMonth,
        decreaseSelectedMonth,
        month,
        year,
    };
};
