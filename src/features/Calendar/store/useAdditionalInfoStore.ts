import { create } from 'zustand';
import {
    AdditionalInfoState,
    PersonalInfo,
} from '../types/AdditionalInfoState';
import { ADDITIONAL_INFO_LOCAL_STORAGE_KEY } from '../constants';

export const useAdditionalInfoStore = create<AdditionalInfoState>(set => {
    const changeAdditionalInfo = (keyToChange: string, newValue: string) => {
        set(state => {
            const newState = { ...state, [keyToChange]: newValue };
            localStorage.setItem(
                ADDITIONAL_INFO_LOCAL_STORAGE_KEY,
                JSON.stringify(newState)
            );
            return newState;
        });
    };

    const setAdditionalInfo = (additionalInfo: PersonalInfo) => {
        set(state => ({ ...state, ...additionalInfo }));
    };

    return {
        firstName: '',
        lastName: '',
        personalNumber: '',
        changeAdditionalInfo,
        setAdditionalInfo,
    };
});
