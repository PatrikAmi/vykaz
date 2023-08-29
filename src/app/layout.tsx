import { Box, Container } from '@mui/material';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Výkaz práce',
    description: 'Výkaz práce',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <Box sx={{ backgroundColor: '#E6E8EE', py: 6 }}>
                    <Container>{children}</Container>
                </Box>
            </body>
        </html>
    );
}
