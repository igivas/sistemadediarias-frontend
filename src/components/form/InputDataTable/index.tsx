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
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import { IColumns } from '../../DataTable';
import FormGroup from '../FormGroup';
import FormInput from '../FormInput';

interface IOptionsProp {
  serverData: {
    url: string;
    params?: Record<string, any>;
    headers?: string[][] | Headers | Record<string, string> | undefined;
  };
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
  fieldManipulateArray?: string;
  canRequest: boolean;
  handleInput?: (inputValue: string) => Promise<any[]>;
}

const InputDataTable: React.FC<IProps> = ({
  inputLabel,
  columns,
  errorMessage,
  options: { serverData, actions },
  isTableActive,
  fieldManipulateArray,
  canRequest,
  handleInput,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [previousInputValue, setPreviousInputValue] = useState('');
  const [isTableVisible, setisTableVisible] = useState(false);
  const [datalist, setDatalist] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any): void => {
    if (ref.current && !ref.current.contains(event.target)) {
      setisTableVisible(false);
    }
  };

  useEffect((): (() => void) | undefined => {
    const loadTable = async (): Promise<void> => {
      let resultDataList = [];

      if (handleInput) {
        resultDataList = await handleInput(inputValue);
      } else {
        const { data: response } = await axios.get(serverData.url, {
          params: { ...serverData.params, query: inputValue },
          headers: { ...serverData.headers },
        });
        resultDataList = response;
      }
      if (fieldManipulateArray)
        setDatalist(get(resultDataList, fieldManipulateArray));
      else setDatalist(resultDataList);
    };

    if (inputValue.trim().length > 0 && canRequest) {
      if (inputValue !== previousInputValue) {
        const timer = setTimeout(async () => {
          loadTable();
          setPreviousInputValue(inputValue);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }

    return undefined;
  }, [
    serverData,
    inputValue,
    fieldManipulateArray,
    handleInput,
    canRequest,
    previousInputValue,
  ]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

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
                      {get(result, resultColumn.field)}
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
                            setPreviousInputValue('');
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

export default InputDataTable;
