import React, { createContext, useCallback, useState, useContext } from 'react';

interface IDocumentoContextData {
  idDocumento: number | undefined;
  updateIdDocumento(id: number): Promise<void>;
}

const DocumentoContext = createContext<IDocumentoContextData>(
  {} as IDocumentoContextData,
);

const DocumentoProvider: React.FC = ({ children }) => {
  const [idDocumento, setidDocumento] = useState<number | undefined>(() => {
    const id = sessionStorage.getItem('@pmce-cetic-sisfard:id_documentos');

    if (id) {
      return JSON.parse(id);
    }

    return undefined;
  });

  const updateIdDocumento = useCallback(async (id: number) => {
    setidDocumento(id);
    sessionStorage.setItem(
      '@pmce-cetic-sisfard:id_documentos',
      JSON.stringify(id),
    );
  }, []);

  return (
    <DocumentoContext.Provider
      value={{
        idDocumento,
        updateIdDocumento,
      }}
    >
      {children}
    </DocumentoContext.Provider>
  );
};

function useDocumento(): IDocumentoContextData {
  const context = useContext(DocumentoContext);

  if (!context) {
    throw new Error('useDocumento must be used within an DocumentoProvider');
  }

  return context;
}

export { DocumentoProvider, useDocumento };
