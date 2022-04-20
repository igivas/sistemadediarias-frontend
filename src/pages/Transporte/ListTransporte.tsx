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
import { ValueType } from 'react-select';
import FormInput from '../../components/form/FormInput';
import { useAuth } from '../../contexts/auth';
import BoxContent from '../../components/BoxContent';
import TituloPagina from '../../components/TituloPagina';
import Button from '../../components/form/Button';
import DataTable, { IColumns } from '../../components/DataTable';
import FormGroup from '../../components/form/FormGroup';
import Modal from '../../components/Modal';
import ReactSelect from '../../components/form/ReactSelect';

interface ITransporte {
  id_tran: number;
  descricao_tran: string;
  situacao_tran: string;
  usuario_cadastro: string;
  data_cadastro: string;
  usuario_alteracao: string;
  data_alteracao: string;
}

interface IFormTransporte {
  nomeTransporte: string;
  situacaoTransporte: string;
}

type OptionType = { label: string; value: string };

const optionsSituacaoTransporte = [
  { value: '0', label: 'INATIVO' },
  { value: '1', label: 'ATIVO' },
];

const ListTransporte: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();
  const [transporteModal, setTransporteModal] = useState<ITransporte>();
  const [tiposTransportes, setTiposTransportes] = useState<ITransporte[]>([]);
  const [tipoTransporte, setTipoTransporte] = useState<ITransporte>(
    {} as ITransporte,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const schema = Yup.object().shape({
    nomeTransporte: Yup.string()
      .required('Campo obrigatório')
      .min(3, 'Nome muito curto'),
  });

  const { handleSubmit, errors, control, setValue } = useForm<IFormTransporte>({
    resolver: yupResolver(schema),
    defaultValues: {
      nomeTransporte: undefined,
      situacaoTransporte: undefined,
    },
  });

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormTransporte>({
    defaultValues: {
      nomeTransporte: undefined,
      situacaoTransporte: undefined,
    },
    resolver: yupResolver(schema),
  });

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const submitFormData = async (data: any): Promise<void> => {
    const dados = {
      ...data,
      descricao_tran: String(data.nomeTransporte).toUpperCase(),
      usuario_cadastro: user.matricula,
      situacao_tran: '1',
      deletado_tran: '0',
    };

    try {
      await api.post('/transportes', dados);
      toast({
        title: 'Sucesso.',
        description: 'Transporte inserido com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setValue('nomeTransporte', '');
      history.push('/transportes');
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

  const handleExcluirTransporte = async (data: ITransporte): Promise<any> => {
    try {
      await api.put(`/transportes/deletar/${data.id_tran}`);

      toast({
        title: 'Sucesso.',
        description: 'Transporte excluído com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/transportes');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/transportes');
    }
  };

  const handleEditTransporte = (row: ITransporte): void => {
    setTipoTransporte(row);
    onOpenEdit();
  };

  /* const handleClickShow = useCallback(
      async (id: number) => {
        await updateIdTransporte(id);
  
        history.push(`/showtransporte`);
  
      }
      [updateIdLegislacao, history],
    ); */

  const handleSetActive = useCallback(async (transporte: ITransporte) => {
    try {
      await api.put(`/transportes/${transporte.id_tran}`, {
        situacao_tran: transporte.situacao_tran === '0' ? '1' : '0',
      });
      toast({
        title: 'Sucesso.',
        description: 'Transporte atualizado com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      history.push('/transportes');
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
          '1': 'ATIVO',
          '0': 'INATIVO',
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
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',

          getRow: handleEditTransporte,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',

          getRow: (transporte: any) => {
            setTransporteModal(transporte);
            onOpen();
          },
        },
      ],
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

  const updateTransporte = async ({
    nomeTransporte,
    situacaoTransporte,
  }: IFormTransporte): Promise<void> => {
    await api.put<ITransporte>(`/transportes/${tipoTransporte.id_tran}`, {
      nomeTransporte,
      situacaoTransporte,
    });

    toast({
      title: 'Sucesso!',
      description: 'Transporte Atualizado com sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposTransportes];
    setTiposTransportes(updateArray);
    onCloseEdit();
  };
  return (
    <>
      <>
        <BoxContent>
          <TituloPagina title="Cadastrar Transporte" />
          <form onSubmit={handleSubmit(submitFormData)}>
            <FormGroup name="Transporte">
              <Flex flexDirection="column">
                <Controller
                  name="nomeTransporte"
                  control={control}
                  render={({ onChange, value }) => (
                    <FormInput
                      style={{ minWidth: 350, marginBottom: '10px' }}
                      placeholder="Digite o nome do Transporte"
                      onChange={onChange}
                      register={register}
                      value={value}
                      error={errors.nomeTransporte?.message}
                    />
                  )}
                />
              </Flex>
              <Button color="green" icon={FaSave} type="submit">
                Incluir
              </Button>
            </FormGroup>
          </form>
          <Box maxWidth="calc(100vw - 50px)">
            <DataTable columns={colunas} options={options} />
          </Box>
          {transporteModal && (
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size="lg"
              title="Exclusão de Transporte"
            >
              <h1>
                Você está prestes a deletar um transporte, você tem certeza da
                operação?
              </h1>
              <Flex mt="8" justify="center">
                <HStack spacing="4">
                  <ButtonChacrka onClick={onClose} colorScheme="green">
                    Não
                  </ButtonChacrka>

                  <ButtonChacrka
                    onClick={() => handleExcluirTransporte(transporteModal)}
                    colorScheme="red"
                  >
                    Sim quero deletar!
                  </ButtonChacrka>
                </HStack>
              </Flex>
            </Modal>
          )}
        </BoxContent>
        <Modal
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          size="md"
          title="Editar"
        >
          <form onSubmit={handleSubmitEdit(updateTransporte)}>
            <FormGroup cols={[6, 9, 12]} name="Transporte">
              <Flex flexDirection="column">
                <Controller
                  name="nomeTransporte"
                  defaultValue={tipoTransporte.descricao_tran}
                  control={controlEdit}
                  render={({ onChange, value }) => (
                    <FormInput
                      style={{ minWidth: 350, marginBottom: '10px' }}
                      placeholder="Digite o Transporte"
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
                      value={value}
                      error={errorsEdit.nomeTransporte?.message}
                    />
                  )}
                  error={errorsEdit.nomeTransporte?.message}
                />
              </Flex>
            </FormGroup>
            <FormGroup cols={[6, 9, 12]} name="Situação" required>
              <Controller
                name="situacaoTransporte"
                defaultValue={tipoTransporte.situacao_tran}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione..."
                    optionsSelect={orderOptions(optionsSituacaoTransporte)}
                    value={optionsSituacaoTransporte.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType, false>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.situacaoTransporte?.message}
                  />
                )}
              />
            </FormGroup>

            <Button color="green" icon={FaSave} type="submit">
              Salvar
            </Button>
          </form>
        </Modal>
      </>
    </>
  );
};

export default ListTransporte;
