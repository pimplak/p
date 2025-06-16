import { createTheme, type MantineColorsTuple } from '@mantine/core';

const psychFlowBlue: MantineColorsTuple = [
    '#e7f5ff',
    '#d0ebff',
    '#a5d8ff',
    '#74c0fc',
    '#4dabf7',
    '#339af0',
    '#228be6',
    '#1c7ed6',
    '#1971c2',
    '#1864ab'
];

const psychFlowTeal: MantineColorsTuple = [
    '#e6fcf5',
    '#c3fae8',
    '#96f2d7',
    '#63e6be',
    '#38d9a9',
    '#20c997',
    '#12b886',
    '#0ca678',
    '#099268',
    '#087f5b'
];

export const theme = createTheme({
    primaryColor: 'psychFlowBlue',
    colors: {
        psychFlowBlue,
        psychFlowTeal,
    },
    defaultRadius: 'md',

    components: {
        Button: {
            defaultProps: {
                variant: 'filled',
            },
        },
        Card: {
            defaultProps: {
                shadow: 'sm',
                withBorder: true,
            },
        },
        Table: {
            defaultProps: {
                striped: true,
                highlightOnHover: true,
            },
        },
        Modal: {
            defaultProps: {
                centered: true,
                overlayProps: { opacity: 0.55, blur: 3 },
            },
        },
    },
}); 