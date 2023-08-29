import { Box, Typography } from '@mui/material';
import React from 'react';
import {
    Calendar,
    AdditionalInfo,
    Options,
    CreateExcelButton,
} from '../features/Calendar';

type Props = {};

export const Home = (props: Props) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    pb: 3,
                }}
            >
                <AdditionalInfo />
                <Options />
            </Box>
            <Calendar />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h5' sx={{ mt: 3 }}>
                    Alpha v0.1.8
                </Typography>
                <CreateExcelButton />
            </Box>
        </>
    );
};
