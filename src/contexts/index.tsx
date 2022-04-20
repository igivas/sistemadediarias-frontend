import React from 'react';

import { AuthProvider } from './auth';
import { FardamentoProvider } from './fardamento';
import { ItemProvider } from './item';
import { FornecedorProvider } from './fornecedor';
import { EntradaCologProvider } from './entradaColog';
import { PolicialMilitarProvider } from './policialMilitar';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <EntradaCologProvider>
      <FornecedorProvider>
        <ItemProvider>
          <FardamentoProvider>
            <PolicialMilitarProvider>{children}</PolicialMilitarProvider>
          </FardamentoProvider>
        </ItemProvider>
      </FornecedorProvider>
    </EntradaCologProvider>
  </AuthProvider>
);

export default AppProvider;
