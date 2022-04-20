import {
  useToast,
  useDisclosure,
  Flex,
  HStack,
  Button as ButtonChacrka,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
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
import TituloPagina from '../../components/TituloPagina';
import PanelBottomActions from '../../components/PanelBottomActions';
import { Form } from '../../components/ModalAssinatura/styles';
import Row from '../../components/form/Row';
import { Container } from '../../components/form/FormGroup/styles';
import BoxContent from '../../components/BoxContent';
import Button from '../../components/form/Button';
import FormGroup from '../../components/form/FormGroup';
import api from '../../services/api';
import { useAuth } from '../../contexts/auth';
import ReactSelect from '../../components/form/ReactSelect';
import FormInput from '../../components/form/FormInput';
import DataTable, { IColumns } from '../../components/DataTable';
import InputCurrency from '../../components/form/InputCurrency';
import Modal from '../../components/Modal';

interface IClasseCargo {
  id_cla_car: number;
  id_cla: number;
  codigo_cargo: number;
  id_leg: number;
  tipific_cargo: string;
  situacao_cla_car: string;
  usuario_cadastro: string;
}

interface IFormClasseCargo {
  classeCargo: number;
  codigoClasseCargo: number;
  legislacaoClasseCargo: number;
  tipoClasseCargo: string;
  situacaoClasseCargo: string;
}

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

interface ILegislacao {
  id_leg: number;
  decreto_leg: string;
  situacao_leg: string;
  usuario_cadastro: string;
  usuario_alteracao: string;
  data_cadastro: string;
  data_alteracao: string;
}
interface IPostoGrati {
  tipo: string;
  prioridade: number;
  codigo: number;
  cargo: string;
}

type OptionType = { label: string; value: string };

const optionsSituacaoClasseCargo = [
  { value: '0', label: 'Inativo' },
  { value: '1', label: 'Ativo' },
];

const optionsTipoCargo = [
  { value: '1', label: 'POSTO / GRADUAÇÃO' },
  { value: '2', label: 'GRATIFICAÇÃO' },
];

const optionsExeGrad = [
  { value: '1', label: 'SOLDADO' },
  { value: '2', label: 'CABO' },
];

const optionsExeGrati = [
  { value: '1', label: 'ACESSOR' },
  { value: '2', label: 'ORIENTADOR' },
];

type IProps = {
  disabled: boolean;
  action: 'editar' | 'cadastrar';
};

const schemaClasseCargo = Yup.object().shape({
  classeCargo: Yup.number().required('Campo Obrigatório').min(1),
  codigoClasseCargo: Yup.number().required('Campo Obrigatório').min(1),
  legislacaoClasseCargo: Yup.number().required('Campo Obrigatório').min(1),
  tipoClasseCargo: Yup.string().required('Campo Obrigatório'),
});

const ListClasseCargo: React.FC<IProps> = () => {
  const history = useHistory();
  const toast = useToast();
  const { signOut } = useAuth();
  const [tipClasseCargo, setTipClasseCargo] = useState<IClasseCargo>();
  const [tiposClassesCargos, setTiposClassesCargos] = useState<IClasseCargo[]>(
    [],
  );
  const [optionsFinalidades, setOptionsFinalidades] = useState<OptionType[]>(
    [],
  );

  const [optionsLegislacoes, setOptionsLegislacoes] = useState<OptionType[]>(
    [],
  );

  const [optionsClasses, setOptionsClasses] = useState<OptionType[]>([]);
  const [opcoesCargo, setOpcoesCargo] = useState<OptionType[]>([]);
  const [opcoesPostoGrati, setOpcoesPostoGrati] = useState<OptionType[]>([]);
  const [tipoPostoGrati, setTipoPostoGrati] = useState<IPostoGrati[]>([]);

  const {
    control,
    handleSubmit,
    errors,
    reset,
    setValue,
    watch,
  } = useForm<IFormClasseCargo>({
    resolver: yupResolver(schemaClasseCargo),
    defaultValues: {
      classeCargo: undefined,
      codigoClasseCargo: undefined,
      legislacaoClasseCargo: undefined,
      tipoClasseCargo: undefined,
    },
  });

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormClasseCargo>({
    resolver: yupResolver(schemaClasseCargo),
  });

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

  const onSubmit = async (data: IFormClasseCargo): Promise<void> => {
    const dados = {
      id_leg: Number(data.legislacaoClasseCargo),
      id_cla: Number(data.classeCargo),
      codigo_cargo: Number(data.codigoClasseCargo),
      tipific_cargo: String(data.tipoClasseCargo),
      situacao_cla_car: '1',
      deletado_cla_car: '0',
    };

    try {
      await api.post('classesCargos', dados);
      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      reset();

      history.push('/classescargos');
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

  const handleRequestPostGrad = useCallback(async (id: string) => {
    const {
      data: { items },
    } = await api.get<{ items: any[] }>(`/classescargos/posto/${id}`);

    setOpcoesCargo(
      items.map(({ codigo, cargo }) => ({ label: cargo, value: codigo })),
    );
  }, []);

  const handleEditClasseCargo = useCallback(
    async (row: IClasseCargo): Promise<void> => {
      setTipClasseCargo(row);
      handleRequestPostGrad(row.tipific_cargo);

      onOpenEdit();
    },
    [onOpenEdit, handleRequestPostGrad],
  );

  const handleExcluirClasseCargo = async (data: IClasseCargo): Promise<any> => {
    try {
      await api.put(`/classesCargos/deletar/${data.id_cla_car}`);

      toast({
        title: 'Sucesso',
        description: 'Classe Cargo Excluída com Sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      history.push('/classesCargos');
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
      history.push('/classesCargos');
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

  useEffect(() => {
    const loadClasses = async (): Promise<void> => {
      const {
        data: { items: classes },
      } = await api.get<{ items: IClasse[] }>('classes');
      setOptionsClasses(
        classes
          .filter((classe) => classe.situacao_cla === '1')
          .map((classe) => ({
            label: classe.descricao_cla,
            value: classe.id_cla.toString(),
          })),
      );
    };

    loadClasses();
  }, []);

  const colunas: IColumns = [
    {
      field: 'classe.descricao_cla',
      text: 'Classe',
      type: { name: 'text' },
    },
    {
      field: 'legislacao.decreto_leg',
      text: 'Legislação',
      type: { name: 'text' },
    },
    {
      field: 'tipific_cargo',
      text: 'Tipo de Cargo',
      type: {
        name: 'enum',
        enum: {
          '1': 'POSTO / GRADUAÇÃO',
          '2': 'GRATIFICAÇÃO',
        },
      },
    },

    {
      field: 'codigo_cargo',
      text: 'Cargo',
      type: { name: 'text' },
    },
    {
      field: 'situacao_cla_car',
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
      url: `/classescargos`,
      headers: { authorization: api.defaults.headers.authorization },
      serverPagination: true,
    },
    actions: {
      headerText: 'Ações',
      items: [
        {
          icon: <FaEdit size={13} />,
          tooltip: 'Editar',
          getRow: handleEditClasseCargo,
        },
        {
          icon: <FaTrash size={13} />,
          tooltip: 'Deletar',
          getRow: (classeCargo: any) => {
            setTipClasseCargo(classeCargo);
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

  const updateClasseCargo = async ({
    classeCargo,
    codigoClasseCargo,
    legislacaoClasseCargo,
    tipoClasseCargo,
    situacaoClasseCargo,
  }: IFormClasseCargo): Promise<void> => {
    await api.put<IClasseCargo>(
      `/classesCargos/${tipClasseCargo?.id_cla_car}`,
      {
        classeCargo,
        codigoClasseCargo,
        legislacaoClasseCargo,
        tipoClasseCargo,
        situacaoClasseCargo,
      },
    );

    toast({
      title: 'Sucesso!',
      description: 'Classe atualizada com sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    const updateArray = [...tiposClassesCargos];

    setTiposClassesCargos(updateArray);

    onCloseEdit();
  };

  const tipoCargoSelecionado = watch('tipoClasseCargo');

  const handleSelectTipoCargo = useCallback(() => {
    // return tipoCargoSelecionado === '1' ? optionsExeGrad : optionsExeGrati;

    switch (tipoCargoSelecionado) {
      case '1':
        return optionsExeGrad;
      case '2':
        return optionsExeGrati;

      default:
        return [];
    }
  }, [tipoCargoSelecionado]);

  return (
    <Container>
      <TituloPagina title="Cadastro de Classe / Cargo" />
      <BoxContent>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup required name="Classe" cols={[3, 9, 12]}>
                <Controller
                  name="classeCargo"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione ..."
                      optionsSelect={optionsClasses}
                      onChange={(option: OptionType) => {
                        onChange(Number(option.value));
                      }}
                      value={optionsClasses.find(
                        (option) => option.value === value?.toString(),
                      )}
                      error={errors.classeCargo?.message}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup required name="Legislação" cols={[3, 9, 12]}>
                <Controller
                  name="legislacaoClasseCargo"
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
                      error={errors.legislacaoClasseCargo?.message}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup cols={[3, 9, 12]} name="Tipo de Cargo" required>
                <Controller
                  name="tipoClasseCargo"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={optionsTipoCargo}
                      onChange={async (option: OptionType) => {
                        onChange(option.value);
                        setValue('codigoClasseCargo', undefined);
                        await handleRequestPostGrad(option.value);
                      }}
                      value={optionsTipoCargo.find(
                        (option) => option.value === value,
                      )}
                      error={errors.tipoClasseCargo?.message}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup required name="Cargo" cols={[6, 9, 12]}>
                <Controller
                  name="codigoClasseCargo"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={opcoesCargo}
                      onChange={(option: OptionType) => {
                        onChange(option.value);
                      }}
                      value={opcoesCargo.find(
                        (option) => option.value === value,
                      )}
                      error={errors.codigoClasseCargo?.message}
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
        {tipClasseCargo && (
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
                  onClick={() => handleExcluirClasseCargo(tipClasseCargo)}
                  colorScheme="red"
                >
                  Sim, quero deletar!
                </ButtonChacrka>
              </HStack>
            </Flex>
          </Modal>
        )}
      </BoxContent>
      {tipClasseCargo && (
        <Modal
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          size="lg"
          title="Editar Classe / Cargo"
        >
          <form onSubmit={handleSubmitEdit(updateClasseCargo)}>
            <FormGroup required name="Classe" cols={[9, 9, 12]}>
              <Controller
                name="classeCargo"
                defaultValue={tipClasseCargo?.id_cla}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione ..."
                    optionsSelect={optionsClasses}
                    onChange={(option: OptionType) => {
                      onChange(Number(option.value));
                    }}
                    value={optionsClasses.find(
                      (option) => option.value === value?.toString(),
                    )}
                    error={errors.classeCargo?.message}
                  />
                )}
              />
            </FormGroup>

            <FormGroup name="Legislação" cols={[9, 9, 12]} required>
              <Controller
                name="legislacaoClasseCargo"
                defaultValue={tipClasseCargo?.id_leg}
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
                    error={errors.legislacaoClasseCargo?.message}
                  />
                )}
              />
            </FormGroup>

            <FormGroup cols={[9, 9, 12]} name="Tipo de Cargo" required>
              <Controller
                name="tipoClasseCargo"
                control={controlEdit}
                defaultValue={tipClasseCargo?.tipific_cargo}
                render={({ onChange, value }) => (
                  <>
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={optionsTipoCargo}
                      onChange={(option: OptionType) => {
                        onChange(option.value);
                        setValueEdit('codigoClasseCargo', undefined);
                        handleRequestPostGrad(option.value);
                      }}
                      value={optionsTipoCargo.find((option) => {
                        return option.value === value?.toString();
                      })}
                      error={errorsEdit.tipoClasseCargo?.message}
                    />
                  </>
                )}
              />
            </FormGroup>

            <FormGroup required name="Cargo" cols={[9, 9, 12]}>
              <Controller
                name="codigoClasseCargo"
                control={controlEdit}
                // defaultValue={tipClasseCargo?.codigo_cargo}
                defaultValue={tipClasseCargo?.codigo_cargo}
                render={({ onChange, value }) => (
                  <>
                    {console.log(
                      opcoesCargo.find(
                        (option) => option.value === value?.toString(),
                      ),
                    )}

                    {console.log({ value, opcoesCargo })}
                    <ReactSelect
                      placeholder="Selecione..."
                      optionsSelect={opcoesCargo}
                      onChange={(option: OptionType) => {
                        onChange(option.value);
                      }}
                      value={opcoesCargo.find(
                        (option) => option.value === value,
                      )}
                      error={errors.codigoClasseCargo?.message}
                    />
                  </>
                )}
              />
            </FormGroup>

            <FormGroup cols={[9, 9, 12]} name="Situação" required>
              <Controller
                name="situacaoClasse"
                defaultValue={tipClasseCargo?.situacao_cla_car}
                control={controlEdit}
                render={({ onChange, value }) => (
                  <ReactSelect
                    placeholder="Selecione..."
                    optionsSelect={orderOptions(optionsSituacaoClasseCargo)}
                    value={optionsSituacaoClasseCargo.find(
                      (option) => option.value === value,
                    )}
                    onChange={(option: ValueType<OptionType, false>) => {
                      const optionSelected = option as OptionType;
                      onChange(optionSelected.value);
                    }}
                    error={errors.situacaoClasseCargo?.message}
                  />
                )}
              />
            </FormGroup>

            <Button color="green" icon={FaSave} type="submit">
              Salvar
            </Button>
          </form>
        </Modal>
      )}
      ,
    </Container>
  );
};

export default ListClasseCargo;
