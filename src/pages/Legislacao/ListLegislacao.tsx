import {
  Box,
  Flex,
  HStack,
  useDisclosure,
  useToast,
  Button as ButtonChacrka,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEdit, FaSave, FaSearch, FaTrash } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { IGetLegislacoes } from 'interfaces/Response/IGetLegislacoes';
import ReactSelect from 'components/form/ReactSelect';
import { ValueType } from 'react-select';
import { useCallback } from 'react';
import api from '../../services/api';
import FormInput from '../../components/form/FormInput';
import { useAuth } from '../../contexts/auth';
import BoxContent from '../../components/BoxContent';
import TituloPagina from '../../components/TituloPagina';
import Button from '../../components/form/Button';
import DataTable, { IColumns } from '../../components/DataTable';
import FormGroup from '../../components/form/FormGroup';
import Modal from '../../components/Modal';

interface ILegislacao {
  id_leg: number;
  decreto_leg: string;
  situacao_leg: string;
  usuario_cadastro: string;
  usuario_alteracao: string;
}

interface IFormLegislacao {
  nomeLegislacao: string;
  situacaoLegislacao: string;
}

type OptionType = { label: string; value: string };

const optionsSituacaoHospedagem = [
  { value: '0', label: 'Inativo' },
  { value: '1', label: 'Ativo' },
];

const schema = Yup.object().shape({
  nomeLegislacao: Yup.string().required('Campo Obrigatório'),
});

const ListLegislacao: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();
  const [legislacaoModal, setlegislacaoModal] = useState<ILegislacao>();
  const [dadosLegislacao, setDadosLegislacao] = useState<IGetLegislacoes>();
  const [tiposLegislacoes, setTiposLegislacoes] = useState<ILegislacao[]>([]);
  const [tipoLegislacao, setTipoLegislacao] = useState<ILegislacao>(
    {} as ILegislacao,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const { errors, control, handleSubmit, setValue } = useForm<IFormLegislacao>({
    defaultValues: {
      nomeLegislacao: undefined,
    },
    resolver: yupResolver(schema),
  });

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormLegislacao>({
    defaultValues: {
      nomeLegislacao: undefined,
      situacaoLegislacao: undefined,
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
      decreto_leg: String(data.nomeLegislacao).toUpperCase(),
      usuario_cadastro: user.matricula,
      situacao_leg: '1',
      deletado_leg: '0',
    };

    try {
      await api.post('/legislacoes', dados);

      toast({
        title: 'Sucesso.',
        description: 'Legislação inserida com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setValue('nomeLegislacao', '');
      history.push('/legislacoes');
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

  const handleExcluirLegislacao = async (data: ILegislacao): Promise<any> => {
    try {
      await api.put(`/legislacoes/deletar/${data.id_leg}`);

      toast({
        title: 'Sucesso.',
        description: 'Legislação excluída com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/legislacoes');
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
      history.push('/legislacoes');
    }
  };

  const handleEditLegislacao = (row: ILegislacao): void => {
    setTipoLegislacao(row);
    onOpenEdit();
  };

  const colunas: IColumns = [
    {
      field: 'decreto_leg',
      text: 'Decreto',
      type: { name: 'text' },
    },
    {
      field: 'situacao_leg',
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
      url: `/legislacoes`,
      headers: { Authorization: api.defaults.headers.autohorization },
      serverPagination: true,
    },
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',

          getRow: handleEditLegislacao,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',

          getRow: (legislacao: any) => {
            setlegislacaoModal(legislacao);
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

  const updateLegilacao = async ({
    nomeLegislacao,
    situacaoLegislacao,
  }: IFormLegislacao): Promise<void> => {
    await api.put<ILegislacao>(`/legislacoes/${tipoLegislacao.id_leg}`, {
      nomeLegislacao,
      situacaoLegislacao,
    });

    toast({
      title: 'Sucesso!',
      description: 'Legislação atualizado com sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposLegislacoes];

    setTiposLegislacoes(updateArray);
    onCloseEdit();
  };

  return (
    <>
      <BoxContent>
        <TituloPagina title="Cadastrar Legislação" />

        <form onSubmit={handleSubmit(submitFormData)}>
          <FormGroup name="Legislação">
            <Flex flexDirection="column">
              <Controller
                name="nomeLegislacao"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    style={{ minWidth: 350, marginBottom: '10px' }}
                    placeholder="Digite o nome da Legislação"
                    onChange={onChange}
                    value={value}
                    error={errors.nomeLegislacao?.message}
                  />
                )}
                error={errors.nomeLegislacao?.message}
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
        {legislacaoModal && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Exclusão de Legislação"
          >
            <h1>
              Você está prestes a deletar uma legislação, você tem certeza da
              operação?
            </h1>
            <Flex mt="8" justify="center">
              <HStack spacing="4">
                <ButtonChacrka onClick={onClose} colorScheme="green">
                  Não
                </ButtonChacrka>

                <ButtonChacrka
                  onClick={() => handleExcluirLegislacao(legislacaoModal)}
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
        <form onSubmit={handleSubmitEdit(updateLegilacao)}>
          <FormGroup cols={[6, 9, 12]} name="Legislação">
            <Flex flexDirection="column">
              <Controller
                name="nomeLegislacao"
                defaultValue={tipoLegislacao.decreto_leg}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <FormInput
                    style={{ minWidth: 350, marginBottom: '10px' }}
                    placeholder="Digite o nome da Legislação"
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    value={value}
                    error={errorsEdit.nomeLegislacao?.message}
                  />
                )}
                error={errorsEdit.nomeLegislacao?.message}
              />
            </Flex>
          </FormGroup>
          <FormGroup cols={[6, 9, 12]} name="Situação" required>
            <Controller
              name="situacaoLegislacao"
              defaultValue={tipoLegislacao.situacao_leg}
              control={controlEdit}
              render={({ onChange, value }) => (
                <ReactSelect
                  placeholder="Selecione..."
                  optionsSelect={orderOptions(optionsSituacaoHospedagem)}
                  value={optionsSituacaoHospedagem.find(
                    (option) => option.value === value,
                  )}
                  onChange={(option: ValueType<OptionType, false>) => {
                    const optionSelected = option as OptionType;
                    onChange(optionSelected.value);
                  }}
                  error={errors.situacaoLegislacao?.message}
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
  );
};

export default ListLegislacao;
