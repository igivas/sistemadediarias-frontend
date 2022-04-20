import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
// import { useMovimentacao } from 'contexts/MovimentacaoContext';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { IoIosMail } from 'react-icons/io';
import {
  Divider,
  Flex,
  Button,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import UserImage from 'pages/_layouts/private/Header/UserImage';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../../contexts/auth';
import PanelBottomActions from '../PanelBottomActions';
import Modal, { IModalProps } from '../Modal';
import FormInput from '../form/FormInput';
import FormGroup from '../form/FormGroup';
// import Button from '../form/Button';
import { Content, Form, Post, UserCPF, UserContent } from './styles';
import api from '../../services/api';

// eslint-disable-next-line no-shadow
enum ETipoAssinatura {
  PROPRIO = '0',
  'POR ORDEM' = '1',
  'POR IMPEDIMENTO' = '2',
}

interface IOptionsCargos {
  value: string;
  label: string;
}

interface IModalAssinaturaProps extends IModalProps {
  cargos: IOptionsCargos[];
  data: any;
}

const schemaAssinatura = Yup.object().shape({
  assinatura: Yup.string().required('Este cmapo é requerido'),
  pin: Yup.string().required('Este cmapo é requerido'),
});

/* const schemaAssinatura = Yup.object().shape({
  cargo: Yup.string().required('Este campo é obrigatorio'),
  pin_assinatura: Yup.string().required('Este campo é obrigatorio'),
  pin_24h: Yup.string()
    .required('Este campo é obrigatorio')
    .max(6, 'Não pode haver mais de 6 digitos'),
}); */

type IFormInputsAssinatura = Yup.InferType<typeof schemaAssinatura>;

const ModalAssinatura: React.FC<Omit<IModalAssinaturaProps, 'title'>> = ({
  data,
  onClose,
  ...rest
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const history = useHistory();
  const [botao, setBotao] = useState(true);
  const [botaoPin, setBotaoPin] = useState(true);
  const { handleSubmit, control, errors } = useForm<IFormInputsAssinatura>({
    resolver: yupResolver(schemaAssinatura),
    defaultValues: {
      assinatura: undefined,
      pin: undefined,
    },
  });

  const onSubmit = async (dataForm: IFormInputsAssinatura): Promise<void> => {
    setBotao(false);
    try {
      const dataSga = {
        id_documento_sga: data.itensSaidaColog[0].id_documento_sga,
        pan: dataForm.assinatura,
        id_documento_sisfard: data.itensSaidaColog[0].id_documento_sisfard,
        matricula: data.itensSaidaColog[0].matricula,
        pin: dataForm.pin,
        cpf: data.cpf,
        id_saida_colog: data.itensSaidaColog[0].id_saida_colog,
      };
      await api.post('saidacolog/documentos/assinar', dataSga);
      toast({
        title: 'Sucesso.',
        description: 'Documento Assinado com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      history.go(0);
    } catch (error) {
      toast({
        title: 'Ocorreu um erro.',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      // history.push('/listasdocumentosparaassinar');
      setBotao(true);
    }
  };

  const handleCreatePin24h = async (): Promise<void> => {
    setBotaoPin(false);
    try {
      const createdPin = await api.post('documentossisfard/gerarpin24h', {
        user: user.id_usuario,
      });

      toast({
        title: 'Sucesso!',
        description:
          createdPin.data.message ||
          'Um novo pin foi gerado. Por favor, verifique seu email',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setBotaoPin(true);
    } catch (error) {
      toast({
        title: 'Ocorreu um erro.',
        description:
          'Ocorreu um erro ao tentar criar o Pin 24hrs. Por favor tente mais tarde',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setBotaoPin(true);
    }
  };

  const handleBotaoConfirmar = (): any => {
    if (botao) {
      return (
        <Button
          colorScheme="green"
          backgroundColor="#48b461"
          rightIcon={<FaSave size={18} />}
          icon={FaSave}
          type="submit"
        >
          Assinar
        </Button>
      );
    }
    return (
      <Button
        isLoading
        loadingText="Enviando"
        rightIcon={<FaSave size={18} />}
        spinner={<BeatLoader size={8} color="white" />}
        colorScheme="green"
        icon={FaSave}
        type="submit"
      >
        Assinar
      </Button>
    );
  };

  const handleBotaoPin = (): any => {
    if (botaoPin) {
      return (
        <Button
          colorScheme="blue"
          backgroundColor="#5ac4d0"
          type="button"
          rightIcon={<IoIosMail size={22} />}
          onClick={handleCreatePin24h}
        >
          Receber PIN 24H
        </Button>
      );
    }
    return (
      <Button
        colorScheme="blue"
        isLoading
        type="button"
        loadingText="Enviando"
        rightIcon={<IoIosMail size={22} />}
        spinner={<BeatLoader size={8} color="white" />}
      >
        Receber PIN 24H
      </Button>
    );
  };

  return (
    <Modal title="Assinatura Eletronica PMCE" {...rest} onClose={onClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <UserContent>
          <UserImage size="lg" />
          <Flex direction="column" marginLeft="8px">
            <Post>{user.nome}</Post>
            <UserCPF>{user.matricula}</UserCPF>
          </Flex>
        </UserContent>

        <Content>
          <Divider marginTop="8px" />
          <div id="pins_inputs">
            <FormGroup required name="Assinatura Eletrônica" cols={[6, 6, 6]}>
              <Controller
                name="assinatura"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    type="password"
                    onChange={onChange}
                    value={value}
                    error={errors.assinatura?.message}
                  />
                )}
              />
            </FormGroup>

            <FormGroup required name="PIN 24H" cols={[4, 6, 6]}>
              <Controller
                name="pin"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    type="password"
                    onChange={onChange}
                    value={value}
                    error={errors.pin?.message}
                    maxLength={6}
                  />
                )}
              />
            </FormGroup>
          </div>
          <PanelBottomActions>
            <>
              {handleBotaoPin()}
              {handleBotaoConfirmar()}
            </>
          </PanelBottomActions>
        </Content>
      </Form>
    </Modal>
  );
};

export default ModalAssinatura;
