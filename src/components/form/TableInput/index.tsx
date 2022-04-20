import { Table, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { IColumns } from 'components/DataTable';
import { get } from 'lodash';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import './styles.css';

interface IProps {
  columns: IColumns;
  data: Record<string, any> & { id?: string }[];
  control: Control;
  controlName: string;

  actions: {
    headerText: string;
    items: {
      icon: JSX.Element;
      tooltip: string;
      getRow(row: Record<string, any>, index: number): void;
    }[];
  };
}

const TableInput: React.FC<IProps> = ({
  columns,
  data = [],
  control,
  controlName,
  actions,
}) => {
  return (
    <Table className="table-input">
      <Thead>
        <Tr>
          {columns.map((header, indexHeader) => (
            <Th key={indexHeader}>{header.text}</Th>
          ))}
        </Tr>
      </Thead>

      <Tbody>
        {data.map(({ id, ...element }, indexElement) => (
          <Controller
            key={id}
            name={`${controlName}.${indexElement}`}
            control={control}
            defaultValue={element}
            render={() => (
              <Tr
                _hover={{
                  background: 'white',
                  color: 'gray.500',
                }}
                key={id as string}
              >
                {columns.map((column) => (
                  <Td key={id}>{get(element, column.field)}</Td>
                ))}

                {actions && (
                  <Td id="actions" border="none">
                    <div>
                      {actions?.items.map((action, indexAction) => (
                        <Tooltip
                          hasArrow
                          label={action.tooltip}
                          placement="left"
                          key={JSON.stringify({ id, indexAction })}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              action.getRow({ ...element, id }, indexElement);
                            }}
                          >
                            {action.icon}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </Td>
                )}
              </Tr>
            )}
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default TableInput;
