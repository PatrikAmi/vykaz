export const timeToNumber = (time: string): number => {
    const timeSplit = time.split(':');

    return +timeSplit[0] + +timeSplit[1] / 60;
};
