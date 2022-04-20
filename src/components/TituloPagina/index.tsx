import { Box, Text } from '@chakra-ui/react';
import React from 'react';

interface ITituloProps {
  title: string;
}

const TituloPagina: React.FC<ITituloProps> = ({ title }) => {
  return (
    <Box pl={{ sm: '0px', lg: '8px' }} mb="8px">
      <Text
        color="#666"
        fontWeight="600"
        fontSize={{ sm: '1rem', lg: '1.3rem' }}
      >
        {title}
      </Text>
    </Box>
  );
};

export default TituloPagina;
