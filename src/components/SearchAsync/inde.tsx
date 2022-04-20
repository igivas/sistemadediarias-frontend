import { Input, InputProps } from '@chakra-ui/react';
import React from 'react';

type IProps = InputProps;

const SearchAsync: React.FC<IProps> = ({ ...rest }) => {
  return <Input {...rest} />;
};

export default SearchAsync;
