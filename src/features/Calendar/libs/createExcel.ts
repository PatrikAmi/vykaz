import { CalendarDate } from 'calendar-base';
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';
import {
    MONTH_NAMES,
    POSSIBLE_INPUTS,
    SATURDAY,
    SUNDAY,
    TIMES_NEW_ROMAN,
} from '../constants';
import { FromTo } from '../types/FromTo';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';
import { numberToTime } from '../utils/numberToTime';
import { timeToNumber } from '../utils/timeToNumber';
import { STANDARD_WORK_HOURS, TIME_REGEX } from './../constants';

const removeBreakHours = (duration: number) => {
    return duration - Math.trunc((duration - 0.5) / 4) * 0.5; //Magic numbers to constants
};

const setGeneralProperties = (sheet: Worksheet) => {
    const column1 = sheet.getColumn(1);
    column1.width = 6;

    const column10 = sheet.getColumn(10);
    column10.width = 8;

    const column11 = sheet.getColumn(11);
    column11.width = 8;
};

/*const setCell = (
    sheet: Worksheet,
    cell: string,
    value: string,
    alignment: Partial<Alignment>,
    font: Partial<Font>
) => {};*/

const createTitles = (sheet: Worksheet) => {
    /*setCell(
        sheet,
        'f2',
        'Mestské kultúrne stredisko Dolný Kubín',
        {
            vertical: 'middle',
            horizontal: 'center',
        },
        { size: 14, name: TIMES_NEW_ROMAN }
    );*/

    const F2Cell = sheet.getCell('F2');
    F2Cell.value = 'Mestské kultúrne stredisko Dolný Kubín';
    F2Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F2Cell.font = { size: 14, name: TIMES_NEW_ROMAN };

    const F4Cell = sheet.getCell('F4');
    F4Cell.value = 'VÝKAZ ODPRACOVANÝCH HODÍN';
    F4Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F4Cell.font = { size: 14, bold: true, name: TIMES_NEW_ROMAN };
};

const createMonth = (sheet: Worksheet, month: number, year: number) => {
    const F6Cell = sheet.getCell('F6');
    F6Cell.value = `Mesiac: ${MONTH_NAMES[month]} ${year}`;
    F6Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F6Cell.font = { size: 10, bold: true, name: TIMES_NEW_ROMAN };
};

const createName = (sheet: Worksheet, firstName: string, lastName: string) => {
    const D8Cell = sheet.getCell('D8');
    D8Cell.value = 'Meno:';
    D8Cell.alignment = { vertical: 'middle', horizontal: 'right' };
    D8Cell.font = { name: TIMES_NEW_ROMAN };

    sheet.mergeCells('E8', 'G8');
    const E8cell = sheet.getCell('E8');
    E8cell.value = `${firstName} ${lastName}`;
    E8cell.alignment = { vertical: 'middle', horizontal: 'center' };
    E8cell.font = { size: 11, bold: true, name: TIMES_NEW_ROMAN };
};

const createHeader = (sheet: Worksheet) => {
    const row10 = sheet.getRow(10);
    row10.height = 40;
    row10.alignment = { wrapText: true, horizontal: 'center', vertical: 'top' };
    row10.font = { size: 12, name: TIMES_NEW_ROMAN };
    row10.values = [
        'Deň',
        'Príchod',
        'Odchod',
        'Čerpanie NV',
        '',
        '',
        'Nadčas',
        '',
        '',
        'Spolu Odprac.',
        'Z toho zaplatiť',
    ];

    row10.eachCell((cell, columnNumber) => {
        if ([1, 2, 3, 4, 10, 11].includes(columnNumber)) {
            cell.border = {
                top: { style: 'thick' },
                right: { style: 'thick' },
                left: { style: 'thick' },
            };
        }

        if (columnNumber >= 5 && columnNumber <= 9) {
            cell.border = {
                top: { style: 'thick' },
                bottom: { style: 'thick' },
            };
        }
    });

    const row11 = sheet.getRow(11);
    row11.alignment = { wrapText: true, horizontal: 'center', vertical: 'top' };
    row11.font = { size: 12, name: TIMES_NEW_ROMAN };
    row11.values = [
        '',
        '',
        '',
        'Hod.',
        'OD',
        'DO',
        'NV',
        'Zapl.',
        'DV,SVPAR.',
        'Hod.',
        'Hod.',
    ];

    row11.eachCell(cell => {
        cell.border = {
            left: { style: 'thick' },
            bottom: { style: 'thick' },
            right: { style: 'thick' },
        };
    });
};

export const createExcel = async (
    fromToMonth: FromTo[],
    selectedMonth: CalendarDate[],
    firstName: string,
    lastName: string,
    personalNumber: string
) => {
    const { month, year } = getSelectedMonthYear(selectedMonth);
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Výkaz práce');

    setGeneralProperties(sheet);
    createTitles(sheet);
    createMonth(sheet, month, year);
    createName(sheet, firstName, lastName);
    createHeader(sheet);

    let dataRowNumber: number = 12;
    const toSubtract: number = 11;

    fromToMonth.forEach(({ from, to }, i) => {
        if (!selectedMonth[i].siblingMonth) {
            const dataRow = sheet.getRow(dataRowNumber);
            dataRow.alignment = {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center',
            };
            dataRow.font = { size: 12, name: TIMES_NEW_ROMAN };

            const dayValue = dataRowNumber - toSubtract;
            let fromValue = '';
            let toValue = '';
            let overtimeUseValue: number | '' = '';
            let fromOvertimeValue = '';
            let toOvertimeValue = '';
            let overTimeGainValue: number | '' = '';
            let toBePaidOvertimeValue: number | '' = '';
            let customValue: number | '' = '';
            let workHoursValue: number | '' = '';
            let toBePaidValue: number | '' = '';

            let workHours = 0;
            let isHoliday =
                from.toUpperCase() === POSSIBLE_INPUTS.HOLIDAY ||
                to.toUpperCase() === POSSIBLE_INPUTS.HOLIDAY;
            let isTimeOff =
                from.toUpperCase() === POSSIBLE_INPUTS.TIME_OFF ||
                to.toUpperCase() === POSSIBLE_INPUTS.TIME_OFF;
            let isCustom =
                from.toUpperCase() === POSSIBLE_INPUTS.CUSTOM ||
                to.toUpperCase() === POSSIBLE_INPUTS.CUSTOM;
            const isWeekend =
                selectedMonth[i].weekDay === SATURDAY ||
                selectedMonth[i].weekDay === SUNDAY;

            if (TIME_REGEX.test(from) && TIME_REGEX.test(to)) {
                const fromNumber = timeToNumber(from);
                const toNumber = timeToNumber(to);
                fromValue = from;
                toValue = to;

                if (toNumber > fromNumber) {
                    workHours = toNumber - fromNumber;
                }

                workHoursValue = removeBreakHours(workHours);

                if (workHours > STANDARD_WORK_HOURS) {
                    toValue = numberToTime(
                        timeToNumber(from) + STANDARD_WORK_HOURS
                    );
                    fromOvertimeValue = toValue;
                    toOvertimeValue = to;

                    if (isWeekend) {
                        toBePaidOvertimeValue =
                            workHoursValue - (STANDARD_WORK_HOURS - 0.5);
                    } else {
                        overTimeGainValue =
                            workHoursValue - (STANDARD_WORK_HOURS - 0.5);
                    }
                }

                if (isWeekend) {
                    toBePaidOvertimeValue = Math.min(
                        workHoursValue,
                        STANDARD_WORK_HOURS - 0.5
                    );
                    fromOvertimeValue = from;
                    toOvertimeValue = to;
                    fromValue = '';
                    toValue = '';
                } else {
                    toBePaidValue = Math.min(
                        workHoursValue,
                        STANDARD_WORK_HOURS - 0.5
                    );
                }
            }

            if (isTimeOff) {
                fromValue = POSSIBLE_INPUTS.TIME_OFF;
                overtimeUseValue = STANDARD_WORK_HOURS - 0.5;
                workHoursValue = overtimeUseValue;
                toBePaidValue = overtimeUseValue;
            }

            if (isCustom) {
                fromValue = POSSIBLE_INPUTS.CUSTOM;
                customValue = STANDARD_WORK_HOURS - 0.5;
                workHoursValue = 0;
                toBePaidValue = customValue;
            }

            dataRow.values = [
                dayValue,
                fromValue,
                toValue,
                overtimeUseValue,
                fromOvertimeValue,
                toOvertimeValue,
                overTimeGainValue,
                toBePaidOvertimeValue,
                customValue,
                workHoursValue,
                toBePaidValue,
            ];

            dataRow.eachCell((cell, cellNumber) => {
                cell.border = {
                    top: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                };

                if (cellNumber !== 1) {
                    cell.numFmt = '0.00';
                }

                if (cellNumber === 1) {
                    cell.border.left = { style: 'thick' };

                    if (isWeekend) {
                        cell.font = { bold: true, name: TIMES_NEW_ROMAN };
                    }
                }

                if (cellNumber === 11) {
                    cell.border.right = { style: 'thick' };
                }
            });

            dataRowNumber++;
        }
    });

    const data = await workbook.xlsx.writeBuffer();
    var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'VykazPrace.xlsx');
};
