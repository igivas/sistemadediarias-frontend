import styled from 'styled-components';

export const Container = styled.div`
  height: 60px;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 750px) {
    button:nth-child(n + 2) {
      margin-left: 20px;
    }
  }

  @media (max-width: 750px) {
    margin-top: 16px;
    button {
      margin-left: 0px;
      width: 100%;
    }

    button:nth-child(n + 2) {
      margin-top: 8px;
    }
  }
`;
