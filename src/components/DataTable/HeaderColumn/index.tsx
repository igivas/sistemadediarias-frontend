import React, { useCallback, useState } from 'react';
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { Container } from './styles';

interface IFieldSort {
  field: string;
  sort: 'OFF' | 'ASC' | 'DESC';
  alias?: string;
}

interface IHeaderColumnProps {
  field: string;
  text: string;
  alias?: string;
  handleFieldSort(field: IFieldSort): void;
}

type Sorts = 'OFF' | 'ASC' | 'DESC';

const HeaderColumn: React.FC<IHeaderColumnProps> = ({
  field,
  text,
  handleFieldSort,
  alias,
}) => {
  const [sort, setSort] = useState<Sorts>('OFF');
  const [active, setActive] = useState(false);

  const handleClickSort = useCallback(() => {
    function getSort(sortOption: Sorts): Sorts {
      switch (sortOption) {
        case 'OFF':
          return 'ASC';
        case 'ASC':
          return 'DESC';
        case 'DESC':
          return 'OFF';
        default:
          return 'OFF';
      }
    }
    const newSort = getSort(sort);

    setSort(newSort);
    handleFieldSort({ field, sort: newSort, alias });
    if (newSort !== 'OFF') {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [sort, handleFieldSort, field, alias]);

  return (
    <Container>
      {text}
      {alias &&
        (sort === 'OFF' || sort === 'ASC' ? (
          <button type="button" onClick={handleClickSort}>
            <FaSortAmountUp className={active ? 'active' : ''} />
          </button>
        ) : (
          <button type="button" onClick={handleClickSort}>
            <FaSortAmountDown className={active ? 'active' : ''} />
          </button>
        ))}
    </Container>
  );
};

export default HeaderColumn;
