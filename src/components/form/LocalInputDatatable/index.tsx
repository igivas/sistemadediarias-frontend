import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { IColumns } from 'components/DataTable';
import * as _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FormGroup from '../FormGroup';
import FormInput from '../FormInput';

interface IOptionsProp {
  actions: {
    headerText: string;
    items: {
      icon: JSX.Element;
      tooltip: string;
      getRow(row: Record<string, any>): void;
    }[];
  };
}

interface IProps {
  inputLabel?: string;
  options: IOptionsProp;
  isTableActive: boolean;
  columns: IColumns;
  errorMessage?: string;
  data: any[];
  fieldFilters: string[];
  itemsPerPage?: number;
}

const LocalInputDataTable: React.FC<IProps> = ({
  columns,
  data,
  isTableActive,
  options: { actions },
  errorMessage,
  inputLabel,
  fieldFilters,
  itemsPerPage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTableVisible, setisTableVisible] = useState(false);
  const [datalist, setDatalist] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any): void => {
    if (ref.current && !ref.current.contains(event.target)) {
      setisTableVisible(false);
    }
  };

  const dataFiltered = useCallback(
    (list: any[]) => {
      const listFiltered = list.filter((item) => {
        const fieldsInputToSearch = fieldFilters.map((field) =>
          (_.get(item, field)?.toString() as string | undefined)?.toLowerCase(),
        );

        if (inputValue)
          return (
            fieldsInputToSearch &&
            fieldsInputToSearch.filter((input) =>
              input?.includes(inputValue.toLowerCase()),
            ).length > 0
          );

        return true;
      });

      return listFiltered;
    },
    [fieldFilters, inputValue],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  useEffect(() => {
    setDatalist(dataFiltered(data).slice(0, itemsPerPage || 5));
  }, [dataFiltered, data, itemsPerPage]);

  return (
    <>
      {isTableActive && (
        <Flex justifyContent="center" alignItems="center" marginBottom="1rem">
          <FormGroup name={inputLabel} cols={[8, 12, 12]}>
            <FormInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              error={errorMessage}
              onClick={() => setisTableVisible(true)}
            />
          </FormGroup>
        </Flex>
      )}

      <div
        style={{
          zIndex: 0,
          position: 'relative',
          width: '100%',
        }}
        ref={ref}
      >
        {isTableVisible && (
          <Table
            width="100%"
            variant="simple"
            colorScheme="green"
            backgroundColor="#f5fff5"
            borderRadius={10}
          >
            <Thead>
              <Tr>
                {columns.map((header, indexHeader) => (
                  <Th key={indexHeader}>{header.text}</Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {datalist.map((result, index) => (
                <Tr
                  _hover={{
                    background: 'white',
                    color: 'green.500',
                  }}
                  key={`resultLine${index}`}
                >
                  {columns.map((resultColumn, indexColumn) => (
                    <Td key={`indexColumn${indexColumn}`}>
                      {_.get(result, resultColumn.field)}
                    </Td>
                  ))}

                  {actions.items.map((action, indexAction) => (
                    <Td id="actions">
                      <Tooltip
                        hasArrow
                        label={action.tooltip}
                        placement="left"
                        key={`action${indexAction}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            action.getRow(result);
                            setInputValue('');
                            setisTableVisible(false);
                            setDatalist([]);
                          }}
                        >
                          {action.icon}
                        </button>
                      </Tooltip>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default LocalInputDataTable;
