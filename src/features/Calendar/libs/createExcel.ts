import { CalendarDate } from 'calendar-base';
import { BorderStyle, Workbook, Worksheet } from 'exceljs';
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

    let saturdayHours = 0;
    let sundayHours = 0;
    let nightHours = 0;
    let additionalHoursTogether = 0;

    let rowToUse: number = 12;
    const toSubtract: number = 11;

    fromToMonth.forEach(({ from, to }, i) => {
        if (!selectedMonth[i].siblingMonth) {
            const dataRow = sheet.getRow(rowToUse);
            dataRow.alignment = {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center',
            };
            dataRow.font = { size: 12, name: TIMES_NEW_ROMAN };

            const dayValue = rowToUse - toSubtract;
            let fromValue = '';
            let toValue = '';
            let overtimeUseValue: number | '' = '';
            let fromOvertimeValue = '';
            let toOvertimeValue = '';
            let overtimeGainValue: number | '' = '';
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
                let nightHoursToAdd = 0;

                if (toNumber > fromNumber) {
                    workHours = toNumber - fromNumber;

                    if (toNumber > 22) {
                        //Od 22:00 je nocna
                        nightHoursToAdd = toNumber - Math.max(22, fromNumber);
                        nightHours += nightHoursToAdd;
                    }

                    if (fromNumber < 6) {
                        //do 6:00 je nocna
                        nightHoursToAdd = Math.min(6, toNumber) - fromNumber;
                        nightHours += nightHoursToAdd;
                    }
                }

                fromValue = from;
                toValue = to;
                workHoursValue = removeBreakHours(workHours);

                if (selectedMonth[i].weekDay === SATURDAY) {
                    saturdayHours += workHoursValue;
                }

                if (selectedMonth[i].weekDay === SUNDAY) {
                    sundayHours += workHoursValue;
                }

                if (workHours > STANDARD_WORK_HOURS) {
                    toValue = numberToTime(
                        timeToNumber(from) + STANDARD_WORK_HOURS
                    );
                    fromOvertimeValue = toValue;
                    toOvertimeValue = to;

                    if (!isWeekend) {
                        overtimeGainValue =
                            workHoursValue -
                            (STANDARD_WORK_HOURS - 0.5) -
                            nightHoursToAdd;
                    }
                }

                if (isWeekend) {
                    toBePaidOvertimeValue = workHoursValue;
                    additionalHoursTogether += workHoursValue;
                    fromOvertimeValue = from;
                    toOvertimeValue = to;
                    fromValue = '';
                    toValue = '';
                } else {
                    //subtracting night hours because I'm adding them to overtime pay instead
                    toBePaidValue =
                        Math.min(workHoursValue, STANDARD_WORK_HOURS - 0.5) -
                        nightHoursToAdd;

                    additionalHoursTogether += nightHoursToAdd;

                    if (nightHoursToAdd !== 0) {
                        toBePaidOvertimeValue = nightHoursToAdd;
                    }
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
                overtimeGainValue,
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

            rowToUse++;
        }
    });

    const sumRow = sheet.getRow(rowToUse);
    sumRow.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
    };
    sumRow.font = { size: 12, name: TIMES_NEW_ROMAN };
    sumRow.values = Array(11).fill('');

    sumRow.eachCell((cell, i) => {
        cell.border = {
            top: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
        };

        if ([4, 7, 8, 9, 10, 11].includes(i)) {
            cell.numFmt = '0.00';
            const letter = String.fromCharCode(i + 64);
            cell.value = {
                formula: `SUM(${letter}12:${letter}${rowToUse - 1})`,
                date1904: false,
            };
        }

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if (i === 11) {
            cell.border.right = { style: 'thick' };
        }
    });

    const lastRow = sheet.getRow(rowToUse + 1);
    lastRow.alignment = { horizontal: 'center' };
    lastRow.font = { size: 10 };
    lastRow.height = 40;
    lastRow.values = Array(11).fill('');

    lastRow.eachCell((cell, i) => {
        cell.border = {
            top: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thick' },
            left: { style: 'thin' },
        };

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if (i === 11) {
            cell.border.right = { style: 'thick' };
        }
    });

    rowToUse++;

    sheet.mergeCells(`A${rowToUse}`, `B${rowToUse}`);
    sheet.getCell(`A${rowToUse}`).value = 'V Dolnom Kubíne:';

    sheet.mergeCells(`C${rowToUse}`, `D${rowToUse}`);
    sheet.getCell(`C${rowToUse}`).value = `${month + 1}/28/${year}`;

    rowToUse += 2;

    sheet.mergeCells(`A${rowToUse}`, `C${rowToUse}`);
    const workerCell = sheet.getCell(`A${rowToUse}`);
    workerCell.font = { size: 10 };
    workerCell.value = ' Pracovník:........................';

    const directorCell = sheet.getCell(`J${rowToUse}`);
    directorCell.font = { size: 10 };
    directorCell.alignment = { horizontal: 'center' };
    directorCell.value = 'Riaditeľka MsKS';

    rowToUse += 2;

    const titleRow = sheet.getRow(rowToUse);
    titleRow.height = 30;

    const titleCell = sheet.getCell(`F${rowToUse}`);
    titleCell.font = { size: 14, name: 'Times New Roman' };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.value = 'Mestské kultúrne stredisko Dolný Kubín';

    const personalNumberCell1 = sheet.getCell(`J${rowToUse}`);
    const personalNumberCell2 = sheet.getCell(`K${rowToUse}`);
    const thickBorder = {
        top: { style: 'thick' as BorderStyle },
        right: { style: 'thick' as BorderStyle },
        bottom: { style: 'thick' as BorderStyle },
        left: { style: 'thick' as BorderStyle },
    };
    personalNumberCell1.border = thickBorder;
    personalNumberCell2.border = thickBorder;
    personalNumberCell1.alignment = { horizontal: 'center' };
    personalNumberCell2.alignment = { horizontal: 'center' };
    personalNumberCell1.font = { bold: true, size: 10 };
    personalNumberCell2.font = { bold: true, size: 18 };
    personalNumberCell1.value = 'OS.Č.';
    personalNumberCell2.value = `${personalNumber}`;

    rowToUse += 2;

    const vykazTitleCell = sheet.getCell(`F${rowToUse}`);
    vykazTitleCell.alignment = { horizontal: 'center' };
    vykazTitleCell.font = { size: 14, bold: true, name: 'Times New Roman' };
    vykazTitleCell.value = `VÝKAZ PRÁCE za ${MONTH_NAMES[month]} ${year}`;

    rowToUse += 2;

    for (let i = 0; i < 10; i++) {
        const row = sheet.getRow(rowToUse + i);
        row.font = { size: 12, name: 'Times New Roman' };
    }

    sheet.getRow(rowToUse).font.bold = true;

    sheet.mergeCells(`A${rowToUse}`, `B${rowToUse}`);
    const nameTitleCell = sheet.getCell(`A${rowToUse}`);
    nameTitleCell.value = 'Meno: ';
    nameTitleCell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
    };

    sheet.mergeCells(`C${rowToUse}`, `E${rowToUse}`);
    const nameCell = sheet.getCell(`C${rowToUse}`);
    nameCell.alignment = { horizontal: 'center' };
    nameCell.value = `${firstName} ${lastName}`;
    nameCell.border = {
        top: { style: 'thick' },
        right: { style: 'thick' },
    };

    sheet.mergeCells(`F${rowToUse}`, `K${rowToUse}`);
    const recapitulationCell = sheet.getCell(`F${rowToUse}`);
    recapitulationCell.alignment = { horizontal: 'center' };
    recapitulationCell.value = 'Rekapitulácia';
    recapitulationCell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        right: { style: 'thick' },
    };

    rowToUse++;

    sheet.getCell(`A${rowToUse}`).border = {
        bottom: { style: 'thick' },
        left: { style: 'thick' },
    };
    sheet.getCell(`E${rowToUse}`).border = {
        right: { style: 'thick' },
        bottom: { style: 'thick' },
    };
    sheet.getCell(`K${rowToUse}`).border = {
        right: { style: 'thick' },
        bottom: { style: 'thick' },
    };

    rowToUse++;

    const priplatkyRow = sheet.getRow(rowToUse);
    priplatkyRow.values = [
        '',
        '',
        'PRÍPLATKY',
        '',
        '',
        'Odprac. celkom:',
        '',
        `TODO`,
        'dní',
        `TODO`,
        'hod.',
    ];
    sheet.mergeCells(`F${rowToUse}`, `G${rowToUse}`);
    priplatkyRow.eachCell((cell, i) => {
        cell.border = {
            top: { style: 'thick' },
            bottom: { style: 'thick' },
        };

        if (i === 1) {
            cell.border = {
                top: { style: 'thick' },
                left: { style: 'thick' },
                bottom: { style: 'thick' },
            };
        }

        if ([5, 11].includes(i)) {
            cell.border = {
                top: { style: 'thick' },
                bottom: { style: 'thick' },
                right: { style: 'thick' },
            };
        }

        if ([3, 8, 10].includes(i)) {
            cell.alignment = { horizontal: 'right' };
        }
    });

    sheet.mergeCells(`B${rowToUse}`, `D${rowToUse}`);
    const priplatkyCell = sheet.getCell(`B${rowToUse}`);
    priplatkyCell.value = 'PRÍPLATKY';
    priplatkyCell.font = {
        size: 12,
        name: 'Times New Roman',
        bold: true,
    };
    priplatkyCell.alignment = { horizontal: 'center' };

    const cellFiller = [
        [
            'Sviatok:',
            '',
            'TODO',
            'hod.',
            '',
            'Dovolenka:',
            '',
            'TODO',
            'dní',
            'TODO',
            'hod.',
        ],
        [
            'Sobota:',
            '',
            saturdayHours,
            'hod.',
            '',
            'Sviatky:',
            '',
            'TODO',
            'dní',
            'TODO',
            'hod.',
        ],
        [
            'Nedeľa:',
            '',
            sundayHours,
            'hod.',
            '',
            'PN:',
            '',
            'TODO',
            'dní',
            'TODO',
            'hod.',
        ],
        [
            'Nočné:',
            '',
            nightHours,
            'hod.',
            '',
            'Paragraf vlastný:',
            '',
            'TODO',
            'dní',
            'TODO',
            'hod.',
        ],
        [
            'Nadčas:',
            '',
            additionalHoursTogether,
            'hod.',
            '',
            'Paragraf doprovod:',
            '',
            'TODO',
            'dní',
            'TODO',
            'hod.',
        ],
    ];

    cellFiller.forEach(rowData => {
        rowToUse++;
        const row = sheet.getRow(rowToUse);
        row.values = rowData;
        sheet.mergeCells(`A${rowToUse}`, `B${rowToUse}`);
        sheet.mergeCells(`F${rowToUse}`, `G${rowToUse}`);

        row.eachCell((cell, i) => {
            cell.border = { bottom: { style: 'thin' } };

            if ([3, 8, 10].includes(i)) {
                cell.alignment = { horizontal: 'right' };
            }
        });
    });

    for (let i = 0; i < 5; i++) {
        sheet.getCell(`A${55 + i}`).border = {
            bottom: { style: 'thin' },
            left: { style: 'thick' },
        };

        sheet.getCell(`E${55 + i}`).border = {
            right: { style: 'thick' },
            bottom: { style: 'thin' },
        };

        sheet.getCell(`K${55 + i}`).border = {
            right: { style: 'thick' },
            bottom: { style: 'thin' },
        };
    }

    rowToUse++;

    const emptyRow = sheet.getRow(rowToUse);
    emptyRow.values = Array(11).fill('');

    emptyRow.eachCell((cell, i) => {
        if (i === 1) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thick' },
                bottom: { style: 'thick' },
            };
        }

        if ([5, 11].includes(i)) {
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thick' },
                right: { style: 'thick' },
            };
        }
    });

    rowToUse++;

    const togetherRow = sheet.getRow(rowToUse);
    togetherRow.values = [
        'SPOLU',
        '',
        additionalHoursTogether,
        'hod.',
        '',
        'Povinnosť:',
        '',
        'TODO',
        'dní',
        'TODO',
        'hod.',
    ];
    sheet.mergeCells(`A${rowToUse}`, `B${rowToUse}`);
    sheet.mergeCells(`F${rowToUse}`, `G${rowToUse}`);

    togetherRow.eachCell((cell, i) => {
        cell.border = { top: { style: 'thick' }, bottom: { style: 'thick' } };

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if ([5, 11].includes(i)) {
            cell.border.right = { style: 'thick' };
        }

        if ([3, 8, 10].includes(i)) {
            cell.alignment = { horizontal: 'right' };
        }
    });

    rowToUse += 4;

    const wageCalcTitleRow = sheet.getRow(rowToUse);
    wageCalcTitleRow.alignment = { horizontal: 'center' };
    wageCalcTitleRow.font = { bold: true, size: 12, name: 'Times New Roman' };
    wageCalcTitleRow.values = [
        ...Array(4).fill(''),
        'V Ý P O Č E T  M Z D Y',
        ...Array(6).fill(''),
    ];
    sheet.mergeCells(`E${rowToUse}`, `G${rowToUse}`);

    wageCalcTitleRow.eachCell((cell, i) => {
        cell.border = { top: { style: 'thick' }, bottom: { style: 'thick' } };

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if (i === 11) {
            cell.border.right = { style: 'thick' };
        }
    });

    for (let i = 0; i < 13; i++) {
        rowToUse++;
        const row = sheet.getRow(rowToUse);
        row.values = Array(11).fill('');
        row.height = 25;

        row.eachCell((cell, i) => {
            cell.border = {
                bottom: { style: 'thin' },
            };

            if (i === 1) {
                cell.border.left = { style: 'thick' };
            }

            if (i === 11) {
                cell.border.right = { style: 'thick' };
            }
        });
    }

    rowToUse++;

    const calculatedRow = sheet.getRow(rowToUse);
    calculatedRow.values = Array(11).fill('');
    calculatedRow.font = { size: 12, name: 'Times New Roman' };

    calculatedRow.eachCell((cell, i) => {
        cell.border = {
            top: { style: 'thick' },
        };

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if ([5, 11].includes(i)) {
            cell.border.right = { style: 'thick' };
        }
    });

    sheet.mergeCells(`A${rowToUse}`, `B${rowToUse}`);
    const calculatedCell = sheet.getCell(`A${rowToUse}`);
    calculatedCell.value = 'Vypočítal:';

    sheet.getCell(`F${rowToUse}`).value = 'Dňa:';

    rowToUse++;

    const endRow = sheet.getRow(rowToUse);
    endRow.values = Array(11).fill('');

    endRow.eachCell((cell, i) => {
        cell.border = {
            bottom: { style: 'thick' },
        };

        if (i === 1) {
            cell.border.left = { style: 'thick' };
        }

        if ([5, 11].includes(i)) {
            cell.border.right = { style: 'thick' };
        }
    });

    const data = await workbook.xlsx.writeBuffer();
    var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'VykazPrace.xlsx');
};
