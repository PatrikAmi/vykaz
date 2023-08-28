import { CalendarDate } from 'calendar-base';
import { FromToState } from './FromToState';

export type CalendarMonthState = FromToState & {
    indexOfSelectedCalendarMonth: number;
    selectedCalendarMonth: CalendarDate[] | null;
    increaseSelectedMonth: (/*fromToFromStorage: FromTo[]*/) => void;
    decreaseSelectedMonth: (/*fromToFromStorage: FromTo[]*/) => void;
};
