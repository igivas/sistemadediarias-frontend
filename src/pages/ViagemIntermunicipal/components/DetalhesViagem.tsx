import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import FormGroup from 'components/form/FormGroup';
import Row from 'components/form/Row';
import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import DatePicker from 'components/form/FormDatePicker';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FaMinus } from 'react-icons/fa';
import ItemSelector from 'components/form/ItemSelector';
import Modal from 'components/Modal';
import Input from '../../../components/form/FormInput';
import Participantes from './Participantes';

type IValues = {
  nome: string;
  data_inicial: Date;
  data_final: Date;
  id_hosp: number;
  id_tran: number;
  mun_codigo: string[];
  participantes: {
    nome: string;
    opm: { uni_sigla: string };
    graduacao: { gra_sigla: string };
    numero_credor_sefaz: string;
    classe: { id: number; nome: string };
    conta: { dados_conta: string };
    tem_autoridade: '0' | '1';
    nome_autoridade?: string;
  }[];
  transportes: {
    id_tran: number;
    descricao_tran: string;
    situacao_tran: string;
  };
}[];

type IFormDetalhes = {
  step1: {
    roteiros: IValues;
  };
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

type IProps = {
  step1?: {
    roteiros?: IValues;
  };
  hospedagens: IHospedagem[];
  transportes: ITransportes[];
};

const DetalhesViagem: React.FC<IProps> = ({
  step1,
  hospedagens,
  transportes,
}) => {
  const {
    control,
    errors,
    setValue,
    trigger,
    formState,
  } = useFormContext<IFormDetalhes>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'step1.roteiros',
  });
  const selectedItems = (items: any[]): void => {
    setValue(
      `step1.roteiros.0.mun_codigo`,
      items.map((item) => item.value),
    );
  };

  useEffect(() => {
    const triggerForm = async (): Promise<void> => {
      await trigger('step1');
    };

    if (formState.isSubmitted) triggerForm();
  }, [trigger, formState, errors]);

  useEffect(() => {
    if (step1 && step1?.roteiros && step1?.roteiros?.length >= 0) {
      setValue(
        `step1.roteiros`,
        step1?.roteiros.map(() => ({})),
      );
    }
  }, [step1, setValue]);

  return (
    <>
      <Tabs variant="enclosed">
        <TabList>
          {fields.map((field, tabIndex) => (
            <Tab key={field.id}>
              Roteiro {tabIndex + 1}
              <FaMinus onClick={() => remove(tabIndex)} />
            </Tab>
          ))}
          <Tab onClick={() => append({})}>
            <FaPlus onClick={() => append({})} />
          </Tab>
        </TabList>
        <TabPanels>
          {fields.map((field, indexField) => (
            <TabPanel key={field.id}>
              <Row>
                <FormGroup cols={[6, 6, 12]} name="Nome" required>
                  <Controller
                    key={field.id}
                    control={control}
                    defaultValue={step1?.roteiros?.[indexField]?.nome}
                    name={`step1.roteiros.${indexField}.nome`}
                    render={({ onChange, value }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        error={
                          errors.step1?.roteiros?.[indexField]?.nome?.message
                        }
                      />
                    )}
                  />
                </FormGroup>
                <FormGroup cols={[3, 3, 12]} name="Data Inicial" required>
                  <Controller
                    key={field.id}
                    control={control}
                    name={`step1.roteiros.${indexField}.data_inicial`}
                    defaultValue={step1?.roteiros?.[indexField]?.data_inicial}
                    render={({ onChange, value }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        error={
                          errors.step1?.roteiros?.[indexField]?.data_inicial
                            ?.message
                        }
                      />
                    )}
                  />
                </FormGroup>
                <FormGroup cols={[3, 3, 12]} name="Data Final" required>
                  {/* <DatePicker onChange={(event) => console.log(event)} /> */}
                  <Controller
                    key={field.id}
                    control={control}
                    name={`step1.roteiros.${indexField}.data_final`}
                    defaultValue={step1?.roteiros?.[indexField]?.data_final}
                    render={({ onChange, value }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        error={
                          errors.step1?.roteiros?.[indexField]?.data_final
                            ?.message
                        }
                      />
                    )}
                  />
                </FormGroup>
              </Row>
              <Accordion allowToggle>
                <AccordionItem marginBottom="2rem">
                  <AccordionButton border="1px solid gray" borderRadius="4px">
                    <Box flex="1" textAlign="left">
                      <h2>Cidades</h2>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    <Controller
                      control={control}
                      name={`step1.roteiros.${indexField}.mun_codigo`}
                      defaultValue={step1?.roteiros?.[indexField]?.mun_codigo}
                      render={({ value, onChange }) => (
                        <ItemSelector
                          defaultSelected={value}
                          handleSelectedOptions={(items2) =>
                            onChange(items2.map((item) => item.value))
                          }
                          items={[
                            { label: 'Lagoa do Ouro', value: 'Lagoa do Ouro' },
                            { label: 'Cláudio', value: 'Cláudio' },
                            { label: 'Toledo', value: 'Toledo' },
                            { label: 'Serra', value: 'Serra' },
                            { label: 'Jaru', value: 'Jaru' },
                            { label: 'Japi', value: 'Japi' },
                            { label: 'Bom Jesus', value: 'Bom Jesus' },
                            { label: 'Bom Sucesso', value: 'Bom Sucesso' },
                            {
                              label: 'Bonito de Santa Fé',
                              value: 'Bonito de Santa Fé',
                            },
                            { label: 'Boqueirão', value: 'Boqueirão' },
                            { label: 'Igaracy', value: 'Igaracy' },
                          ]}
                        />
                      )}
                    />
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem marginBottom="2rem">
                  <h2>
                    <AccordionButton
                      border={
                        errors.step1?.roteiros?.[indexField]?.participantes
                          ? '1px solid red'
                          : '1px solid gray'
                      }
                      borderRadius="4px"
                    >
                      <Box flex="1" textAlign="left">
                        Participantes
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Participantes
                      indice_roteiro={indexField}
                      key={field.id}
                      participantes={
                        step1?.roteiros?.[indexField]?.participantes || []
                      }
                    />
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem marginBottom="2rem">
                  <h2>
                    <AccordionButton border="1px solid gray" borderRadius="4px">
                      <Box flex="1" textAlign="left">
                        Transporte
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <FormGroup cols={[6, 6, 12]} required>
                      <Controller
                        name={`step1.roteiros.${indexField}.id_tran`}
                        defaultValue={step1?.roteiros?.[indexField]?.id_tran}
                        control={control}
                        render={({ onChange, value }) => (
                          <Select
                            value={value}
                            onChange={(e) =>
                              onChange(Number(e.currentTarget.value))
                            }
                            error={
                              errors.step1?.roteiros?.[indexField]?.id_tran
                                ?.message
                            }
                          >
                            <option>Selecione</option>

                            {transportes.map((transporte) => (
                              <option value={transporte.id_tran}>
                                {transporte.descricao_tran}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </FormGroup>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <h2>
                    <AccordionButton border="1px solid gray" borderRadius="4px">
                      <Box flex="1" textAlign="left">
                        Hospedagem
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    <FormGroup cols={[6, 6, 12]} required>
                      <Controller
                        name={`step1.roteiros.${indexField}.id_hosp`}
                        defaultValue={step1?.roteiros?.[indexField]?.id_hosp}
                        control={control}
                        render={({ onChange, value }) => (
                          <Select
                            value={value}
                            onChange={(e) =>
                              onChange(Number(e.currentTarget.value))
                            }
                            error={
                              errors.step1?.roteiros?.[indexField]?.id_hosp
                                ?.message
                            }
                          >
                            <option>Selecione</option>

                            {hospedagens.map((hospedagem) => (
                              <option value={hospedagem.id_hosp}>
                                {hospedagem.descricao_hosp}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </FormGroup>
                    {errors.step1?.roteiros?.[indexField]?.id_hosp?.message}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default DetalhesViagem;
