import { FROM, TO } from '@/features/Calendar/constants';
import { FromTo } from '@/features/Calendar/types/FromTo';

export type FromToKey = typeof FROM | typeof TO;

export type FromToState = {
    fromToMonth: FromTo[];
    //setFrom: (from: string) => void;
    //setTo: (to: string) => void;
    setFromToDay: (slotId: number, fromToKey: FromToKey, value: string) => void;
    setFromToMonth: () => void;
    fillFromToMonth: (newFrom: string, newTo: string) => void;
};
