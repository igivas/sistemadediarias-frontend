import { extendTheme } from '@chakra-ui/react';

import { createBreakpoints } from '@chakra-ui/theme-tools';
// Let's say you want to add custom colors

const colors = {
  primary: {
    500: '#48b461',
  },
  green: {
    500: '#1a8d4c',
  },
  red: {
    500: '#E53E3E',
  },
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
});

const theme = extendTheme({ colors, breakpoints });

export default theme;
