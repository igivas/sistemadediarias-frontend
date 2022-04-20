import React, { HTMLAttributes } from 'react';

import { Container } from './styles';

const Row: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return <Container {...rest}>{children}</Container>;
};

export default Row;
