export const HORIZONTAL_CALENDAR_SLOT_AMOUNT = 7;
export const VERTICAL_CALENDAR_SLOT_AMOUNT = 6;
export const DAY_NAMES = ['Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ned'];
export const MONTH_NAMES = [
    'Január',
    'Február',
    'Marec',
    'Apríl',
    'Máj',
    'Jún',
    'Júl',
    'August',
    'September',
    'Október',
    'November',
    'December',
];
export const NUMBER_OF_MONTHS_TO_DISPLAY = 36;
export const STARTING_DAY_MONDAY = 1;
export const NUMBER_OF_MONTHS_IN_A_YEAR = 12;
export const MIDDLE_DAY_OF_THE_MONTH = 15;
export const FROM = 'from';
export const TO = 'to';
export const EMPTY_FROM_TO = {
    from: '',
    to: '',
};
export const SATURDAY = 6;
export const SUNDAY = 0;
export const ADDITIONAL_INFO_LOCAL_STORAGE_KEY = 'AdditionalInfo';
export const TIMES_NEW_ROMAN = 'Times New Roman';
export const HOURS_IN_DAY = 24;

export enum POSSIBLE_INPUTS {
    HOLIDAY = 'D',
    TIME_OFF = 'NV',
    CUSTOM = 'S',
}

export const INPUT_REGEX =
    /^(S|s|NV|nv|D|d|(?:[01]?[0-9]|2[0-4])[\.: ][0-5][0-9])$/;

export const LETTER_REGEX = /^(S|s|NV|nv|D|d)$/;

export const TIME_REGEX = /^([01]?[0-9]|2[0-4])[\.: ]([0-5][0-9])$/;

export const STANDARD_WORK_HOURS = 8;
