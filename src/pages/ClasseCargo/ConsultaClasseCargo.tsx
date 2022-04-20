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

const ConsultaClasseCargo: React.FC<IProps> = () => {
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

  useEffect(() => {
    const loadPostoGrati = async (): Promise<void> => {
      const {
        data: { items: postosGrati },
        // } = await api.get<{ items: IPostoGrati[] }>(`classescargos/posto`);
      } = await api.get<{ items: IClasse[] }>('classes');
      setOpcoesPostoGrati(
        postosGrati.map((postoGrati) => ({
          // label: postoGrati.cargo,
          // value: postoGrati.codigo.toString(),

          label: postoGrati.descricao_cla,
          value: postoGrati.id_cla.toString(),
        })),
      );
    };
    loadPostoGrati();
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

  return (
    <Container>
      <TituloPagina title="Consulta de Classe / Cargo" />
      <BoxContent>
        <div>
          <DataTable columns={colunas} options={options} />
        </div>
      </BoxContent>
    </Container>
  );
};

export default ConsultaClasseCargo;
