import React, { createContext, useCallback, useState, useContext } from 'react';

interface IPmContextData {
  idPmCodigo: number | undefined;
  matPolicialMilitar(id: number): Promise<void>;
}

const PolicialMilitarContext = createContext<IPmContextData>(
  {} as IPmContextData,
);

const PolicialMilitarProvider: React.FC = ({ children }) => {
  const [idPmCodigo, setIdPmCodigo] = useState<number | undefined>(() => {
    const id = sessionStorage.getItem('@pmce-cetic-sisfard:pm_codigo');

    if (id) {
      return JSON.parse(id);
    }

    return undefined;
  });

  const matPolicialMilitar = useCallback(async (id: number) => {
    setIdPmCodigo(id);
    sessionStorage.setItem('@pmce-cetic-sisfard:pm_codigo', JSON.stringify(id));
  }, []);

  return (
    <PolicialMilitarContext.Provider
      value={{
        idPmCodigo,
        matPolicialMilitar,
      }}
    >
      {children}
    </PolicialMilitarContext.Provider>
  );
};

function usePm(): IPmContextData {
  const context = useContext(PolicialMilitarContext);

  if (!context) {
    throw new Error('usePm must be used within an PmProvider');
  }

  return context;
}

export { PolicialMilitarProvider, usePm };
