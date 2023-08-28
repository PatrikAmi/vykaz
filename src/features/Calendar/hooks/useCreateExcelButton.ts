import { createExcel } from '../libs/createExcel';
import { useAdditionalInfoStore } from '../store/useAdditionalInfoStore';
import { useCalendarMonthStore } from '../store/useCalendarMonthStore';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';

export const useCreateExcelButton = () => {
    const fromToMonth = useCalendarMonthStore(store => store.fromToMonth);
    const selectedMonth = useCalendarMonthStore(
        store => store.selectedCalendarMonth
    );
    const firstName = useAdditionalInfoStore(store => store.firstName);
    const lastName = useAdditionalInfoStore(store => store.lastName);
    const personalNumber = useAdditionalInfoStore(
        store => store.personalNumber
    );

    const { month, year } = getSelectedMonthYear(selectedMonth!);

    const handleCreateExcel = () => {
        createExcel(
            fromToMonth,
            selectedMonth!,
            firstName,
            lastName,
            personalNumber
        );
    };

    return { handleCreateExcel };
};
