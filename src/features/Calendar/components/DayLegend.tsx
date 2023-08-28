import { Box } from '@mui/material';
import React from 'react';
import { HORIZONTAL_CALENDAR_SLOT_AMOUNT } from '../constants';

type Props = {
    dayName: string;
    addRightBorder?: boolean;
};

const DayLegend = ({ dayName, addRightBorder = false }: Props) => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                borderColor: '#ddd',
                borderStyle: 'solid',
                borderLeftWidth: '1px',
                borderTopWidth: '1px',
                borderRightWidth: addRightBorder ? '1px' : 0,
                borderBottomWidth: 0,
                width: `calc(100% / ${HORIZONTAL_CALENDAR_SLOT_AMOUNT})`,
                py: 0.25,
            }}
        >
            {dayName}
        </Box>
    );
};

export default DayLegend;
