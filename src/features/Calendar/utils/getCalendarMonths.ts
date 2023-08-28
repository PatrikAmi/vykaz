import { Calendar as CalendarBase, CalendarDate } from 'calendar-base';
import {
    NUMBER_OF_MONTHS_IN_A_YEAR,
    NUMBER_OF_MONTHS_TO_DISPLAY,
    STARTING_DAY_MONDAY,
} from '../constants';

export const getCalendarMonths = (): CalendarDate[][] => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const calendar = new CalendarBase({
        siblingMonths: true,
        weekStart: STARTING_DAY_MONDAY,
    });
    let result: CalendarDate[][] = [];

    for (let i = 0; i < NUMBER_OF_MONTHS_TO_DISPLAY; i++) {
        const month = i % NUMBER_OF_MONTHS_IN_A_YEAR;
        const year =
            currentYear - 1 + Math.floor(i / NUMBER_OF_MONTHS_IN_A_YEAR);
        const calendarMonth = calendar.getCalendar(
            year,
            month
        ) as CalendarDate[];
        result.push(calendarMonth);
    }

    return result;
};
