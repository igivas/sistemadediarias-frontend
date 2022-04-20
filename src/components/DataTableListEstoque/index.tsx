import React from 'react';
import LocalSourceDataTable from './LocalSourceDataTable';
import RemoteSourceDataTable from './RemoteSourceDataTable';

interface IDataFields {
  [key: string]: any;
}

interface IOptionsProp {
  actions?: {
    headerText: string;
    items: {
      icon: JSX.Element;
      tooltip: string;
      getRow(row: any): void;
    }[];
  };
  filters?: {
    field: string;
    label: string;
    options: { value: string; label: string }[];
    defaultOption?: string;
  }[];
  search?: {
    searchable: boolean;
    fields: string[];
    label: string;
  };
  serverData?: {
    url: string;
    headers?: string[][] | Headers | Record<string, string> | undefined;
    serverPagination?: boolean;
  };
  order?: {
    fields: string[];
    orders?: any;
  };
  columnOrder?: {
    visible: boolean;
    label: string;
  };
  exportCsv?: {
    visible: boolean;
    label: string;
    filename: string;
    headers: string[];
  };
}

export type IColumns = {
  field: string;
  text: string;
  type: {
    name: 'date' | 'enum' | 'text';
    format?: string;
    enum?: { [key: string]: string };
  };
}[];

interface IDataTableProps {
  columns: IColumns;
  options?: IOptionsProp;
  data?: IDataFields[];
}

const DataTable: React.FC<IDataTableProps> = ({ columns, options, data }) => {
  return (
    <>
      {data ? (
        <LocalSourceDataTable columns={columns} options={options} data={data} />
      ) : (
        <RemoteSourceDataTable columns={columns} options={options} />
      )}
    </>
  );
};

export default DataTable;
