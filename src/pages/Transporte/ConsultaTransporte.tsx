import {
  Box,
  Flex,
  HStack,
  useDisclosure,
  useToast,
  Button as ButtonChacrka,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEdit, FaSave, FaSearch, FaTrash } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import * as Yup from 'yup';
import { register } from 'serviceWorker';
import FormInput from '../../components/form/FormInput';
import { useAuth } from '../../contexts/auth';
import BoxContent from '../../components/BoxContent';
import TituloPagina from '../../components/TituloPagina';
import Button from '../../components/form/Button';
import DataTable, { IColumns } from '../../components/DataTable';
import FormGroup from '../../components/form/FormGroup';
import Modal from '../../components/Modal';

interface ITransporte {
  id_tran: number;
  descricao_tran: string;
  situacao_tran: string;
  usuario_cadastro: string;
  data_cadastro: string;
  usuario_alteracao: string;
  data_alteracao: string;
}

const ConsultaTransporte: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const colunas: IColumns = [
    {
      field: 'descricao_tran',
      text: 'Transporte',
      type: {
        name: 'text',
      },
    },
    {
      field: 'situacao_tran',
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
      url: `/transportes`,
      headers: { Authorization: api.defaults.headers.autohorization },
      serverPagination: true,
    },
    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['nomeTransporte'],
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
          <TituloPagina title="Consulta Transporte" />
          <Box maxWidth="calc(100vw - 50px)">
            <DataTable columns={colunas} options={options} />
          </Box>
        </BoxContent>
      </>
    </>
  );
};

export default ConsultaTransporte;
