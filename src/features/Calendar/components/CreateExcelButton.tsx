'use client';

import { Box, Button } from '@mui/material';
import React from 'react';
import { useCreateExcelButton } from '../hooks/useCreateExcelButton';

type Props = {};

export const CreateExcelButton = (props: Props) => {
    const { handleCreateExcel } = useCreateExcelButton();

    return (
        <Box sx={{ textAlign: 'right' }}>
            <Button
                onClick={handleCreateExcel}
                variant='contained'
                sx={{
                    mt: 3,
                    backgroundColor: '#2c3e50',
                    '&:hover': {
                        backgroundColor: '#1E2B37',
                    },
                    py: 1,
                }}
            >
                Vytvor Excel
            </Button>
        </Box>
    );
};
