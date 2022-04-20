import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import {
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';
import { Error } from './styles';

interface ISelectProps extends ChakraSelectProps {
  name: string;
  options: { value: string | number; label: string }[];
  error?: FieldError;
}

const SelectCustom: ForwardRefRenderFunction<
  HTMLSelectElement,
  ISelectProps
> = ({ name, error = null, options = [], ...rest }, ref) => {
  return (
    <>
      <ChakraSelect
        id={name}
        name={name}
        focusBorderColor={error ? 'red.300' : '#999'}
        isInvalid={!!error}
        height="38px"
        bgColor="#fff"
        borderRadius="4px"
        borderColor="#ddd"
        errorBorderColor="red.300"
        _hover={{ borderColor: '#aaa' }}
        _disabled={{ bgColor: '#e3e3e3' }}
        ref={ref}
        {...rest}
      >
        {options.length > 0 &&
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </ChakraSelect>
      {error?.message && <Error>{error.message}</Error>}
    </>
  );
};

export const Select = forwardRef(SelectCustom);
