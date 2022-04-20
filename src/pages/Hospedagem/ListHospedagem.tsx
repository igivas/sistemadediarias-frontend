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

interface IHospedagem {
  id_hosp: number;
  descricao_hosp: string;
  situacao_hosp: string;
  usuario_cadastro: string;
  data_cadastro: string;
  usuario_alteracao: string;
  data_alteracao: string;
}

interface IFormHospedagem {
  nomeHospedagem: string;
  situacaoHospedagem: string;
}

type OptionType = { label: string; value: string };

const optionsSituacaoHospedagem = [
  { value: '0', label: 'INATIVO' },
  { value: '1', label: 'ATIVO' },
];

const ListHospedagem: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();
  const [hospedagemModal, setHospedagemModal] = useState<IHospedagem>();
  const [tiposHospedagens, setTiposHospedagens] = useState<IHospedagem[]>([]);
  const [tipoHospedagem, setTipoHospedagem] = useState<IHospedagem>(
    {} as IHospedagem,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const schema = Yup.object().shape({
    nomeHospedagem: Yup.string()
      .required('Campo obrigatório')
      .min(3, 'Nome muito curto'),
  });

  const { handleSubmit, errors, control, setValue } = useForm<IFormHospedagem>({
    resolver: yupResolver(schema),
    defaultValues: {
      nomeHospedagem: undefined,
      situacaoHospedagem: undefined,
    },
  });

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormHospedagem>({
    defaultValues: {
      nomeHospedagem: undefined,
      situacaoHospedagem: undefined,
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
      setValue('nomeHospedagem', '');
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
      onClose();
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
      onClose();
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

  const handleEditHospedagem = (row: IHospedagem): void => {
    setTipoHospedagem(row);
    onOpenEdit();
  };

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
          '1': 'ATIVO',
          '0': 'INATIVO',
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
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',

          getRow: handleEditHospedagem,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',

          getRow: (hospedagem: any) => {
            setHospedagemModal(hospedagem);
            onOpen();
          },
        },
      ],
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

  const updateHospedagem = async ({
    nomeHospedagem,
    situacaoHospedagem,
  }: IFormHospedagem): Promise<void> => {
    await api.put<IHospedagem>(`/hospedagens/${tipoHospedagem.id_hosp}`, {
      nomeHospedagem,
      situacaoHospedagem,
    });

    toast({
      title: 'Sucesso!',
      description: 'Hospedagem Atualizada com Sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposHospedagens];

    setTiposHospedagens(updateArray);
    onCloseEdit();
  };
  return (
    <>
      <>
        <BoxContent>
          <TituloPagina title="Cadastrar Hospedagem" />
          <form onSubmit={handleSubmit(submitFormData)}>
            <FormGroup name="Hospedagem">
              <Flex flexDirection="column">
                <Controller
                  name="nomeHospedagem"
                  control={control}
                  render={({ onChange, value }) => (
                    <FormInput
                      style={{ minWidth: 350, marginBottom: '10px' }}
                      placeholder="Digite o nome da Hospedagem"
                      onChange={onChange}
                      register={register}
                      value={value}
                      error={errors.nomeHospedagem?.message}
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
          {hospedagemModal && (
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              size="lg"
              title="Exclusão de Hospedagem"
            >
              <h1>
                Você está prestes a deletar uma hospedagem, você tem certeza da
                operação?
              </h1>
              <Flex mt="8" justify="center">
                <HStack spacing="4">
                  <ButtonChacrka onClick={onCloseEdit} colorScheme="green">
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
        <Modal
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          size="md"
          title="Editar"
        >
          <form onSubmit={handleSubmitEdit(updateHospedagem)}>
            <FormGroup cols={[6, 9, 12]} name="Hospedagem">
              <Flex flexDirection="column">
                <Controller
                  name="nomeHospedagem"
                  defaultValue={tipoHospedagem.descricao_hosp}
                  control={controlEdit}
                  render={({ onChange, value }) => (
                    <FormInput
                      style={{ minWidth: 350, marginBottom: '10px' }}
                      placeholder="Digite a Hospedagem"
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
                      value={value}
                      error={errorsEdit.nomeHospedagem?.message}
                    />
                  )}
                  error={errorsEdit.nomeHospedagem?.message}
                />
              </Flex>
            </FormGroup>
            <FormGroup cols={[6, 9, 12]} name="Situação" required>
              <Controller
                name="situacaoHospedagem"
                defaultValue={tipoHospedagem.situacao_hosp}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione ..."
                    optionsSelect={orderOptions(optionsSituacaoHospedagem)}
                    value={optionsSituacaoHospedagem.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType, false>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.situacaoHospedagem?.message}
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

export default ListHospedagem;
