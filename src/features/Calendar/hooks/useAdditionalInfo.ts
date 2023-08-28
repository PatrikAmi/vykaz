import { ChangeEvent, useEffect } from 'react';
import { useAdditionalInfoStore } from '../store/useAdditionalInfoStore';
import { ADDITIONAL_INFO_LOCAL_STORAGE_KEY } from '../constants';

export const useAdditionalInfo = () => {
    const firstName = useAdditionalInfoStore(store => store.firstName);
    const lastName = useAdditionalInfoStore(store => store.lastName);
    const personalNumber = useAdditionalInfoStore(
        store => store.personalNumber
    );
    const changeAdditionalInfo = useAdditionalInfoStore(
        store => store.changeAdditionalInfo
    );
    const setAdditionalInfo = useAdditionalInfoStore(
        store => store.setAdditionalInfo
    );

    useEffect(() => {
        const additionalInfo = JSON.parse(
            localStorage.getItem(ADDITIONAL_INFO_LOCAL_STORAGE_KEY) || 'null'
        );

        if (additionalInfo) {
            setAdditionalInfo(additionalInfo);
        }
    }, [setAdditionalInfo]);

    const handleAdditionalInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        changeAdditionalInfo(e.target.name, e.target.value);
    };

    return {
        firstName,
        lastName,
        personalNumber,
        handleAdditionalInfoChange,
    };
};
