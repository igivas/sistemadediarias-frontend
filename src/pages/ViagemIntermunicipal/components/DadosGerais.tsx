import { Select } from '@chakra-ui/react';
import FormGroup from 'components/form/FormGroup';
import TextArea from 'components/form/FormTextArea';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import api from 'services/api';
import Row from '../../../components/form/Row';
import Input from '../../../components/form/FormInput';

type IValues = {
  nome_evento: string;
  opm: string;
  comandante_resp_pedido: string;
  resp_pedido: string;
  id_fin: number;
  objetivo: string;
};

type IFormDadosGerais = {
  step0: IValues;
};

type IFinalidade = {
  id_fin: number;
  descricao_fin: string;
  situacao_fin: string;
};

type IProps = {
  step0?: IValues;
  finalidades: IFinalidade[];
};
const DadosGerais: React.FC<IProps> = ({ step0, finalidades }) => {
  const {
    control,
    errors,
    formState,
    trigger,
  } = useFormContext<IFormDadosGerais>();

  useEffect(() => {
    const triggerForm = async (): Promise<void> => {
      await trigger('step0');
    };

    if (formState.isSubmitted) triggerForm();
  }, [trigger, formState, errors]);

  return (
    <>
      <Row>
        <FormGroup cols={[6, 6, 12]} name="Evento" required>
          <Controller
            name="step0.nome_evento"
            control={control}
            defaultValue={step0?.nome_evento}
            render={({ onChange, value }) => (
              <Input
                value={value}
                onChange={onChange}
                error={errors.step0?.nome_evento?.message}
              />
            )}
          />
        </FormGroup>
        <FormGroup cols={[6, 6, 12]} name="OPM" required>
          <Controller
            name="step0.opm"
            control={control}
            defaultValue={step0?.opm}
            render={({ onChange, value }) => (
              <Input
                value={value}
                onChange={onChange}
                error={errors.step0?.opm?.message}
              />
            )}
          />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup
          cols={[6, 6, 12]}
          name="Comandante Responsavel pelo serviço"
          required
        >
          <Controller
            name="step0.comandante_resp_pedido"
            defaultValue={step0?.comandante_resp_pedido}
            control={control}
            render={({ onChange, value }) => (
              <Input
                value={value}
                onChange={onChange}
                error={errors.step0?.comandante_resp_pedido?.message}
              />
            )}
          />
        </FormGroup>
        {/* Os dados desse campo estão com o valores de finalidade,  quando o campor funcao
        responsavel pelo pedido estiver pronto no front e buscando os dados do back fazer a
        mudança dos valores para os valores corretos. */}
        <FormGroup
          cols={[6, 6, 12]}
          name="Função do responsável pelo pedido"
          required
        >
          <Controller
            name="step0.resp_pedido"
            defaultValue={step0?.resp_pedido}
            control={control}
            render={({ onChange, value }) => (
              <Select
                value={value}
                onChange={(e) => onChange(Number(e.currentTarget.value))}
                error={errors.step0?.resp_pedido}
              >
                <option>Selecione</option>
                {finalidades.map((finalidade) => (
                  <option value={finalidade.id_fin}>
                    {finalidade.descricao_fin}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup cols={[6, 6, 12]} name="Finalidade" required>
          <Controller
            name="step0.id_fin"
            defaultValue={step0?.id_fin}
            control={control}
            render={({ onChange, value }) => (
              <Select
                value={value}
                onChange={(e) => onChange(Number(e.currentTarget.value))}
                error={errors.step0?.id_fin}
              >
                <option>Selecione</option>

                {finalidades.map((finalidade) => (
                  <option value={finalidade.id_fin}>
                    {finalidade.descricao_fin}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup cols={[12, 12, 12]} name="Objetivo" required>
          <Controller
            name="step0.objetivo"
            control={control}
            defaultValue={step0?.objetivo}
            render={({ onChange, value }) => (
              <TextArea
                value={value}
                onChange={onChange}
                error={errors.step0?.nome_evento?.message}
              />
            )}
          />
        </FormGroup>
      </Row>
    </>
  );
};
export default DadosGerais;
