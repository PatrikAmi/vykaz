export type PersonalInfo = {
    firstName: string;
    lastName: string;
    personalNumber: string;
};

export type AdditionalInfoState = PersonalInfo & {
    changeAdditionalInfo: (keyToChange: string, newValue: string) => void;
    setAdditionalInfo: (additionalInfo: PersonalInfo) => void;
};
