/* eslint-disable prettier/prettier */
import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import * as _ from 'lodash';
import PulseLoader from 'react-spinners/PulseLoader';
import { format, parseISO } from 'date-fns';
import { Flex, Tooltip, Box, Text } from '@chakra-ui/react';
import Row from '../../form/Row';
import FormDatePicker from "../../form/FormDatePicker";
import FormGroup from '../FormGroup';
import Select from '../FormSelect';
import FormInputSearch from '../FormInputSearch';
import Paginator from '../Paginator';
import HeaderColumn from '../HeaderColumn';
import { Container, StatusBar, TotalPanel } from './styles';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/auth';
import ExportCSV from '../ExportCSV';

interface IDataFields {
  [key: string]: any;
}

interface IResponsePaginaton {
  total: number;
  totalPage: number;
  items: IDataFields[];
}
interface IOptionsProp {
  isOpenFetch?: boolean;
  actions?: {
    headerText: string;
    items: {
      icon: JSX.Element;
      tooltip: string;
      getRow(row: any): void;
      handleShowAction?: (row: any) => boolean;
    }[];
  };
  filters?: {
    type: 'date' | 'select'
    field: string;
    label: string;
    options: { value: string; label: string }[];
    defaultOption?: string;
    cols: [number,number,number];
  }[];
  search?: {
    cols: [number,number,number];

    searchable: boolean;
    fields: string[];
    label: string;
  };
  serverData?: {
    url: string;
    headers?: string[][] | Headers | Record<string, string> | undefined;
    serverPagination?: boolean;
    params?: string;

  };
  order?: {
    fields: string[];
    orders?: any;
  };
  columnOrder?: {
    visible: boolean;
    label: string;
  };
  selectMultiline?: {
    visible: boolean;
    primaryColumn: string;
    stateSelectedRows: any[];
  };
  exportCsv?: {
    visible: boolean;
    label: string;
    filename: string;
    columns: {
      field: string;
      title: string;
    }[];
  };
  itemsPerPage?: number[]

}

export type IColumns = {
  field: string;
  alias?: string;
  text: string;
  type: {
    name: 'date' | 'enum' | 'text' | 'currency';
    format?: string;
    enum?: { [key: string]: string };
  };
}[];

interface IDataTableProps {
  columns: IColumns;
  options?: IOptionsProp;
}

interface IFieldSort {
  field: string;
  sort: 'OFF' | 'ASC' | 'DESC';
  alias?: string;
}

interface IFilters {
  [key: string]: string;
}

const RemoteSourceDataTable: React.FC<IDataTableProps> = ({
  columns,
  options,
}) => {
  const { signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(options?.itemsPerPage ?
    Number(
    options?.itemsPerPage[0]):10);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [fieldsSort, setFieldsSort] = useState([] as IFieldSort[]);

  const getFiltersDefault = (): any => {
    let obj = {};
    if (options?.filters && options.filters.length > 0) {
      options.filters.forEach((filter) => {
        if (filter.defaultOption) {
          obj = Object.assign(obj, { [filter.field]: filter.defaultOption });
        }
      });
    }

    return obj;
  };

  const [searchIpunt, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<IFilters>(getFiltersDefault());
  const [dataList, setDataList] = useState<IDataFields[]>([]);

  const handleChangePage = (selectedPage: number): void => {
    setCurrentPage(selectedPage);
  };

  const columnsFields = columns?.map((column) => {
    return { field: column.field, type: column.type, alias:column.alias };
  });

  const serverResponsePagination = useCallback(
    (response: IResponsePaginaton): void => {
      setTotal(response.total);
      setTotalPage(response.totalPage);
      setDataList(response.items);
      if (response.items.length === 0 && currentPage > 1) {
        setCurrentPage(1);
      }
    },
    [currentPage],
  );

  const paramsFilter = useCallback(
    (obj: any): void => {
      setFilters({ ...filters, ...obj });
    },
    [filters],
  );

  const dataFiltered = useCallback(
    (list: IDataFields[]): IDataFields[] => {
      const listFiltered = list.filter((item) => {
        let result = false;
        Object.entries(item).forEach((prop) => {
          if (options?.search?.fields.includes(prop[0])) {
            if (
              String(prop[1]).toLowerCase().includes(query.toLowerCase().trim())
            ) {
              result = true;
            }
          } else {
            result = true;
          }
        });
        return result;
      });
      setTotal(listFiltered.length);
      setTotalPage(Math.ceil(listFiltered.length / perPage));
      return listFiltered;
    },
    [perPage, query, options],
  );

  const getItemsPage = useCallback(
    (dataListPage: IDataFields[]): IDataFields[] => {
      const items = dataFiltered(dataListPage).slice(
        perPage * currentPage - perPage,
        perPage * currentPage,
      );

      if (items) {
        return items;
      }

      return [];
    },
    [perPage, currentPage, dataFiltered],
  );

  const handleIncrementPage = (): void => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDecrementPage = (): void => {
    if (currentPage >= 2) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect((): (() => void) | undefined => {
    const timer = setTimeout(() => {
      setQuery(searchIpunt);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchIpunt, options]);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    setSearchInput(value);

    setCurrentPage(1);
  };

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>): void => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const generateUrl = useCallback((): [string, string] => {
    let url = '';
    const paramsPagination = `&page=${currentPage}&perPage=${perPage}`;
    if (options?.serverData?.serverPagination) {
      url = `${options?.serverData?.url}?${options?.serverData?.params}`;
      if (query !== '') {
        url += `&query=${query}`;
        url += `&fields=${options.search?.fields.join(',')}`;
      }
      if (fieldsSort.length > 0) {
        const fields = fieldsSort.map((field) => field.alias||field.field);
        const sorts = fieldsSort.map((field) => field.sort);
        url += `&sortfields=${fields.join(',')}&sorts=${sorts.join(',')}`;
      }
      if (Object.entries(filters).length > 0) {
        const arrayFilters = Object.entries(filters);
        arrayFilters.forEach((filt) => {
          if (filt[1] !== 'TODOS') {
            url += `&${filt[0]}=${filt[1]}`;
          }
        });
      }

      return [url, url + paramsPagination];
    }
    url += options?.serverData?.url;
    return [url, url];
  }, [perPage, currentPage, options, query, fieldsSort, filters]);

  const orderList = useCallback(
    (list) => {
      if (options?.order) {
        return _.orderBy(
          list,
          options.order.fields,
          options.order.orders ? options.order.orders : [],
        );
      }
      return list;
    },
    [options],
  );

  useEffect(() => {
    const timer =  setTimeout(async () => {
      try {
        if(options?.isOpenFetch || options?.isOpenFetch === undefined) {
          const response = await api.get(generateUrl()[1]);
          if (options?.serverData?.serverPagination) {
            serverResponsePagination(response.data || []);
          } else {
            setDataList(getItemsPage(response.data || []));
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          signOut();
        }
      }

      setLoading(false);
    }, 250);


    return () => clearTimeout(timer);
  }, [
    currentPage,
    options,
    perPage,
    getItemsPage,
    generateUrl,
    serverResponsePagination,
    query,
    orderList,
    fieldsSort,
    signOut,
  ]);

  const perPageItems = options?.itemsPerPage ? options.itemsPerPage.map(item => ({value: item.toString(), label: item.toString()})) :[
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
  ];

  const formatValue = useCallback(
    (value, tipo) => {
      if (tipo.name === 'date') {
        try {
          return format(parseISO(value), tipo.format);
        } catch (error) {
          return value;
        }
      }
      return value;
    },

    [],
  );



  const getValue = useCallback(
    (row, column) => {
      switch (column.type.name) {
        case 'enum':
          return column.type.enum[_.get(row, column.field)];
        case 'date':
          return formatValue(_.get(row, column.field), column.type);

        case 'currency':
          try {
            return new Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency',
            }).format(
              !Number.isNaN(Number(String(_.get(row, column.field))))
                ? _.get(row, column.field)
                : 0,
            );
          } catch (error) {
            return _.get(row, column.field);
          }
        default:
          return _.get(row, column.field);
      }
    },
    [formatValue],
  );

  const handleFieldSort = useCallback(
    (field) => {
      const fields = fieldsSort.filter((item) => item.field !== field.field);
      if (field.sort !== 'OFF') {
        setFieldsSort([...fields, field]);
      } else {
        setFieldsSort(fields);
      }
    },
    [fieldsSort],
  );

  const handleSelectedRows = useCallback(
    (event, row) => {
      if (options?.selectMultiline?.stateSelectedRows) {
        const [selectedRows, setSelectedRows] =
          options?.selectMultiline?.stateSelectedRows;
        if (event.target.checked) {
          setSelectedRows([...selectedRows, row]);
        } else {
          const listFiltered = selectedRows.filter(
            (item: any) =>
              item[options?.selectMultiline?.primaryColumn || ''] !==
              row[options?.selectMultiline?.primaryColumn || ''],
          );
          setSelectedRows(listFiltered);
        }
      }
    },
    [options],
  );

  const handleSelectedAllRows = useCallback(
    (event) => {
      if (options?.selectMultiline?.stateSelectedRows) {
        const [, setSelectedRows] = options?.selectMultiline?.stateSelectedRows;
        if (event.target.checked) {
          setSelectedRows(dataList);
        } else {
          setSelectedRows([]);
        }
      }
    },
    [dataList, options],
  );

  const getNumberColuns = (): number => {
    let numberColumns = columns.length;
    if (options?.actions) {
      numberColumns += 1;
    }
    if (options?.columnOrder?.visible) {
      numberColumns += 1;
    }
    return numberColumns;
  };

  return (
    <>
      <Container>
        <Row>
          {options?.exportCsv && options?.exportCsv?.visible && (
            <Flex
              align="flex-end"
              minWidth="240px"
              justify="center"
              height="55px"
              pr={2}
            >
              <ExportCSV
                async
                serverPagination={options?.serverData?.serverPagination}
                fileName={options.exportCsv.filename}
                columns={options.exportCsv.columns}
                url={generateUrl()[0]}
              />
            </Flex>
          )}

          {options?.filters?.map((filter) => (
            <FormGroup key={filter.label} name={filter.label} cols={filter.cols}>
              {filter.type === 'select' ? (
                <Select
                  optionsSelect={filter.options}
                  defaultValue={filter.defaultOption}
                  onChange={(e) => {
                  paramsFilter({ [filter.field]: e.target.value });
                  setCurrentPage(1);
                }}
                />
            ) : (
              <>
                <FormDatePicker
                  selected={_.get(filters, filter.field)!==undefined && _.get(filters, filter.field)!=='' ?new Date(_.get(filters, filter.field)) :'' as any}
                  onChange={(e) =>   paramsFilter({[filter.field] : e ? (e as Date)?.toISOString() : ''})}
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </>
            )
          }
            </FormGroup>

          ))}

          {options?.search?.searchable && (
            <FormGroup name={options.search.label} cols={options.search.cols}>
              <FormInputSearch
                handleChangeSearch={(event) => handleChangeSearch(event)}
                searchInput={searchIpunt}
              />
            </FormGroup>
          )}
        </Row>

        <table>
          <thead>
            <tr>
              {options?.selectMultiline?.visible && (
              <th style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={
                      options?.selectMultiline.stateSelectedRows[0].length ===
                      dataList.length
                    }
                  onChange={handleSelectedAllRows}
                />
              </th>
              )}
              {options?.columnOrder && options?.columnOrder.visible && (
                <th style={{ textAlign: 'center' }}>
                  {options?.columnOrder.label}
                </th>
              )}
              {columns?.map((column, index) => (
                <th key={index}>
                  <HeaderColumn
                    field={column.field}
                    text={column.text}
                    alias={column.alias}
                    handleFieldSort={handleFieldSort}
                  />
                </th>
              ))}
              {options?.actions?.items && (
                <th id="action-header">{options?.actions?.headerText}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td id="row-loading" colSpan={getNumberColuns()}>
                  <PulseLoader size={10} color="#1a8d4c" loading={loading} />
                </td>
              </tr>
            )}
            {dataList?.map((row, indexRow) => (
              <tr key={indexRow}>
                {options && options.selectMultiline?.visible && (
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={options?.selectMultiline?.stateSelectedRows[0].some(
                        (item: any) =>
                          item[options.selectMultiline?.primaryColumn || ''] ===
                          row[options.selectMultiline?.primaryColumn || ''],
                      )}
                      onChange={(e) => handleSelectedRows(e, row)}
                    />
                  </td>
                )}
                {options?.columnOrder && options.columnOrder.visible && (
                  <td style={{ textAlign: 'center' }}>
                    {indexRow + 1 + (currentPage - 1) * perPage}
                  </td>
                )}
                {columnsFields.map((column) => {
                  return <td key={column.field}>{getValue(row, column)}</td>;
                })}

                {options?.actions && (
                  <td id="actions">
                    <div>
                      {options?.actions.items.map((action, index) =>
                        (((action.handleShowAction && !!action.handleShowAction(row)) || !action.handleShowAction) &&(
                        <Tooltip
                          hasArrow
                          label={action.tooltip}
                          placement="left"
                          key={index}
                        >
                          <button
                            type="button"
                            onClick={() => action.getRow(row)}
                          >
                            {action.icon}
                          </button>
                        </Tooltip>
))
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
      <StatusBar>
        <TotalPanel>
          {dataList.length === 0
            ? 'Nenhum registro encontrado'
            : `Mostrando de ${dataList.length > 0 ? perPage * currentPage - perPage + 1 : 0
            } a ${dataList.length + perPage * (currentPage - 1)
            } de ${total} ${total === 1 ? 'registro' : 'registros'}`}
        </TotalPanel>
        {dataList.length >= 1 && (
          <>
            <Box
              width="180px"
              display="flex"
              flex-direction="row"
              alignItems="center"
            >
              <Box width="90px">
                <Select
                  optionsSelect={[...perPageItems, {label: 'Todos', value: ''}]}
                  onChange={handleChangePerPage}
                />
              </Box>
              <Box width="82px" marginLeft="8px">
                <Text>por página</Text>
              </Box>
            </Box>

            <Paginator
              totalPage={totalPage}
              currentPage={currentPage}
              handleChangePage={handleChangePage}
              handleIncrementPage={handleIncrementPage}
              handleDecrementPage={handleDecrementPage}
            />
          </>
        )}
      </StatusBar>
    </>
  );
};

export default RemoteSourceDataTable;
