import React, { createContext, useCallback, useState, useContext } from 'react';

interface IFornecedorContextData {
  idFornecedor: number | undefined;
  updateIdFornecedor(id: number): Promise<void>;
}

const FornecedorContext = createContext<IFornecedorContextData>(
  {} as IFornecedorContextData,
);

const FornecedorProvider: React.FC = ({ children }) => {
  const [idFornecedor, setIdFornecedor] = useState<number | undefined>(() => {
    const id = sessionStorage.getItem('@pmce-cetic-sisfard:id_fornecedor');

    if (id) {
      return JSON.parse(id);
    }

    return undefined;
  });

  const updateIdFornecedor = useCallback(async (id: number) => {
    setIdFornecedor(id);
    sessionStorage.setItem(
      '@pmce-cetic-sisfard:id_fornecedor',
      JSON.stringify(id),
    );
  }, []);

  return (
    <FornecedorContext.Provider
      value={{
        idFornecedor,
        updateIdFornecedor,
      }}
    >
      {children}
    </FornecedorContext.Provider>
  );
};

function useFornecedor(): IFornecedorContextData {
  const context = useContext(FornecedorContext);

  if (!context) {
    throw new Error('useFornecedor must be used within an FornecedorProvider');
  }

  return context;
}

export { FornecedorProvider, useFornecedor };
