import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { FromTo } from '../types/FromTo';
import { CalendarDate } from 'calendar-base';
import { getSelectedMonthYear } from '../utils/getSelectedMonthYear';
import { MONTH_NAMES, SATURDAY, SUNDAY } from '../constants';
import { timeToNumber } from '../utils/timeToNumber';
import { numberToTime } from '../utils/numberToTime';

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

    /*sheet.addRow({});
    sheet.columns = [
        {},
        {},
        {},
        {},
        {},
        {
            key: 'MestskeKulturneStrediskoDolnyKubin',
            header: 'Mestské kultúrne stredisko Dolný Kubín',
            alignment: { vertical: 'middle', horizontal: 'center' },
        },
    ];*/

    /*USE SOMETHING LIKE THIS
    fromToMonth.forEach(function(item, index) {
        worksheet.addRow({
            idClient: item.idClient,
            name: item.name,
            tel: item.tel,
            adresse: item.adresse
        })
    }) idClient, name etc. are headers of columns, in my case "od", "do", "Nadčas" etc.
    */

    /*sheet.mergeCells('D2', 'H2');
    const D2Cell = sheet.getCell('D2');*/
    const F2Cell = sheet.getCell('F2');
    F2Cell.value = 'Mestské kultúrne stredisko Dolný Kubín';
    F2Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F2Cell.font = { size: 14 };

    const F4Cell = sheet.getCell('F4');
    F4Cell.value = 'VÝKAZ ODPRACOVANÝCH HODÍN';
    F4Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F4Cell.font = { size: 14, bold: true };

    const F6Cell = sheet.getCell('F6');
    F6Cell.value = `Mesiac: ${MONTH_NAMES[month]} ${year}`;
    F6Cell.alignment = { vertical: 'middle', horizontal: 'center' };
    F6Cell.font = { size: 10, bold: true };

    const D8Cell = sheet.getCell('D8');
    D8Cell.value = 'Meno:';
    D8Cell.alignment = { vertical: 'middle', horizontal: 'right' };

    sheet.mergeCells('E8', 'G8');
    const E8cell = sheet.getCell('E8');
    E8cell.value = `${firstName} ${lastName}`;
    E8cell.alignment = { vertical: 'middle', horizontal: 'center' };
    E8cell.font = { size: 11, bold: true };

    /*sheet.columns = [
        { key: 'den', header: 'Deň' },
        { key: 'prichod', header: 'Príchod' },
        { key: 'odchod', header: 'Odchod' },
        { key: 'cerpanieNv', header: 'Čerpanie NV' },
        {},
        {},
        { key: 'nadcas', header: 'Nadčas' },
        {},
        {},
        { key: 'spoluOdprac', header: 'Spolu Odprac.' },
        { key: 'zTohoZaplatit', header: 'Z toho zaplatiť' },
    ];*/

    const row10 = sheet.getRow(10);
    row10.height = 40;
    row10.alignment = { wrapText: true, horizontal: 'center', vertical: 'top' };
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

            let workHours = '';

            if (from && to) {
                const fromNumber = timeToNumber(from);
                const toNumber = timeToNumber(to);
                workHours = numberToTime(toNumber - fromNumber);
            }

            dataRow.values = [
                dataRowNumber - toSubtract,
                from,
                to,
                '',
                '',
                '',
                '',
                '',
                '',
                workHours,
                workHours,
            ];

            dataRow.eachCell((cell, cellNumber) => {
                if (cellNumber === 1) {
                    cell.border = { left: { style: 'thick' } };

                    if (
                        selectedMonth[i].weekDay === SATURDAY ||
                        selectedMonth[i].weekDay === SUNDAY
                    ) {
                        cell.font = { bold: true };
                    }
                }

                if (cellNumber === 11) {
                    cell.border = { right: { style: 'thick' } };
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
