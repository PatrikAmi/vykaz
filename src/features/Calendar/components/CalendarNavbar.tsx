'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Typography } from '@mui/material';
import { MONTH_NAMES } from '../constants';
import { useCalendarNavbar } from '../hooks/useCalendarNavbar';

type Props = {};

export const CalendarNavbar = (props: Props) => {
    const { increaseSelectedMonth, decreaseSelectedMonth, month, year } =
        useCalendarNavbar();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pt: 3,
            }}
        >
            <Button
                variant='contained'
                sx={{
                    backgroundColor: '#2c3e50',
                    '&:hover': {
                        backgroundColor: '#1E2B37',
                    },
                    py: 1,
                }}
                onClick={decreaseSelectedMonth}
            >
                <ArrowBackIosNewIcon />
            </Button>
            <Typography
                variant='h3'
                sx={{ textAlign: 'center', width: '35%', px: 3 }}
            >
                {`${MONTH_NAMES[month]} ${year}`}
            </Typography>
            <Button
                variant='contained'
                sx={{
                    backgroundColor: '#2c3e50',
                    '&:hover': {
                        backgroundColor: '#1E2B37',
                    },
                    py: 1,
                }}
                onClick={increaseSelectedMonth}
            >
                <ArrowForwardIosIcon />
            </Button>
        </Box>
    );
};
