import {
  Button,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { IColumns } from 'components/DataTable';
import TableInput from 'components/form/TableInput';
import FormGroup from 'components/form/FormGroup';
import Row from 'components/form/Row';
import Modal from 'components/Modal';
import { GoQuestion } from 'react-icons/go';

import React, { useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useForm,
} from 'react-hook-form';
import { Select } from 'components/form/Select';
import { FaPencilAlt } from 'react-icons/fa';
import * as Yup from 'yup';
import Input from '../../../components/form/FormInput';

type IFormParticipante = {
  nome: string;
  opm: { uni_sigla: string };
  graduacao: { gra_sigla: string };
  numero_credor_sefaz: string;
  classe: { id: number; nome: string };
  conta: { dados_conta: string };
  tem_autoridade: '0' | '1';
  nome_autoridade?: string;
};

type IConta = {
  conta: string;
  agencia: string;
  banco: string;
};

type IFormSchemaParticipantes = {
  step1: {
    roteiros: {
      participantes: IFormParticipante[];
    }[];
  };
};

type IProps = {
  indice_roteiro: number;
  participantes: IFormParticipante[];
};

const schemaParticipante = Yup.object()
  .shape({
    nome: Yup.string().required('Este campo é obrigatorio'),
    opm: Yup.object({
      uni_sigla: Yup.string().required('Este campo é obrigatorio'),
    }).required('Este campo é obrigatorio'),
    graduacao: Yup.object({
      gra_sigla: Yup.string().required('Este campo'),
    }).required('Este campo é obrigatorio'),
    numero_credor_sefaz: Yup.string().required('Este campo é obrigatorio'),
    classe: Yup.object({
      nome: Yup.string().required('Este campo é obrigatorio'),
    }).required('Este campo é obrigatorio'),
    conta: Yup.object({
      dados_conta: Yup.string().required('Este campo é obrigatorio'),
    }).required('Este campo é obrigatorio'),
    tem_autoridade: Yup.string()
      .required('Este campo é obrigatorio')
      .oneOf(['0', '1']),
    nome_autoridade: Yup.string()
      .notRequired()
      .when('tem_autoridade', {
        is: (tem_autoridade: '0' | '1') => tem_autoridade === '1',
        then: Yup.string().required('Este campo é obrigatorio'),
      }),
  })
  .required();

const Participantes: React.FC<IProps> = ({ indice_roteiro, participantes }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    errors: errorsFormParticipante,
    control: controlFormParticipante,
    handleSubmit: handleSubmitParticipante,
    watch: watchParticipante,
    setValue: setValueParticipante,
  } = useForm<IFormParticipante>({
    resolver: yupResolver(schemaParticipante),
  });

  const { control } = useFormContext<IFormSchemaParticipantes>();
  const { append, fields, remove } = useFieldArray({
    name: `step1.roteiros.${indice_roteiro}.participantes`,
    control,
  });

  const [
    participanteSelecionado,
    setParticipanteSelecionado,
  ] = useState<IFormParticipante>();

  const [inputSefazAtivado, setInputSefazAtivado] = useState(false);

  const contasBancarias: IConta[] = [
    { banco: 'Bradesco', agencia: '1234', conta: '36565' },
    { banco: 'Itau', agencia: '45434', conta: '9665' },
    { banco: 'Banco do Brasil', agencia: '96998', conta: '23111' },
  ];

  useEffect(() => {
    if (participantes.length > 0) {
      participantes.forEach((participante) => append(participante));
    }
  }, [participantes, append]);

  const columns: IColumns = [
    { field: 'opm.uni_sigla', text: 'OPM', type: { name: 'text' } },
    { field: 'matricula', text: 'Matricula', type: { name: 'text' } },
    { field: 'nome', text: 'Nome', type: { name: 'text' } },
    { field: 'graduacao.gra_sigla', text: 'Graduação', type: { name: 'text' } },
    { field: 'classe.nome', text: 'Classe', type: { name: 'text' } },
    {
      field: 'conta.dados_conta',
      text: 'Dados Bancários',
      type: { name: 'text' },
    },
    {
      field: 'numero_credor_sefaz',
      text: 'Credor',
      type: { name: 'text' },
    },
  ];

  const handleAdicionarParticipante = (
    participante: IFormParticipante,
  ): void => {
    append(participante);
    onClose();
  };

  return (
    <>
      <TableInput
        actions={{ headerText: 'acoes', items: [] }}
        columns={columns}
        data={fields}
        control={control}
        controlName={`step1.roteiros.${indice_roteiro}.participantes`}
      />
      <Button
        type="button"
        onClick={() => {
          setParticipanteSelecionado({
            graduacao: { gra_sigla: 'Cabo' },
            nome: 'Joel Marlindo do mundo',
            opm: { uni_sigla: '8bpm' },
            numero_credor_sefaz: '69696',
            classe: { id: 1, nome: 'IV' },
          } as IFormParticipante);
          onOpen();
        }}
      >
        Adicionar participantes
      </Button>
      <Modal
        isOpen={isOpen}
        size="4xl"
        title="Editar Dados Bancários"
        onClose={onClose}
      >
        <Row>
          <FormGroup name="Nome / Matrícula / OPM" cols={[6, 6, 12]} required>
            <Controller
              control={controlFormParticipante}
              defaultValue={participanteSelecionado?.nome}
              name="nome"
              render={({ onChange, value }) => (
                <Input
                  value={value}
                  disabled
                  onChange={onChange}
                  error={errorsFormParticipante.nome?.message}
                />
              )}
            />
          </FormGroup>
          <FormGroup name="OPM" cols={[6, 6, 12]} required>
            <Controller
              control={controlFormParticipante}
              defaultValue={participanteSelecionado?.opm?.uni_sigla}
              name="opm.uni_sigla"
              render={({ onChange, value }) => (
                <Input
                  value={value}
                  disabled
                  onChange={onChange}
                  error={errorsFormParticipante.opm?.uni_sigla?.message}
                />
              )}
            />
          </FormGroup>
        </Row>
        <Row>
          {/*  direction e space-beetwen nao faz alteraçoes no codigo */}

          <FormGroup name="Posto / Graduação" cols={[3, 6, 12]} required>
            <Controller
              control={controlFormParticipante}
              defaultValue={participanteSelecionado?.graduacao?.gra_sigla}
              name="graduacao.gra_sigla"
              render={({ onChange, value }) => (
                <Input
                  value={value}
                  disabled
                  onChange={onChange}
                  error={errorsFormParticipante.graduacao?.gra_sigla?.message}
                />
              )}
            />
          </FormGroup>
          <FormGroup name="N° Credor Sefaz" cols={[6, 6, 12]} required>
            <Flex direction="row" width="100%">
              <Controller
                control={controlFormParticipante}
                defaultValue={participanteSelecionado?.numero_credor_sefaz}
                name="numero_credor_sefaz"
                render={({ onChange, value }) => (
                  <Input
                    value={value}
                    disabled={!inputSefazAtivado}
                    onChange={onChange}
                    error={errorsFormParticipante.numero_credor_sefaz?.message}
                  />
                )}
              />
              <Button
                marginLeft=".3rem"
                onClick={() => setInputSefazAtivado(true)}
              >
                <FaPencilAlt />
              </Button>
            </Flex>
          </FormGroup>
          <FormGroup name="Classe da Diária" cols={[3, 6, 12]} required>
            <Controller
              control={controlFormParticipante}
              defaultValue={participanteSelecionado?.classe?.nome}
              name="classe.nome"
              render={({ onChange, value }) => (
                <Input
                  value={value}
                  disabled
                  onChange={onChange}
                  error={errorsFormParticipante.classe?.nome?.message}
                />
              )}
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup cols={[6, 6, 12]} required name="Conta Bancária">
            <Controller
              control={controlFormParticipante}
              defaultValue={participanteSelecionado?.conta?.dados_conta}
              name="conta.dados_conta"
              render={({ onChange, value }) => (
                <Select
                  name="conta"
                  value={value}
                  onChange={onChange}
                  error={errorsFormParticipante.conta?.dados_conta}
                  options={[
                    { label: 'Selecione', value: '' },
                    ...contasBancarias.map((conta) => ({
                      label: `${conta.banco} - AG ${conta.agencia} - C/C ${conta.conta}`,
                      value: `${conta.banco} - AG ${conta.agencia} - C/C ${conta.conta}`,
                    })),
                  ]}
                />
              )}
            />
          </FormGroup>
        </Row>
        <Row>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <FormGroup
              name="Policial viaja nas hipóteses do Art.11 ?"
              cols={[6, 6, 12]}
              required
            >
              <Controller
                control={controlFormParticipante}
                defaultValue="0"
                name="tem_autoridade"
                render={({ onChange, value }) => (
                  <RadioGroup
                    onChange={onChange}
                    value={value}
                    error={errorsFormParticipante.tem_autoridade?.message}
                  >
                    <Stack direction="row">
                      <Radio value="0">Não</Radio>
                      <Radio value="1">Sim</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
            </FormGroup>

            <Tooltip
              marginLeft="-10"
              marginTop="40"
              label="Top"
              placement="top"
            >
              <span>
                <GoQuestion />
              </span>
            </Tooltip>
          </div>
        </Row>
        {watchParticipante('tem_autoridade') === '1' && (
          <Row>
            <FormGroup name="Autoridade Superior" cols={[6, 6, 12]} required>
              <Controller
                control={controlFormParticipante}
                name="nome_autoridade"
                render={({ onChange, value }) => (
                  <Input
                    value={value}
                    onChange={onChange}
                    onBlur={() => {
                      if (value !== '')
                        setValueParticipante('classe.nome', 'III');
                    }}
                    error={errorsFormParticipante.nome_autoridade?.message}
                  />
                )}
              />
            </FormGroup>
          </Row>
        )}
        <Flex justifyContent="center">
          <Button
            type="button"
            mr="6"
            bg="green"
            color="white"
            onClick={async () => {
              await handleSubmitParticipante(handleAdicionarParticipante)();
              setInputSefazAtivado(false);
            }}
          >
            Salvar
          </Button>
          <Button onClick={onClose} bg="red" color="white" ml="3">
            Cancelar
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default Participantes;
