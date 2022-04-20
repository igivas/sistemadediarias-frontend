import { useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import BoxContent from 'components/BoxContent';
import Button from 'components/form/Button';
import FormGroup from 'components/form/FormGroup';
import { Container } from 'components/form/FormGroup/styles';
import FormInput from 'components/form/FormInput';
import ReactSelect from 'components/form/ReactSelect';
import Row from 'components/form/Row';
import { Form } from 'components/ModalAssinatura/styles';
import PanelBottomActions from 'components/PanelBottomActions';
import TituloPagina from 'components/TituloPagina';
import { useAuth } from 'contexts/auth';
import React from 'react';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEraser, FaSave, FaTimes } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { ValueType } from 'react-select';
import api from 'services/api';
import * as Yup from 'yup';

type IFormHospedagem = {
  descricao_hosp: string;
  situacao_hosp: string;
};

type OptionType = { label: string; value: string };

const optionsSituacaoHospedagem = [
  { value: '0', label: 'Inativo' },
  { value: '1', label: 'Ativo' },
];

const schemaHospedagem = Yup.object().shape({
  descricao_hosp: Yup.string().required('Campo obrigatório'),
  situacao_hosp: Yup.string().required('Campo obrigatório'),
});

type IProps = {
  disabled: boolean;
  action: 'editar' | 'cadastrar';
};

const HospedagemNovo: React.FC<IProps> = ({ disabled }) => {
  const history = useHistory();
  const toast = useToast();
  const { signOut } = useAuth();
  const { control, handleSubmit, errors, reset } = useForm<IFormHospedagem>({
    resolver: yupResolver(schemaHospedagem),
    defaultValues: {
      descricao_hosp: '',
      situacao_hosp: '',
    },
  });

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const onSubmit = async (data: IFormHospedagem): Promise<void> => {
    const { descricao_hosp, situacao_hosp } = data;

    try {
      await api.post('hospedagemnovo', {
        descricao_hosp,
        situacao_hosp,
      });

      toast({
        title: 'Sucesso!',
        description: 'Cadastro realizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      history.push('/home');
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

  return (
    <Container>
      <TituloPagina title="Cadastro de Hospedagem" />
      <BoxContent>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup cols={[6, 9, 12]} name="Hospedagem" required>
                <Controller
                  name="descricao_hosp"
                  control={control}
                  as={<FormInput error={errors.descricao_hosp?.message} />}
                />
              </FormGroup>

              <FormGroup cols={[6, 9, 12]} name="Situação" required>
                <Controller
                  name="situacao_hosp"
                  control={control}
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
                      error={errors.situacao_hosp?.message}
                      isDisabled={disabled}
                    />
                  )}
                />
              </FormGroup>
            </Row>
            <PanelBottomActions>
              <Button
                color="red"
                icon={FaTimes}
                onClick={() => history.push('/home')}
              >
                Cancelar
              </Button>
              <Button
                color="yellow"
                icon={FaEraser}
                type="button"
                onClick={() => {
                  reset();
                }}
              >
                Limpar
              </Button>
              <Button color="green" icon={FaSave} type="submit">
                Salvar
              </Button>
            </PanelBottomActions>
          </Form>
        </div>
      </BoxContent>
    </Container>
  );
};
export default HospedagemNovo;
