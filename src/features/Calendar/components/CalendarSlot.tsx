'use client';

import { Box, TextField, Typography } from '@mui/material';
import { memo } from 'react';
import {
    FROM,
    HORIZONTAL_CALENDAR_SLOT_AMOUNT,
    INPUT_REGEX,
    TO,
} from '../constants';
import { useCalendarSlot } from '../hooks/useCalendarSlot';

type Props = {
    slotId: number;
    day: number;
    from: string;
    to: string;
    isSiblingMonth: boolean;
    addRightBorder?: boolean;
    addBottomBorder?: boolean;
};

const CalendarSlot = ({
    slotId,
    day,
    from,
    to,
    addRightBorder = false,
    addBottomBorder = false,
    isSiblingMonth,
}: Props) => {
    const { handleChange /*, fromError, toError*/ } = useCalendarSlot(slotId);

    return (
        <Box
            sx={{
                borderColor: '#ddd',
                borderStyle: 'solid',
                borderLeftWidth: '1px',
                borderTopWidth: '1px',
                borderRightWidth: addRightBorder ? '1px' : 0,
                borderBottomWidth: addBottomBorder ? '1px' : 0,
                width: `calc(100% / ${HORIZONTAL_CALENDAR_SLOT_AMOUNT})`,
                height: '15vh',
            }}
        >
            <Typography
                sx={{
                    p: 0.5,
                    textAlign: 'right',
                    color: isSiblingMonth ? '#bbb' : '#000',
                }}
            >
                {day}
            </Typography>
            {!isSiblingMonth && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 1,
                    }}
                >
                    <TextField
                        variant='standard'
                        label='Od'
                        onChange={e => handleChange(e, FROM)}
                        value={from}
                        /*error={fromError}
                        helperText={fromError ? 'Zle zadaný čas' : ''}*/
                        sx={{ pr: 1 }}
                    />
                    <TextField
                        variant='standard'
                        label='Do'
                        onChange={e => handleChange(e, TO)}
                        /*error={toError}
                        helperText={toError ? 'Zle zadaný čas' : ''}*/
                        value={to}
                    />
                </Box>
            )}
        </Box>
    );
};

export default memo(CalendarSlot); /*, (prevProps, nextProps) => {
    return (
        prevProps.fromToMonth[prevProps.slotId].from ===
            nextProps.fromToMonth[nextProps.slotId].from &&
        prevProps.fromToMonth[prevProps.slotId].to ===
            nextProps.fromToMonth[nextProps.slotId].to
    );
});*/
