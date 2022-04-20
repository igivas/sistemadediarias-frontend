import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ITituloLabelStep {
  title: string;
}

const TituloLabelStep: React.FC<ITituloLabelStep> = ({ title, children }) => {
  return (
    <Box pl={{ sm: '0px', lg: '4px' }} mb="2px">
      <Text
        color="#2e2b2b"
        fontWeight="600"
        fontSize={{ sm: '.9rem', lg: '1.05rem' }}
      >
        {title} {children}
      </Text>
    </Box>
  );
};
export default TituloLabelStep;
