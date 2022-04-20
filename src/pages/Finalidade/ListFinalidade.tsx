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

interface IFinalidade {
  id_fin: number;
  descricao_fin: string;
  situacao_fin: string;
  usuario_cadastro: string;
  data_cadastro: string;
  usuario_alteracao: string;
  data_alteracao: string;
}

interface IFormFinalidade {
  nomeFinalidade: string;
  situacaoFinalidade: string;
}

type OptionType = { label: string; value: string };

const optionsSituacaoFinalidade = [
  { value: '0', label: 'INATIVA' },
  { value: '1', label: 'ATIVA' },
];

const schema = Yup.object().shape({
  nomeFinalidade: Yup.string()
    .required('Campo obrigatório')
    .min(3, 'Nome muito curto'),
});

const ListFinalidade: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();
  const [finalidadeModal, setFinalidadeModal] = useState<IFinalidade>();
  const [tiposFinalidades, setTiposFinalidades] = useState<IFinalidade[]>([]);
  const [tipoFinalidade, setTipoFinalidade] = useState<IFinalidade>(
    {} as IFinalidade,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const { handleSubmit, errors, control, setValue } = useForm<IFormFinalidade>({
    resolver: yupResolver(schema),
    defaultValues: {
      nomeFinalidade: undefined,
    },
  });

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormFinalidade>({
    defaultValues: {
      nomeFinalidade: undefined,
      situacaoFinalidade: undefined,
    },
    resolver: yupResolver(schema),
  });

  const submitFormData = async (data: any): Promise<void> => {
    const dados = {
      ...data,
      descricao_fin: String(data.nomeFinalidade).toUpperCase(),
      usuario_cadastro: user.matricula,
      situacao_fin: '1',
      deletado_fin: '0',
    };

    try {
      await api.post('/finalidades', dados);
      toast({
        title: 'Sucesso.',
        description: 'Legislação inserida com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setValue('nomeFinalidade', '');
      history.push('/finalidades');
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

  const handleExcluirFinalidade = async (data: IFinalidade): Promise<any> => {
    try {
      await api.put(`/finalidades/deletar/${data.id_fin}`);

      toast({
        title: 'Sucesso.',
        description: 'Finalidade excluída com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/finalidades');
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
      history.push('/finalidades');
    }
  };

  /* const handleClickShow = useCallback(
      async (id: number) => {
        await updateIdLegislacao(id);
  
        history.push(`/showlegislacao`);
  
      }
      [updateIdLegislacao, history],
    ); */

  const handleSetActive = useCallback(async (finalidade: IFinalidade) => {
    try {
      await api.put(`/finalidades/${finalidade.id_fin}`, {
        situacao_fin: finalidade.situacao_fin === '0' ? '1' : '0',
      });
      toast({
        title: 'Sucesso.',
        description: 'Finalidade atualizada com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      history.push('/finalidades');
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

  const handleEditFinalidade = (row: IFinalidade): void => {
    setTipoFinalidade(row);
    onOpenEdit();
  };

  const colunas: IColumns = [
    {
      field: 'descricao_fin',
      text: 'Finalidade',
      type: {
        name: 'text',
      },
    },
    {
      field: 'situacao_fin',
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
      url: `/finalidades`,
      headers: { Authorization: api.defaults.headers.autohorization },
      serverPagination: true,
    },
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',
          getRow: handleEditFinalidade,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',

          getRow: (finalidade: any) => {
            setFinalidadeModal(finalidade);
            onOpen();
          },
        },
      ],
    },

    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['nomeFinalidade'],
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

  const updateFinalidade = async ({
    nomeFinalidade,
    situacaoFinalidade,
  }: IFormFinalidade): Promise<void> => {
    await api.put<IFinalidade>(`/finalidades/${tipoFinalidade.id_fin}`, {
      nomeFinalidade,
      situacaoFinalidade,
    });

    toast({
      title: 'Sucesso!',
      description: 'Finalidade Atualizada com Sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposFinalidades];

    setTiposFinalidades(updateArray);
    onCloseEdit();
  };
  return (
    <>
      <BoxContent>
        <TituloPagina title="Cadastrar Finalidade" />
        <form onSubmit={handleSubmit(submitFormData)}>
          <FormGroup name="Finalidade">
            <Flex flexDirection="column">
              <Controller
                name="nomeFinalidade"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    style={{ minWidth: 350, marginBottom: '10px' }}
                    placeholder="Digite o nome da Finalidade"
                    onChange={onChange}
                    register={register}
                    value={value}
                    error={errors.nomeFinalidade?.message}
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
        {finalidadeModal && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Exclusão de Finalidade"
          >
            <h1>
              Você está prestes a deletar uma finalidade, você tem certeza da
              operação?
            </h1>
            <Flex mt="8" justify="center">
              <HStack spacing="4">
                <ButtonChacrka onClick={onClose} colorScheme="green">
                  Não
                </ButtonChacrka>

                <ButtonChacrka
                  onClick={() => handleExcluirFinalidade(finalidadeModal)}
                  colorScheme="red"
                >
                  Sim quero deletar!
                </ButtonChacrka>
              </HStack>
            </Flex>
          </Modal>
        )}
      </BoxContent>
      <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size="md" title="Editar">
        <form onSubmit={handleSubmitEdit(updateFinalidade)}>
          <FormGroup name="Finalidade">
            <Flex flexDirection="column">
              <Controller
                name="nomeFinalidade"
                defaultValue={tipoFinalidade.descricao_fin}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <FormInput
                    style={{ minWidth: 350, marginBottom: '10px' }}
                    placeholder="Digite o nome da Finalidade"
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    value={value}
                    error={errorsEdit.nomeFinalidade?.message}
                  />
                )}
                error={errorsEdit.nomeFinalidade?.message}
              />
            </Flex>
            <FormGroup cols={[6, 9, 12]} name="Situação" required>
              <Controller
                name="situacaoFinalidade"
                defaultValue={tipoFinalidade.situacao_fin}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione..."
                    optionsSelect={orderOptions(optionsSituacaoFinalidade)}
                    value={optionsSituacaoFinalidade.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType, false>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.situacaoFinalidade?.message}
                  />
                )}
              />
            </FormGroup>
            <Button color="green" icon={FaSave} type="submit">
              Salvar
            </Button>
          </FormGroup>
        </form>
      </Modal>
    </>
  );
};

export default ListFinalidade;
