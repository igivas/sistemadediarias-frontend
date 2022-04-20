import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import * as _ from 'lodash';
import PulseLoader from 'react-spinners/PulseLoader';
import { format, parseISO } from 'date-fns';
import { Flex, Tooltip, Box, Text } from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';
import FormGroup from '../FormGroup';
import Select from '../FormSelect';
import FormInputSearch from '../FormInputSearch';
import Paginator from '../Paginator';
import HeaderColumn from '../HeaderColumn';
import { Container, StatusBar, TotalPanel, FilterPanel } from './styles';
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
}

interface IFieldSort {
  field: string;
  sort: 'OFF' | 'ASC' | 'DESC';
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
  const [perPage, setPerPage] = useState(10);
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
    return { field: column.field, type: column.type };
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
        const fields = fieldsSort.map((field) => field.field);
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
    const load = async (): Promise<void> => {
      try {
        const response = await api.get(generateUrl()[1]);
        if (options?.serverData?.serverPagination) {
          serverResponsePagination(response.data || []);
        } else {
          setDataList(getItemsPage(response.data || []));
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          signOut();
        }
      }

      setLoading(false);
    };

    load();
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

  const perPageItems = [
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
        <FilterPanel>
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
                headers={options.exportCsv.headers}
                url={generateUrl()[0]}
              />
            </Flex>
          )}

          {options?.filters?.map((filter) => (
            <FormGroup key={filter.label} name={filter.label} cols={[4, 4, 8]}>
              <Select
                optionsSelect={filter.options}
                defaultValue={filter.defaultOption}
                onChange={(e) => {
                  paramsFilter({ [filter.field]: e.target.value });
                  setCurrentPage(1);
                }}
              />
            </FormGroup>
          ))}

          {options?.search?.searchable && (
            <>
              <Tooltip
                hasArrow
                label="O campo de pesquisa pode ser filtrado por                                                                   
                *Fardamento 
                *Tipo
                *Sexo
                *Tamanho"
                placement="left"
              >
                <button type="button">
                  <FiHelpCircle />
                </button>
              </Tooltip>
              <FormGroup name={options.search.label} cols={[4, 4, 8]}>
                <FormInputSearch
                  handleChangeSearch={(event) => handleChangeSearch(event)}
                  searchInput={searchIpunt}
                />
              </FormGroup>
            </>
          )}
        </FilterPanel>

        <table>
          <thead>
            <tr>
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
                      {options?.actions.items.map((action, index) => (
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
                      ))}
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
            : `Mostrando de ${
                dataList.length > 0 ? perPage * currentPage - perPage + 1 : 0
              } a ${
                dataList.length + perPage * (currentPage - 1)
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
              <Box width="70px">
                <Select
                  optionsSelect={perPageItems}
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
