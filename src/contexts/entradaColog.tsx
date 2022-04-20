import React, { createContext, useCallback, useState, useContext } from 'react';

interface IEntradaCologContextData {
  idEntradaColog: number | undefined;
  updateIdEntradaColog(id: number): Promise<void>;
}

const EntradaCologContext = createContext<IEntradaCologContextData>(
  {} as IEntradaCologContextData,
);

const EntradaCologProvider: React.FC = ({ children }) => {
  const [idEntradaColog, setIdEntradaColog] = useState<number | undefined>(
    () => {
      const id = sessionStorage.getItem('@pmce-cetic-sisfard:id_entrada_colog');

      if (id) {
        return JSON.parse(id);
      }

      return undefined;
    },
  );

  const updateIdEntradaColog = useCallback(async (id: number) => {
    setIdEntradaColog(id);
    sessionStorage.setItem(
      '@pmce-cetic-sisfard:id_entrada_colog',
      JSON.stringify(id),
    );
  }, []);

  return (
    <EntradaCologContext.Provider
      value={{
        idEntradaColog,
        updateIdEntradaColog,
      }}
    >
      {children}
    </EntradaCologContext.Provider>
  );
};

function useEntradaColog(): IEntradaCologContextData {
  const context = useContext(EntradaCologContext);

  if (!context) {
    throw new Error(
      'useEntradaColog must be used within an EntradaCologProvider',
    );
  }

  return context;
}

export { EntradaCologProvider, useEntradaColog };
