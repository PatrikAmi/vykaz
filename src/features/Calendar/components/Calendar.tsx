import { Box, Paper } from '@mui/material';
import CalendarGrid from './CalendarGrid';
import { CalendarNavbar } from './CalendarNavbar';

type Props = {};

export const Calendar = (props: Props) => {
    return (
        <Box>
            <Paper square>
                <CalendarNavbar />
                <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap' }}>
                    <CalendarGrid />
                </Box>
            </Paper>
        </Box>
    );
};
