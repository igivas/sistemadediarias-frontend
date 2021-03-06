import styled from 'styled-components';
import { darken } from 'polished';

export const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: none;
  border-radius: 4px;
  background: #fff;
  height: 38px;
  min-width: 144px;
  font-weight: 500;
  cursor: pointer;
  padding: 0px 12px 0px 12px;

  > span {
    width: 100%;
    text-align: center;
  }

  &.button.yellow {
    background: #ffbe38;

    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#ffbe38')};
    }

    &:active {
      background: ${darken(0.2, '#ffbe38')};
    }
  }

  &.button.blue {
    background: #5ac4d0;
    color: #fff;

    svg {
      color: #fff;
    }
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#5AC4D0')};
    }

    &:active {
      background: ${darken(0.2, '#5AC4D0')};
    }
  }

  &.button.green {
    background: #48b461;

    color: #fff;

    svg {
      color: #fff;
    }

    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#48b461')};
    }

    &:active {
      background: ${darken(0.2, '#48b461')};
    }
  }

  &.button.red {
    background: #e15361;

    color: #fff;

    svg {
      color: #fff;
    }

    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#E15361')};
    }

    &:active {
      background: ${darken(0.2, '#E15361')};
    }
  }

  svg {
    margin-left: 20px;

    &:hover {
    }
  }

  &.button:disabled {
    background: #ddd;
    color: #666;

    &:hover {
      background: #ddd;
    }
  }
`;
