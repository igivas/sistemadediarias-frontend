import {
  useToast,
  useDisclosure,
  Flex,
  HStack,
  Button as ButtonChacrka,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGroup from 'components/form/FormGroup';
import BoxContent from 'components/BoxContent';
import Button from 'components/form/Button';
import { Container } from 'components/form/FormGroup/styles';
import Row from 'components/form/Row';
import { Form } from 'components/ModalAssinatura/styles';
import PanelBottomActions from 'components/PanelBottomActions';
import TituloPagina from 'components/TituloPagina';
import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  FaEraser,
  FaSave,
  FaTimes,
  FaSearch,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { ValueType } from 'react-select';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../contexts/auth';
import ReactSelect from '../../components/form/ReactSelect';
import FormInput from '../../components/form/FormInput';
import DataTable, { IColumns } from '../../components/DataTable';
import InputCurrency from '../../components/form/InputCurrency';
import Modal from '../../components/Modal';

interface IClasse {
  id_cla: number;
  id_leg: number;
  descricao_cla: string;
  valor_intermun_cla: number;
  valor_interesta_cla: number;
  valor_internac_cla: number;
  situacao_cla: string;
  usuario_cadastro: string;
  usuario_alteracao: string;
}

type IFormClasse = {
  legislacaoClasse: number;
  nomeClasse: string;
  valorIntermunClasse: number;
  valorInterestaClasse: number;
  valorInternClasse: number;
  situacaoClasse: string;
};

type OptionType = { label: string; value: string };

interface ILegislacao {
  id_leg: number;
  decreto_leg: string;
  situacao_leg: string;
  usuario_cadastro: string;
  usuario_alteracao: string;
  data_cadastro: string;
  data_alteracao: string;
}

const optionsSituacaoClasse = [
  { value: '0', label: 'Inativo' },
  { value: '1', label: 'Ativo' },
];

type IProps = {
  disabled: boolean;
  action: 'editar' | 'cadastrar';
};

const schemaClasse = Yup.object().shape({
  legislacaoClasse: Yup.number().required('Campo Obrigatório'),
  nomeClasse: Yup.string().required('Campo obrigatório'),
  valorIntermunClasse: Yup.number().required('Campo Obrigatório'),
  valorInterestaClasse: Yup.number().required('Campo Obrigatório'),
  valorInternClasse: Yup.number().required('Campo Obrigatório'),
});

const ListClasse: React.FC<IProps> = () => {
  const history = useHistory();
  const toast = useToast();
  const { signOut } = useAuth();
  const [classeModal, setClasseModal] = useState<IClasse>();
  const [tipoClasse, setTipoClasse] = useState<IClasse>();
  const [tiposClasses, setTiposClasses] = useState<IClasse[]>([]);
  const {
    control,
    handleSubmit,
    errors,
    reset,
    setValue,
  } = useForm<IFormClasse>({
    resolver: yupResolver(schemaClasse),
    defaultValues: {
      legislacaoClasse: 0,
      nomeClasse: '',
      valorIntermunClasse: 0,
      valorInterestaClasse: 0,
      valorInternClasse: 0,
    },
  });

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormClasse>({
    defaultValues: {
      legislacaoClasse: undefined,
      nomeClasse: undefined,
      valorIntermunClasse: undefined,
      valorInterestaClasse: undefined,
      valorInternClasse: undefined,
      situacaoClasse: undefined,
    },
    resolver: yupResolver(schemaClasse),
  });
  console.log(errorsEdit);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const [optionsFinalidades, setOptionsFinalidades] = useState<OptionType[]>(
    [],
  );

  const [optionsLegislacoes, setOptionsLegislacoes] = useState<OptionType[]>(
    [],
  );

  const onSubmit = async (data: IFormClasse): Promise<void> => {
    const dados = {
      id_leg: Number(data.legislacaoClasse),
      descricao_cla: String(data.nomeClasse).toUpperCase(),
      valor_intermun_cla: Number(data.valorIntermunClasse),
      valor_interesta_cla: Number(data.valorInterestaClasse),
      valor_internac_cla: Number(data.valorInternClasse),
      situacao_cla: '1',
      deletado_cla: '0',
    };

    try {
      await api.post('classes', dados);

      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      reset({
        legislacaoClasse: 0,
        nomeClasse: '',
        valorIntermunClasse: 0,
        valorInterestaClasse: 0,
        valorInternClasse: 0,
      });

      history.push('/classes');
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            signOut();
            break;
          default:
            toast({
              title: 'Erro inesperado.',
              description: error.response.data.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            break;
        }
      }
    }
  };

  const handleEditClasse = (row: IClasse): void => {
    setTipoClasse(row);
    onOpenEdit();
  };

  const handleExcluirClasse = async (data: IClasse): Promise<any> => {
    try {
      await api.put(`/classes/deletar/${data.id_cla}`);

      toast({
        title: 'Sucesso',
        description: 'Classe Excluída com Sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/classes');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/classes');
    }
  };

  useEffect(() => {
    const loadLegislacoes = async (): Promise<void> => {
      const {
        data: { items: legislacoes },
      } = await api.get<{ items: ILegislacao[] }>('legislacoes');
      setOptionsLegislacoes(
        legislacoes
          .filter((legislacao) => legislacao.situacao_leg === '1')
          .map((legislacao) => ({
            label: legislacao.decreto_leg,
            value: legislacao.id_leg.toString(),
          })),
      );
    };

    loadLegislacoes();
  }, []);

  const colunas: IColumns = [
    {
      field: 'legislacao.decreto_leg',
      text: 'Legislação',
      type: { name: 'text' },
    },
    {
      field: 'descricao_cla',
      text: 'Classe',
      type: { name: 'text' },
    },
    {
      field: 'valor_intermun_cla',
      text: 'Valor Diária Intermunicipal',
      type: { name: 'currency' },
    },
    {
      field: 'valor_interesta_cla',
      text: 'Valor Diária Interestadual',
      type: { name: 'currency' },
    },
    {
      field: 'valor_internac_cla',
      text: 'Valor Diária Internacional',
      type: { name: 'currency' },
    },
    {
      field: 'situacao_cla',
      text: 'Situação',
      type: {
        name: 'enum',
        enum: {
          '0': 'INATIVO',
          '1': 'ATIVO',
        },
      },
    },
  ];

  const options = {
    serverData: {
      url: `/classes`,
      headers: { authorization: api.defaults.headers.authorization },
      serverPagination: true,
    },
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',
          getRow: handleEditClasse,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',
          getRow: (classe: any) => {
            setClasseModal(classe);
            onOpen();
          },
        },
      ],
    },
    search: {
      searchable: true,
      label: 'Pesquisar',
      fields: ['nomeClasse'],
      cols: [3, 6, 12] as [number, number, number],
    },
    columnOrder: {
      visible: true,
      label: 'Ordem',
    },
  };

  const updateClasse = async ({
    nomeClasse,
    legislacaoClasse,
    valorIntermunClasse,
    valorInterestaClasse,
    valorInternClasse,
    situacaoClasse,
  }: IFormClasse): Promise<void> => {
    await api.put<IClasse>(`/classes/${tipoClasse?.id_cla}`, {
      nomeClasse,
      legislacaoClasse,
      valorIntermunClasse,
      valorInterestaClasse,
      valorInternClasse,
      situacaoClasse,
    });

    toast({
      title: 'Sucesso!',
      description: 'Classe atualizada com sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposClasses];

    setTiposClasses(updateArray);

    onCloseEdit();
  };

  return (
    <Container>
      <TituloPagina title="Cadastro de Classe" />
      <BoxContent>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup cols={[3, 9, 12]} name="Classe" required>
                <Controller
                  name="nomeClasse"
                  control={control}
                  as={<FormInput error={errors.nomeClasse?.message} />}
                />
              </FormGroup>
              <FormGroup required name="Legislação" cols={[6, 9, 12]}>
                <Controller
                  name="legislacaoClasse"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione ..."
                      optionsSelect={optionsLegislacoes}
                      onChange={(option: OptionType) => {
                        onChange(Number(option.value));
                      }}
                      value={optionsLegislacoes.find(
                        (option) => option.value === value?.toString(),
                      )}
                      error={errors.legislacaoClasse?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup
                required
                name="Valor Diária Intermunicipal"
                cols={[3, 9, 12]}
              >
                <Controller
                  name="valorIntermunClasse"
                  control={control}
                  render={({ onChange, value }) => (
                    <InputCurrency
                      value={value}
                      onChange={(e, value2) => onChange(value2)}
                      error={errors.valorIntermunClasse?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                required
                name="Valor Diária Interestadual"
                cols={[3, 9, 12]}
              >
                <Controller
                  name="valorInterestaClasse"
                  control={control}
                  render={({ onChange, value }) => (
                    <InputCurrency
                      value={value}
                      onChange={(e, value3) => onChange(value3)}
                      error={errors.valorInterestaClasse?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                required
                name="Valor Diária Internacional"
                cols={[3, 9, 12]}
              >
                <Controller
                  name="valorInternClasse"
                  control={control}
                  render={({ onChange, value }) => (
                    <InputCurrency
                      value={value}
                      onChange={(e, value4) => onChange(value4)}
                      error={errors.valorInternClasse?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <PanelBottomActions>
              <Button color="green" icon={FaSave} type="submit">
                Incluir
              </Button>
            </PanelBottomActions>
          </Form>
        </div>
        <hr />
        <br />
        <br />

        <div>
          <DataTable columns={colunas} options={options} />
        </div>
        {classeModal && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Exclusão de Classe"
          >
            <h1>
              Você está prestes a deletar uma Classe, você tem certeza da
              operação?
            </h1>
            <Flex mt="8" justify="center">
              <HStack sapcing="4">
                <ButtonChacrka onClick={onClose} colorScheme="green">
                  Não
                </ButtonChacrka>

                <ButtonChacrka
                  onClick={() => handleExcluirClasse(classeModal)}
                  colorScheme="red"
                >
                  Sim, quero deletar!
                </ButtonChacrka>
              </HStack>
            </Flex>
          </Modal>
        )}
      </BoxContent>
      <Modal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        size="lg"
        title="Editar Classe"
      >
        <form onSubmit={handleSubmitEdit(updateClasse)}>
          <FormGroup cols={[9, 9, 12]} name="Classe" required>
            <Controller
              name="nomeClasse"
              defaultValue={tipoClasse?.descricao_cla}
              control={controlEdit}
              render={({ onChange, value }) => (
                <FormInput
                  onChange={(e) => onChange(e.target.value.toUpperCase())}
                  value={value}
                  error={errorsEdit.nomeClasse?.message}
                />
              )}
            />
          </FormGroup>
          <FormGroup name="Legislação" cols={[9, 9, 12]} required>
            <Controller
              name="legislacaoClasse"
              defaultValue={tipoClasse?.id_leg}
              control={controlEdit}
              render={({ onChange, value }) => (
                <ReactSelect
                  placeholder="Selecione ..."
                  optionsSelect={optionsLegislacoes}
                  onChange={(option: OptionType) => {
                    onChange(Number(option.value));
                  }}
                  value={optionsLegislacoes.find(
                    (option) => option.value === value?.toString(),
                  )}
                  error={errors.legislacaoClasse?.message}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            name="Valor Diária Intermunicipal"
            cols={[9, 9, 12]}
            required
          >
            <Controller
              name="valorIntermunClasse"
              defaultValue={Number(tipoClasse?.valor_intermun_cla)}
              control={controlEdit}
              render={({ onChange, value }) => (
                <InputCurrency
                  value={value}
                  onChange={(e, value2) => onChange(value2)}
                  error={errors.valorIntermunClasse?.message}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            name="Valor Diária Interestadual"
            cols={[9, 9, 12]}
            required
          >
            <Controller
              name="valorInterestaClasse"
              defaultValue={Number(tipoClasse?.valor_interesta_cla)}
              control={controlEdit}
              render={({ onChange, value }) => (
                <InputCurrency
                  value={value}
                  onChange={(e, value3) => onChange(value3)}
                  error={errors.valorInterestaClasse?.message}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            name="Valor Diária Internacional"
            cols={[9, 9, 12]}
            required
          >
            <Controller
              name="valorInternClasse"
              defaultValue={Number(tipoClasse?.valor_internac_cla)}
              control={controlEdit}
              render={({ onChange, value }) => (
                <InputCurrency
                  value={value}
                  onChange={(e, value4) => onChange(value4)}
                  error={errors.valorInternClasse?.message}
                />
              )}
              error={errorsEdit.valorInternClasse?.message}
            />
          </FormGroup>

          <FormGroup cols={[6, 9, 12]} name="Situação" required>
            <Controller
              name="situacaoClasse"
              defaultValue={tipoClasse?.situacao_cla}
              control={controlEdit}
              render={({ onChange, value }) => (
                <ReactSelect
                  placeholder="Selecione..."
                  optionsSelect={orderOptions(optionsSituacaoClasse)}
                  value={optionsSituacaoClasse.find(
                    (option) => option.value === value,
                  )}
                  onChange={(option: ValueType<OptionType, false>) => {
                    const optionSelected = option as OptionType;
                    onChange(optionSelected.value);
                  }}
                  error={errors.situacaoClasse?.message}
                />
              )}
            />
          </FormGroup>
          <Button color="green" icon={FaSave} type="submit">
            Salvar
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default ListClasse;
