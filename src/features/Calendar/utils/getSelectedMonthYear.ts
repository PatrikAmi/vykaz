import { CalendarDate } from 'calendar-base';
import { MIDDLE_DAY_OF_THE_MONTH } from '../constants';

export const getSelectedMonthYear = (selectedMonth: CalendarDate[]) => {
    const middleDay = selectedMonth![MIDDLE_DAY_OF_THE_MONTH];
    const month = middleDay.month;
    const year = middleDay.year;

    return { month, year };
};
