import { Button, Checkbox, Flex, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';

type OptionType = { label: string; value: string };

type IProps = {
  items: OptionType[];
  handleSelectedOptions: (options: OptionType[]) => void;
  defaultSelected?: string[];
};

const ItemSelector: React.FC<IProps> = ({
  items,
  handleSelectedOptions,
  defaultSelected,
}) => {
  const [checkedItemsToSelect, setCheckedItemsToSelect] = useState<boolean[]>(
    () => {
      if (defaultSelected) {
        return items
          .filter((item) => !defaultSelected.includes(item.value))
          .map(() => false);
      }

      return items.map(() => false);
    },
  );

  const [checkedItemsSelected, setCheckedItemsSelected] = useState<boolean[]>(
    () => {
      if (defaultSelected) return defaultSelected.map(() => false);

      return [];
    },
  );

  const [itemsToSelect, setItemsToSelect] = useState<OptionType[]>(() => {
    if (defaultSelected)
      return items.filter((item) => !defaultSelected.includes(item.value));

    return items || [];
  });

  const [itemsSelected, setItemsSelected] = useState<OptionType[]>(() => {
    if (defaultSelected)
      return items.filter((item) => defaultSelected.includes(item.value));

    return [];
  });

  useEffect(() => {
    setCheckedItemsSelected(itemsSelected.map(() => false));
  }, [itemsSelected]);

  useEffect(() => {
    setCheckedItemsToSelect(itemsToSelect.map(() => false));
  }, [itemsToSelect]);

  return (
    <Flex direction="row">
      <Flex
        direction="column"
        border="2px solid #c1c1c1"
        borderRadius="5px"
        backgroundColor="#fff"
        overflowY="scroll"
        height="240px"
        width="200px"
      >
        {itemsToSelect.map((item, index) => (
          <Checkbox
            isChecked={checkedItemsToSelect[index]}
            color="#707070"
            fontSize="24px"
            padding={1}
            marginLeft="8px"
            onChange={() => {
              checkedItemsToSelect[index] = !checkedItemsToSelect[index];

              const updatedcheckedItemsToSelect = [...checkedItemsToSelect];
              setCheckedItemsToSelect(updatedcheckedItemsToSelect);
            }}
          >
            {item.label}
          </Checkbox>
        ))}
      </Flex>
      <Flex
        direction="column"
        marginLeft="2rem"
        marginTop="0.5rem"
        justifyContent="space-around"
      >
        <Tooltip label="Adicionar selecionados">
          <Button
            colorScheme="gray"
            onClick={() => {
              const updatedSelectedItems = [
                ...itemsSelected,
                ...itemsToSelect.filter(
                  (_, index) => !!checkedItemsToSelect[index],
                ),
              ];

              setItemsSelected(updatedSelectedItems);

              const filteredItemsNotSelected = itemsToSelect.filter(
                (_, index) => !checkedItemsToSelect[index],
              );
              setItemsToSelect(filteredItemsNotSelected);

              handleSelectedOptions(updatedSelectedItems);
            }}
          >
            <FaArrowRight color="green" type="button" />
          </Button>
        </Tooltip>

        <Tooltip label="Adicionar todos">
          <Button colorScheme="gray" type="button">
            <FaAngleDoubleRight color="green" type="button" />
          </Button>
        </Tooltip>

        <Tooltip label="Remover selecionados">
          <Button
            colorScheme="gray"
            type="button"
            onClick={() => {
              setItemsToSelect(
                items.filter(
                  (item) =>
                    !!itemsToSelect.find(
                      (item2) => item2.value === item.value,
                    ) ||
                    itemsSelected.filter(
                      (item3, index) =>
                        item3.value === item.value &&
                        !!checkedItemsSelected[index],
                    ).length > 0,
                ),
              );

              const filteredItemsNotSelected = itemsSelected.filter(
                (_, index) => !checkedItemsSelected[index],
              );

              setItemsSelected([...filteredItemsNotSelected]);

              handleSelectedOptions(filteredItemsNotSelected);
            }}
          >
            <FaArrowLeft color="red" />
          </Button>
        </Tooltip>

        <Tooltip label="Remover todos">
          <Button colorScheme="gray" type="button">
            <FaAngleDoubleLeft color="red" />
          </Button>
        </Tooltip>
      </Flex>

      <Flex
        direction="column"
        border="2px solid #c1c1c1"
        borderRadius="5px"
        backgroundColor="#fff"
        overflowY="scroll"
        height="240px"
        width="200px"
        marginLeft="2rem"
      >
        {itemsSelected.map((item, index) => (
          <Checkbox
            isChecked={checkedItemsSelected[index]}
            color="#707070"
            fontSize="24px"
            padding={1}
            marginLeft="8px"
            onChange={() => {
              checkedItemsSelected[index] = !checkedItemsSelected[index];

              const updatedcheckedItemsSelected = [...checkedItemsSelected];
              setCheckedItemsSelected(updatedcheckedItemsSelected);
            }}
          >
            {item.label}
          </Checkbox>
        ))}
      </Flex>
    </Flex>
  );
};

export default ItemSelector;
