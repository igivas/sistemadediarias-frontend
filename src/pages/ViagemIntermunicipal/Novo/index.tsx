import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import api from 'services/api';
import { useHistory } from 'react-router-dom';

import { Box } from '@chakra-ui/react';
import BoxContent from 'components/BoxContent';
import { Stepper, StepLabel, Step } from '@material-ui/core';
import { Button } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';
import TituloPagina from 'components/TituloPagina';
import * as Yup from 'yup';
import {
  FormProvider,
  useForm,
  Controller,
  FieldError,
  DeepMap,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TituloLabelStep from 'components/TituloLabelStep';
import { MdWarning } from 'react-icons/md';
import TableInput from 'components/form/TableInput';
import TextStep from 'components/TextStep';
import { IColumns } from 'components/DataTable';
import { useAuth } from '../../../contexts/auth';
import DadosGerais from '../components/DadosGerais';
import DetalhesViagem from '../components/DetalhesViagem';
import ResumoViagem from '../components/ResumoViagem';

const schema = Yup.object().shape({
  step0: Yup.object()
    .shape({
      nome_evento: Yup.string().required('Esse campo é requerido'),
      opm: Yup.string().required('Esse campo é requerido'),
      comandante_resp_pedido: Yup.string().required('Esse campo é requerido'),
      resp_pedido: Yup.number().required('Esse campo é requerido'),
      id_fin: Yup.number().required('Esse campo é requerido'),
      objetivo: Yup.string().required('Esse campo é requerido'),
    })
    .required(),
  step1: Yup.object().shape({
    roteiros: Yup.array()
      .of(
        Yup.object({
          nome: Yup.string().required('Este campo é obrigatorio'),
          data_inicial: Yup.date()
            .required('Este campo é obrigatorio')
            .typeError('Data inválida'),
          data_final: Yup.date()
            .required('Este campo é obrigatorio')
            .typeError('Data inválida'),
          mun_codigo: Yup.array()
            .of(Yup.string().required())
            .required('Esse campo é requerido'),
          id_hosp: Yup.number().required('Este campo é obrigatorio'),
          id_tran: Yup.number().required('Este campo é obrigatorio'),
          participantes: Yup.array()
            .of(
              Yup.object({
                nome: Yup.string().required('Este campo é obrigatorio.'),
                opm: Yup.object({
                  uni_sigla: Yup.string().required('Este campo é obrigatorio'),
                }).required('Este campo é obrigatorio'),
                graduacao: Yup.object({
                  gra_sigla: Yup.string().required('Este campo'),
                }).required('Este campo é obrigatorio'),
                numero_credor_sefaz: Yup.string().required(
                  'Este campo é obrigatorio.',
                ),
                classe: Yup.object({
                  id: Yup.number().required('Campo Obrigatório'),
                  nome: Yup.string().required('Este campo é obrigatorio'),
                }).required('Este campo é obrigatorio'),
              }),
            )
            .required(),
          transporte: Yup.object({
            id_tran: Yup.number().required('Campo Obrigatório'),
            descricao_tran: Yup.string().required('Este campo é obrigatorio'),
            situacao_tran: Yup.string().required('Este campo é obrigatorio'),
          }).required('Este campo é obrigatorio'),
        }),
      )
      .required('Esse campo é requerido'),
  }),
});

type IFinalidade = {
  id_fin: number;
  descricao_fin: string;
  situacao_fin: string;
};

type IHospedagem = {
  id_hosp: number;
  descricao_hosp: string;
  situacao_hosp: string;
};

type ITransportes = {
  id_tran: number;
  descricao_tran: string;
  situacao_tran: string;
};

type IParticipantes = {
  nome_matric_opm: string;
  opm: { uni_sigla: string };
  posto_grad: string;
  cred_sefaz: number;
  classe_diaria: number;
  conta_bancaria: string;
};

type IFormSchema = {
  step0: {
    nome_evento: string;
    opm: string;
    comandante_resp_pedido: string;
    objetivo: string;
  };
  step1: {
    roteiros: {
      nome: string;
      data_inicial: Date;
      data_final: Date;
      mun_codigo: string[];
      id_hosp: number;
      id_tran: number;
      participantes: {
        nome: string;
        opm: { uni_sigla: string };
        graduacao: { gra_sigla: string };
        numero_credor_sefaz: string;
        classe: { id: number; nome: string };
      }[];
    }[];
  };
};

const steps = ['Dados Gerais', 'Detalhes da Viagem', 'Resumo da Viagem'];

const NovaViagemIntermunicipal: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);

  const isLast = activeStep === steps.length - 1;

  const metodos = useForm<IFormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      step1: {
        roteiros: [{}],
      },
    },
  });

  const [stateForm, setStateForm] = useState<any>();

  const [finalidades, setFinalidades] = useState<IFinalidade[]>([]);
  const [hospedagens, setHospedagens] = useState<IHospedagem[]>([]);
  const [transportes, setTransportes] = useState<ITransportes[]>([]);
  const [participantes, setParticipantes] = useState<IParticipantes[]>([]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const [
        { data },
        { data: dataHosp },
        { data: dataTrans },
      ] = await Promise.all([
        api.get<{ items: IFinalidade[] }>('finalidades'),
        api.get<{ items: IHospedagem[] }>('hospedagens'),
        api.get<{ items: ITransportes[] }>('transportes'),
      ]);

      setFinalidades(
        data.items.filter((finalidade) => finalidade.situacao_fin === '1'),
      );

      setHospedagens(
        dataHosp.items.filter((hospedagem) => hospedagem.situacao_hosp === '1'),
      );
      setTransportes(
        dataTrans.items.filter(
          (transporte) => transporte.situacao_tran === '1',
        ),
      );
    };

    load();
  }, []);

  const handlePostCadastrarViagem = (dados: any): void => {
    console.log(dados);
  };

  const renderStepContent = useCallback(
    (step: number): JSX.Element | undefined => {
      switch (step) {
        case 0:
          return (
            <DadosGerais
              step0={stateForm?.step0 || undefined}
              finalidades={finalidades}
            />
          );
        case 1:
          return (
            <DetalhesViagem
              step1={stateForm?.step1 || undefined}
              hospedagens={hospedagens}
              transportes={transportes}
            />
          );
        default:
          return undefined;
      }
    },
    [stateForm, finalidades, hospedagens, transportes],
  );

  const { watch } = metodos;
  console.log(metodos.errors?.step1);

  const atualizaFormState = useCallback(() => {
    setStateForm((actualStateForm: any) => ({
      ...actualStateForm,
      [`step${activeStep}`]: watch(`step${activeStep}`),
    }));
  }, [watch, activeStep]);

  const columns: IColumns = [
    { field: 'matricula', text: 'Matricula', type: { name: 'text' } },
    { field: 'nome', text: 'Nome', type: { name: 'text' } },
    { field: 'classe.nome', text: 'Classe', type: { name: 'text' } },
    { field: 'opm.uni_sigla', text: 'OPM', type: { name: 'text' } },
    { field: 'graduacao.gra_sigla', text: 'Graduação', type: { name: 'text' } },
    {
      field: 'conta.dados_conta',
      text: 'Dados Bancários',
      type: { name: 'text' },
    },
    { field: 'numero_credor_sefaz', text: 'Credor', type: { name: 'text' } },
  ];

  return (
    <>
      <TituloPagina title="Cadastrar Nova Viagem" />
      <Box>
        <BoxContent>
          <FormProvider {...metodos}>
            <form onSubmit={metodos.handleSubmit(handlePostCadastrarViagem)}>
              <Flex justifyContent="space-between">
                <Stepper
                  style={{ width: '70%' }}
                  alternativeLabel
                  activeStep={activeStep}
                >
                  {steps.map((label, index) => (
                    <Step
                      key={label}
                      onClick={() => {
                        if (activeStep !== index) {
                          atualizaFormState();
                          setActiveStep(index);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <StepLabel
                        StepIconComponent={
                          metodos.errors.step0 && index === 0
                            ? MdWarning
                            : metodos.errors.step1 && index === 1
                            ? MdWarning
                            : undefined
                        }
                        key={label}
                        style={{ cursor: 'pointer' }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Flex>
                  {activeStep > 0 && (
                    <Button
                      mr="5"
                      rightIcon={<FaArrowLeft />}
                      colorScheme="yellow"
                      onClick={() => {
                        atualizaFormState();
                        setActiveStep(activeStep - 1);
                      }}
                    >
                      Voltar
                    </Button>
                  )}
                  {activeStep < 2 && (
                    <Button
                      mr="5"
                      rightIcon={<FaArrowRight />}
                      colorScheme="green"
                      onClick={() => {
                        atualizaFormState();
                        setActiveStep(activeStep + 1);
                      }}
                    >
                      Avançar
                    </Button>
                  )}
                </Flex>
              </Flex>

              {renderStepContent(activeStep)}

              {activeStep === 2 && (
                <>
                  <Box display="flex" flexDirection="column">
                    <TituloLabelStep title="Evento :" />
                    <Controller
                      name="step0.nome_evento"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.nome_evento}
                      render={({ value }) => <TextStep>{value}</TextStep>}
                    />

                    <TituloLabelStep title="OPM :" />
                    <Controller
                      name="step0.opm"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.opm}
                      render={({ value }) => <TextStep>{value}</TextStep>}
                    />
                    <TituloLabelStep title="Comandante Responsável pelo Pedido :" />

                    <Controller
                      name="step0.comandante_resp_pedido"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.comandante_resp_pedido}
                      render={({ value }) => <TextStep>{value}</TextStep>}
                    />

                    <TituloLabelStep title=" Função do Responsável pelo Pedido :" />
                    <Controller
                      name="step0.resp_pedido"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.id_fin}
                      render={({ value }) => (
                        <TextStep>
                          {
                            finalidades.find(
                              (finalidade) => finalidade.id_fin === value,
                            )?.descricao_fin
                          }
                        </TextStep>
                      )}
                    />

                    <TituloLabelStep title="Finalidade : " />

                    <Controller
                      name="step0.id_fin"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.id_fin}
                      render={({ value }) => (
                        <TextStep>
                          {
                            finalidades.find(
                              (finalidade) => finalidade.id_fin === value,
                            )?.descricao_fin
                          }
                        </TextStep>
                      )}
                    />

                    <TituloLabelStep title="Objetivo :" />
                    <Controller
                      name="step0.objetivo"
                      control={metodos.control}
                      defaultValue={stateForm?.step0?.objetivo}
                      render={({ value }) => <TextStep>{value}</TextStep>}
                    />

                    <TituloLabelStep title="Roteiros e participantes :" />

                    {stateForm?.step1?.roteiros?.map(
                      (roteiro: any, index: number) => (
                        <>
                          <Box>
                            <TituloLabelStep
                              title={`${index + 1}° - Roteiro :`}
                            >
                              <Controller
                                key={`roteiro${index}`}
                                name={`step1.roteiros.${index}.nome`}
                                control={metodos.control}
                                defaultValue={roteiro?.nome}
                                render={({ value }) => (
                                  <TextStep>{value}</TextStep>
                                )}
                              />
                            </TituloLabelStep>
                            <Controller
                              // key={field.id}
                              name={`step1.roteiros.${index}.data_inicial`}
                              defaultValue={roteiro?.data_inicial}
                              render={({ value }) => (
                                <TextStep>
                                  {(value as Date | undefined)?.toLocaleString(
                                    'pt-BR',
                                  )}
                                </TextStep>
                              )}
                            />
                            <Controller
                              // key={field.id}
                              name={`step1.roteiros.${index}.data_final`}
                              defaultValue={roteiro?.data_final}
                              render={({ value }) => (
                                <TextStep>
                                  {(value as Date | undefined)?.toLocaleString(
                                    'pt-BR',
                                  )}
                                </TextStep>
                              )}
                            />

                            <TituloLabelStep title="Cidades :" />
                            <Controller
                              name={`step1.roteiros.${index}.mun_codigo`}
                              control={metodos.control}
                              defaultValue={roteiro?.mun_codigo}
                              render={({ value }) => (
                                <TextStep>
                                  {
                                    value?.join(' , ')
                                    /*   hospedagens.find(
                                      (hospedagen) =>
                                        hospedagen.id_hosp === value,
                                    )?.descricao_hosp */
                                  }
                                </TextStep>
                              )}
                            />

                            <TituloLabelStep title="Hospedagem :" />
                            <Controller
                              name={`step1.roteiros.${index}.id_hosp`}
                              control={metodos.control}
                              defaultValue={roteiro?.id_hosp}
                              render={({ value }) => (
                                <TextStep>
                                  {
                                    hospedagens.find(
                                      (hospedagen) =>
                                        hospedagen.id_hosp === value,
                                    )?.descricao_hosp
                                  }
                                </TextStep>
                              )}
                            />

                            <TituloLabelStep title="Transportes :" />
                            <Controller
                              name={`step1.roteiros.${index}.id_tran`}
                              control={metodos.control}
                              defaultValue={roteiro?.id_tran}
                              render={({ value }) => (
                                <TextStep>
                                  {
                                    transportes.find(
                                      (transporte) =>
                                        transporte.id_tran === value,
                                    )?.descricao_tran
                                  }
                                </TextStep>
                              )}
                            />
                            <TableInput
                              actions={{ headerText: 'acoes', items: [] }}
                              columns={columns}
                              data={roteiro?.participantes}
                              control={metodos.control}
                              controlName={`step1.roteiros.${index}.participantes`}
                            />
                          </Box>
                        </>
                      ),
                    )}
                  </Box>
                  <Button mt="4" type="submit" leftIcon={<FaSave />}>
                    Salvar
                  </Button>
                </>
              )}
            </form>
          </FormProvider>
        </BoxContent>
        <span style={{ color: 'red' }}>*Campos obrigatórios</span>
      </Box>
    </>
  );
};

export default NovaViagemIntermunicipal;
