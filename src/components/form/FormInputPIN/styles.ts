import styled, { css } from 'styled-components';
import NumberFormat from 'react-number-format';

export const Input = styled(NumberFormat)`
  height: 38px;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;

  letter-spacing: 4px;
  text-align: center;

  font-size: 28px;
  font-weight: 700;
  &::placeholder {
    color: #999;
  }
  &:focus-within {
    border-color: #999;
  }

  &:hover {
    border-color: #aaa;
  }

  &.disabled {
    background: #e3e3e3;
    color: #333;
  }

  ${({ error }) =>
    error &&
    css`
      border-color: #ff3030;
      &:focus-within {
        border-color: #ff3030;
      }

      &:hover {
        border-color: #ff3030;
      }
      &::placeholder {
        color: #ff3030;
      }
    `}
`;

export const Error = styled.span`
  color: #ff3030;
  font-size: 13px;
  margin-top: 2px;
`;
