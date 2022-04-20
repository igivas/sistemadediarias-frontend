import { Flex } from '@chakra-ui/react';
import React from 'react';
// import Box from '../Box';

import { Container } from './styles';

interface IChildren {
  title?: string;
  children: any;
}

const SimplePanel: React.FC<IChildren> = ({ title, children }) => {
  return (
    <>
      <Container>
        {title && (
          <div style={{ marginBottom: '2rem' }}>
            <h4>
              <strong>{title}</strong>
            </h4>
          </div>
        )}
        <Flex justifyContent="space-around">{children}</Flex>
      </Container>
    </>
  );
};

export default SimplePanel;
