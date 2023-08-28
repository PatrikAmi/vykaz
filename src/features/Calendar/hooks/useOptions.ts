import { ChangeEvent } from 'react';
import { useOptionsStore } from '../store/useOptionsStore';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';

export const useOptions = () => {
    const newFromValue = useOptionsStore(store => store.newFromValue);
    const newToValue = useOptionsStore(store => store.newToValue);
    const changeOptions = useOptionsStore(store => store.changeOptions);
    const fillFromToMonth = useCalendarMonthStore(
        store => store.fillFromToMonth
    );

    const handleOptionsChange = (e: ChangeEvent<HTMLInputElement>) => {
        changeOptions(e.target.name, e.target.value);
    };

    const handleFillButtonClick = () => {
        fillFromToMonth(newFromValue, newToValue);
    };

    return {
        newFromValue,
        newToValue,
        handleOptionsChange,
        handleFillButtonClick,
    };
};
