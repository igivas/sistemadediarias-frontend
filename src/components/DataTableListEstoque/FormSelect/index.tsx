import React, { ChangeEvent } from 'react';
import { Container } from './styles';

interface IOption {
  value: string;
  label: string;
}

interface ISelectProps {
  optionsSelect: IOption[];
  onChange?(event: ChangeEvent<HTMLSelectElement>): void;
  defaultValue?: string;
}

const Select: React.FC<ISelectProps> = ({
  optionsSelect,
  onChange,
  defaultValue,
}) => {
  return (
    <Container onChange={onChange} defaultValue={defaultValue}>
      {optionsSelect.map((currentOption) => {
        return (
          <option value={currentOption.value} key={currentOption.value}>
            {currentOption.label}
          </option>
        );
      })}
    </Container>
  );
};

export default Select;
