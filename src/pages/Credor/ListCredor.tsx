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
import debounce from 'debounce-promise';
import FormInput from '../../components/form/FormInput';
import InputNumberFormat from '../../components/form/InputNumberFormat';
import { useAuth } from '../../contexts/auth';
import BoxContent from '../../components/BoxContent';
import TituloPagina from '../../components/TituloPagina';
import Button from '../../components/form/Button';
import DataTable, { IColumns } from '../../components/DataTable';
import FormGroup from '../../components/form/FormGroup';
import Modal from '../../components/Modal';
import ReactSelect from '../../components/form/ReactSelect';
import AsyncSelect from '../../components/form/AsyncSelect';

interface IDadosPm {
  matricula: string;
  dados: string;
  pm_num_credor: number;
}

interface IFormCredor {
  numCredorPm: number;
  matriculaPm: string;
}

type OptionType = { label: string; value: string; matricula: string };

const schemaCredor = Yup.object().shape({
  matriculaPm: Yup.string()
    .required('Campo obrigatório')
    .min(3, 'Nome muito curto'),
  numCredorPm: Yup.number()
    .required('Campo Obrigatório')
    .typeError('Campo Obrigatório'),
});

const ListCredor: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const toast = useToast();

  const [pmSelecionado, setPmSelecionado] = useState<OptionType>();
  const [numCredor, setNumCredor] = useState<number>();

  /*
  const pmsFiltrados = useCallback(async (dados: string) => {
    const { data } = await api.get<{ items: IDadosPm[] }>(`/credores`);
    return data.items.map((credor) => {
      return {
        label: credor.dados,
        value: credor.pm_num_credor.toString(),
      };
    });
  }, []); */

  const pmsFiltrados = useCallback(async (dados: string) => {
    const { data } = await api.get<{ items: IDadosPm[] }>(
      `/credores/listpm/${dados}`,
    );

    return data.items.map((credor) => {
      return {
        label: credor.dados,
        value: credor.pm_num_credor,
        matricula: credor.matricula,
      };
    });
  }, []);

  const atrasoInput = useCallback(
    debounce((dados: string) => pmsFiltrados(dados), 500),
    [],
  );

  const {
    errors: errorsEdit,
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<IFormCredor>({
    defaultValues: {
      matriculaPm: '',
      numCredorPm: undefined,
    },
    resolver: yupResolver(schemaCredor),
  });

  const updateCredor = async ({
    numCredorPm,
    matriculaPm,
  }: IFormCredor): Promise<void> => {
    await api.put<IDadosPm>(`/credores/${matriculaPm}`, {
      numCredorPm,
    });

    toast({
      title: 'Sucesso!',
      description: 'Numero Credor do PM Atualizado com Sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <>
      <BoxContent>
        <TituloPagina title="Credor" />
        <form onSubmit={handleSubmitEdit(updateCredor)}>
          <FormGroup cols={[6, 6, 12]} name="Policial Militar">
            <Controller
              name="matriculaPm"
              control={controlEdit}
              render={({ onChange, value }) => (
                <AsyncSelect
                  placeholder="Digite nome ou matricula ou posto do militar"
                  loadOptions={(input: string) => atrasoInput(input)}
                  onChange={(opcaoSelecionado: OptionType) => {
                    setPmSelecionado(opcaoSelecionado);
                    // console.log(opcaoSelecionado);
                    onChange(opcaoSelecionado.matricula);
                    setValueEdit(
                      'numCredorPm',
                      opcaoSelecionado.value
                        ? Number(opcaoSelecionado.value)
                        : '',
                    );
                  }}
                  value={pmSelecionado}
                  error={errorsEdit.matriculaPm?.message}
                />
              )}
            />
          </FormGroup>

          <FormGroup cols={[3, 6, 12]} name="Número do Credor">
            <Controller
              name="numCredorPm"
              control={controlEdit}
              render={({ onChange, value }) => (
                <InputNumberFormat
                  style={{ minWidth: 350 }}
                  onChange={onChange}
                  value={value}
                  error={errorsEdit.numCredorPm?.message}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Button color="green" icon={FaSave} type="submit">
              Incluir
            </Button>
          </FormGroup>
        </form>
      </BoxContent>
    </>
  );
};

export default ListCredor;
