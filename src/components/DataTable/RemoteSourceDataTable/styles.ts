import styled from 'styled-components';

export const Container = styled.div`
  & > div {
    justify-content: flex-end;
    align-items: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 1px;
    font-size: 14px;

    @media (max-width: 768px) {
      min-width: 768px;
    }
  }

  table,
  th,
  td {
    border: 1px solid #999;
  }
  th {
    padding: 8px 8px;
    text-align: left;
  }

  td {
    padding: 8px 8px;
    text-align: left;
    font-size: 14px;
    /* min-width: 120px; */
  }

  thead th {
    font-weight: 700;
    background-color: #fff;
    /* min-width: 120px; */
  }

  thead th#action-header {
    text-align: center;
  }

  thead th div#header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  tbody td#actions {
    div {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      button {
        background: none;
        border: none;
        display: flex;
        margin-right: 5px;
        justify-content: center;
      }

      svg {
        color: #898c90;
        transition: color 0.2s;

        &:hover {
          color: #333;
        }
      }
    }
  }

  tbody tr {
    background-color: #fff;
  }

  tbody tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tbody tr:hover {
    background-color: #e5e5e5;
  }

  tbody tr td#row-loading {
    border: 1px solid #bbb;

    line-height: 100px;
    vertical-align: center;
    text-align: center;
  }
  /* tbody tr td {

  } */
`;

export const FilterPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px;
  width: 100%;

  @media (max-width: 768px) {
    min-width: 768px;
  }
`;

export const StatusBar = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    min-width: 768px;
  }
`;

export const TotalPanel = styled.div`
  font-weight: 400;
  font-size: 14px;
  margin-left: 4px;
`;
