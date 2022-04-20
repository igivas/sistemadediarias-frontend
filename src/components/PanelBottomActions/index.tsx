import React from 'react';

import { Container } from './styles';

const PanelBottomActions: React.FC = ({ children }) => {
  return <Container className="panel-bottom-actions">{children}</Container>;
};

export default PanelBottomActions;
