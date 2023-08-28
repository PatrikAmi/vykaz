'use client';

import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { useOptions } from '../hooks/useOptions';

type Props = {};

export const Options = (props: Props) => {
    const {
        newFromValue,
        newToValue,
        handleOptionsChange,
        handleFillButtonClick,
    } = useOptions();

    return (
        <Paper square sx={{ p: 3 }}>
            <Typography variant='h4' sx={{ textAlign: 'center', pb: 2 }}>
                Možnosti
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    name='newFromValue'
                    label='Hodnota od'
                    variant='standard'
                    value={newFromValue}
                    onChange={handleOptionsChange}
                    sx={{ pr: 3 }}
                />
                <TextField
                    name='newToValue'
                    label='Hodnota do'
                    variant='standard'
                    value={newToValue}
                    onChange={handleOptionsChange}
                    sx={{ pr: 3 }}
                />

                <Button
                    variant='contained'
                    onClick={handleFillButtonClick}
                    sx={{
                        backgroundColor: '#2c3e50',
                        '&:hover': {
                            backgroundColor: '#1E2B37',
                        },
                        py: 1,
                        mt: 1,
                    }}
                >
                    Naplň
                </Button>
            </Box>
        </Paper>
    );
};
