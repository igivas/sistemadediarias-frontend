import {
  Box,
  Flex,
  HStack,
  useDisclosure,
  useToast,
  Button as ButtonChacrka,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import { useAuth } from '../../contexts/auth';
import BoxContent from '../../components/BoxContent';
import TituloPagina from '../../components/TituloPagina';
import DataTable, { IColumns } from '../../components/DataTable';

const ConsultaLegislacao: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();

  const colunas: IColumns = [
    {
      field: 'decreto_leg',
      text: 'Decreto',
      type: {
        name: 'text',
      },
    },
    {
      field: 'situacao_leg',
      text: 'Situação',
      type: {
        name: 'enum',
        enum: {
          '1': 'ATIVA',
          '0': 'INATIVA',
        },
      },
    },
  ];

  const options = {
    serverData: {
      url: `/legislacoes`,
      headers: { Authorization: api.defaults.headers.autohorization },
      serverPagination: true,
    },
    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['nomeLegislacao'],
      cols: [4, 6, 12] as [number, number, number],
    },
    columnOrder: {
      visible: true,
      label: 'Ordem',
    },
  };

  useEffect(() => {
    const loadCounts = async (): Promise<void> => {
      try {
        console.log('teste');
      } catch (error) {
        console.log('Ocorreu um erro');
      }
    };
    loadCounts();
  }, [user]);
  return (
    <>
      <>
        <BoxContent>
          <TituloPagina title="Consulta Legislação" />
          <Box maxWidth="calc(100vw - 50px)">
            <DataTable columns={colunas} options={options} />
          </Box>
        </BoxContent>
      </>
    </>
  );
};

export default ConsultaLegislacao;
