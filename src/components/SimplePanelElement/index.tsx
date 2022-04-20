import React from 'react';
// import Box from '../Box';

import { Container } from './styles';

interface IChildren {
  children: any;
}

const SimplePanelElement: React.FC<IChildren> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default SimplePanelElement;
