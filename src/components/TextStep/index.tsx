import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const TextStep: React.FC = ({ children }) => {
  return (
    <Box pl={{ sm: '0px', lg: '8px' }}>
      <Text
        color="#666"
        fontWeight="400"
        fontSize={{ sm: '.8rem', lg: '1.03rem' }}
      >
        {children}
      </Text>
    </Box>
  );
};
export default TextStep;
