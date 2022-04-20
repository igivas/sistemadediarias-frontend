import { useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGroup from 'components/form/FormGroup';
import BoxContent from 'components/BoxContent';
import Button from 'components/form/Button';
import { Container } from 'components/form/FormGroup/styles';
import Row from 'components/form/Row';
import { Form } from 'components/ModalAssinatura/styles';
import PanelBottomActions from 'components/PanelBottomActions';
import TituloPagina from 'components/TituloPagina';
import React from 'react';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEraser, FaSave, FaTimes } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { ValueType } from 'react-select';
import api from 'services/api';
import * as Yup from 'yup';
import { useAuth } from '../../../contexts/auth';
import ReactSelect from '../../../components/form/ReactSelect';
import FormInput from '../../../components/form/FormInput';

type IFormTransporte = {
  descricao_tran: string;
  situacao_tran: string;
};

type OptionType = { label: string; value: string };

const optionsSituacaoTransporte = [
  { value: '0', label: 'Inativo' },
  { value: '1', label: 'Ativo' },
];

type IProps = {
  disabled: boolean;
  action: 'editar' | 'cadastrar';
};

const schemaTransporte = Yup.object().shape({
  descricao_tran: Yup.string().required('Campo obrigatório'),
  situacao_tran: Yup.string().required('Campo obrigatório'),
});

const TransporteNovo: React.FC<IProps> = ({ disabled }) => {
  const history = useHistory();
  const toast = useToast();
  const { signOut } = useAuth();
  const { control, handleSubmit, errors, reset } = useForm<IFormTransporte>({
    resolver: yupResolver(schemaTransporte),
    defaultValues: {
      descricao_tran: '',
      situacao_tran: '',
    },
  });

  const orderOptions = useCallback((options: OptionType[]) => {
    return options.sort((a: OptionType, b: OptionType) => {
      return a.label.localeCompare(b.label);
    });
  }, []);

  const onSubmit = async (data: IFormTransporte): Promise<void> => {
    const { descricao_tran, situacao_tran } = data;

    try {
      await api.post('transportenovo', {
        descricao_tran,
        situacao_tran,
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
      <TituloPagina title="Cadastro de Transporte" />
      <BoxContent>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup cols={[6, 9, 12]} name="Transporte" required>
                <Controller
                  name="descricao_tran"
                  control={control}
                  as={<FormInput error={errors.descricao_tran?.message} />}
                />
              </FormGroup>
              <FormGroup required name="Situação" cols={[6, 9, 12]}>
                <Controller
                  name="situacao_tran"
                  control={control}
                  render={({ onChange, value }) => (
                    <ReactSelect
                      placeholder="Selecione ..."
                      optionsSelect={orderOptions(optionsSituacaoTransporte)}
                      value={optionsSituacaoTransporte.find(
                        (option) => option.value === value,
                      )}
                      onChange={(option: ValueType<OptionType, false>) => {
                        const optionSelected = option as OptionType;
                        onChange(optionSelected.value);
                      }}
                      error={errors.situacao_tran?.message}
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

export default TransporteNovo;
