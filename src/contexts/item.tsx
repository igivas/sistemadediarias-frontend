import React, { createContext, useCallback, useState, useContext } from 'react';

interface IItemContextData {
  idItem: number | undefined;
  updateIdItem(id: number): Promise<void>;
}

const ItemContext = createContext<IItemContextData>({} as IItemContextData);

const ItemProvider: React.FC = ({ children }) => {
  const [idItem, setIdItem] = useState<number | undefined>(() => {
    const id = sessionStorage.getItem('@pmce-cetic-sisfard:id_item');

    if (id) {
      return JSON.parse(id);
    }

    return undefined;
  });

  const updateIdItem = useCallback(async (id: number) => {
    setIdItem(id);
    sessionStorage.setItem('@pmce-cetic-sisfard:id_item', JSON.stringify(id));
  }, []);

  return (
    <ItemContext.Provider
      value={{
        idItem,
        updateIdItem,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

function useItem(): IItemContextData {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error('useItem must be used within an ItemProvider');
  }

  return context;
}

export { ItemProvider, useItem };
