import React from 'react';

import { PinInput, HStack, PinInputProps } from '@chakra-ui/react';

interface IProps {
  pinInputProps?: PinInputProps;
}

const AccordionComponent: React.FC<PinInputProps> = (props) => {
  return (
    <HStack>
      <PinInput {...props} />
    </HStack>
  );
};

export default AccordionComponent;
