import React from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  AccordionProps,
} from '@chakra-ui/react';

interface IBoxProps extends AccordionProps {
  label: string;
}

const AccordionComponent: React.FC<IBoxProps> = ({
  label,
  children,
  ...rest
}) => {
  return (
    <Accordion allowToggle {...rest}>
      <AccordionItem border="0">
        <AccordionButton
          bg="gray.100"
          border="1px"
          borderColor="gray.300"
          borderTopLeftRadius="4px"
          borderTopRightRadius="4px"
        >
          <Box flex="1" textAlign="left">
            {label}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          p={4}
          border="1px"
          borderColor="gray.300"
          borderBottomLeftRadius="4px"
          borderBottomRightRadius="4px"
        >
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionComponent;
