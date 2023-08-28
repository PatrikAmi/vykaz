export type OptionsState = {
    newFromValue: string;
    newToValue: string;
    changeOptions: (keyToChange: string, newValue: string) => void;
};
