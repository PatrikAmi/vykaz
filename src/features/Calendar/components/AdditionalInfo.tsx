'use client';

import { Box, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { useAdditionalInfo } from '../hooks/useAdditionalInfo';

type Props = {};

export const AdditionalInfo = (props: Props) => {
    const { firstName, lastName, personalNumber, handleAdditionalInfoChange } =
        useAdditionalInfo();

    return (
        <Paper square sx={{ p: 3, mr: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ textAlign: 'center', pb: 2 }}>
                    Doplňujúce informácie
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <TextField
                        name='firstName'
                        variant='standard'
                        label='Meno'
                        value={firstName}
                        onChange={handleAdditionalInfoChange}
                        sx={{ pr: 3 }}
                    />
                    <TextField
                        name='lastName'
                        variant='standard'
                        label='Priezvisko'
                        value={lastName}
                        onChange={handleAdditionalInfoChange}
                        sx={{ pr: 3 }}
                    />
                    <TextField
                        name='personalNumber'
                        variant='standard'
                        label='Osobné číslo'
                        value={personalNumber}
                        onChange={handleAdditionalInfoChange}
                    />
                </Box>
            </Box>
        </Paper>
    );
};
