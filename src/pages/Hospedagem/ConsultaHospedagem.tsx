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

interface IHospedagem {
  id_hosp: number;
  descricao_hosp: string;
  situacao_hosp: string;
  usuario_cadastro: string;
  data_cadastro: string;
  usuario_alteracao: string;
  data_alteracao: string;
}

const ConsultaHospedagem: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();
  const [hospedagemModal, sethospedagemModal] = useState<IHospedagem>();

  const {
    isOpen: isOpenVisualizar,
    onOpen: onOpenVisualizar,
    onClose: onCloseVisualizar,
  } = useDisclosure();

  const schema = Yup.object().shape({
    nomeHospedagem: Yup.string()
      .required('Campo obrigatório')
      .min(3, 'Nome muito curto'),
  });

  const { handleSubmit, errors, control, setValue } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      nomeHospedagem: undefined,
      situacaoHospedagem: undefined,
    },
  });

  const submitFormData = async (data: any): Promise<void> => {
    const dados = {
      ...data,
      descricao_hosp: String(data.nomeHospedagem).toUpperCase(),
      usuario_cadastro: user.matricula,
      situacao_hosp: '1',
      deletado_hosp: '0',
    };

    try {
      await api.post('/hospedagens', dados);
      toast({
        title: 'Sucesso.',
        description: 'Hospedagem inserida com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setValue('nomeHopedagem', '');
      history.push('/hospedagens');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error?.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleExcluirHospedagem = async (data: IHospedagem): Promise<any> => {
    try {
      await api.put(`/hospedagens/deletar/${data.id_hosp}`);

      toast({
        title: 'Sucesso.',
        description: 'Hospedagem excluída com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onCloseVisualizar();
      history.push('/hospedagens');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onCloseVisualizar();
      history.push('/hospedagens');
    }
  };

  /* const handleClickShow = useCallback(
      async (id: number) => {
        await updateIdLegislacao(id);
  
        history.push(`/showlegislacao`);
  
      }
      [updateIdLegislacao, history],
    ); */

  /*
    const handleClickEdit = useCallback(
      async (id_leg: number) => {
        await updateIdLegislacao(id_leg);
  
        history.push(`/legislacoes/id_leg`);
      },
      [updateIdLegislacao, history],
    );
    */

  const handleSetActive = useCallback(async (hospedagem: IHospedagem) => {
    try {
      await api.put(`/hospedagens/${hospedagem.id_hosp}`, {
        situacao_hosp: hospedagem.situacao_hosp === '0' ? '1' : '0',
      });
      toast({
        title: 'Sucesso.',
        description: 'Hospedagem atualizada com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      history.push('/hospedagens');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error?.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, []);

  const colunas: IColumns = [
    {
      field: 'descricao_hosp',
      text: 'Decreto',
      type: {
        name: 'text',
      },
    },
    {
      field: 'situacao_hosp',
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
      url: `/hospedagens`,
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
          <TituloPagina title="Consulta Hospedagem" />
          <Box maxWidth="calc(100vw - 50px)">
            <DataTable columns={colunas} options={options} />
          </Box>
          {hospedagemModal && (
            <Modal
              isOpen={isOpenVisualizar}
              onClose={onCloseVisualizar}
              size="lg"
              title="Exclusão de Hospedagem"
            >
              <h1>
                Você está prestes a deletar uma hospedagem, você tem certeza da
                operação?
              </h1>
              <Flex mt="8" justify="center">
                <HStack spacing="4">
                  <ButtonChacrka
                    onClick={onCloseVisualizar}
                    colorScheme="green"
                  >
                    Não
                  </ButtonChacrka>

                  <ButtonChacrka
                    onClick={() => handleExcluirHospedagem(hospedagemModal)}
                    colorScheme="red"
                  >
                    Sim quero deletar!
                  </ButtonChacrka>
                </HStack>
              </Flex>
            </Modal>
          )}
        </BoxContent>
      </>
    </>
  );
};

export default ConsultaHospedagem;
