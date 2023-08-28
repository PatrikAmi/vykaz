export const numberToTime = (n: number): string => {
    const hours = Math.floor(n);
    const decimalPart = n - hours;
    const decimalPartConverted = Math.round(decimalPart * 60);
    const minutes = `${
        decimalPartConverted < 10 ? 0 : ''
    }${decimalPartConverted}`;

    return `${hours}:${minutes}`;
};
