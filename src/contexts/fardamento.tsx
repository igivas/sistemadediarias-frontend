import React, { createContext, useCallback, useState, useContext } from 'react';

interface IFardamentoContextData {
  idFardamento: number | undefined;
  updateIdFardamento(id: number): Promise<void>;
}

const FardamentoContext = createContext<IFardamentoContextData>(
  {} as IFardamentoContextData,
);

const FardamentoProvider: React.FC = ({ children }) => {
  const [idFardamento, setIdFardamento] = useState<number | undefined>(() => {
    const id = sessionStorage.getItem('@pmce-cetic-sisfard:id_fardamento');

    if (id) {
      return JSON.parse(id);
    }

    return undefined;
  });

  const updateIdFardamento = useCallback(async (id: number) => {
    setIdFardamento(id);
    sessionStorage.setItem(
      '@pmce-cetic-sisfard:id_fardamento',
      JSON.stringify(id),
    );
  }, []);

  return (
    <FardamentoContext.Provider
      value={{
        idFardamento,
        updateIdFardamento,
      }}
    >
      {children}
    </FardamentoContext.Provider>
  );
};

function useFardamento(): IFardamentoContextData {
  const context = useContext(FardamentoContext);

  if (!context) {
    throw new Error('useFardamento must be used within an FardamentoProvider');
  }

  return context;
}

export { FardamentoProvider, useFardamento };
