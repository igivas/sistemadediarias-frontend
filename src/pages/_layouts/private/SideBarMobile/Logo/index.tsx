import React from 'react';
import { HStack, Image, Text } from '@chakra-ui/react';
import { FaSuitcase } from 'react-icons/fa';
import LogoApp from '../../../../../assets/logo-app.png';

const Logo: React.FC = () => {
  return (
    <HStack spacing="24px">
      <Text
        fontSize="2xl"
        color="#14a64f"
        fontWeight="bold"
        textShadow="1px 1px #666"
      >
        {process.env.REACT_APP_SIGLA || 'SIGLA'}
      </Text>

      {/* <Image
        height="50px"
        src={LogoApp}
        alt="logo do sga, folha de papel com um a frente"
      /> */}
      <FaSuitcase fontSize="40px" color="#4b280a" />
    </HStack>
  );
};

export default Logo;
