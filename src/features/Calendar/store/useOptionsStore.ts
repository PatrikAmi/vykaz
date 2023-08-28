import { create } from 'zustand';
import { OptionsState } from '../types/OptionsState';

export const useOptionsStore = create<OptionsState>(set => {
    const changeOptions = (keyToChange: string, newValue: string) => {
        set(state => ({ ...state, [keyToChange]: newValue }));
    };

    return {
        newFromValue: '',
        newToValue: '',
        changeOptions,
    };
});
