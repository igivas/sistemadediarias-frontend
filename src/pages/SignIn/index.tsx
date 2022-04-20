import React, { KeyboardEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FaAddressCard } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import { Box, Flex, Link } from '@chakra-ui/react';
import { useAuth } from '../../contexts/auth';
import FormInput from '../../components/form/FormInputIcon';
import InputPassword from '../../components/form/InputPassword';
import Button from '../../components/Button';

interface ISignInFormData {
  matricula: string;
  senha: string;
}

const schema = Yup.object().shape({
  matricula: Yup.string().required('Matrícula é obrigatória'),
  senha: Yup.string().required('Senha é obrigatória'),
});

const Info: React.FC = ({ children }) => {
  return (
    <Box fontSize="13px" color="#999" marginTop="16px" textAlign="center">
      {children}
    </Box>
  );
};

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, errors, register } = useForm<ISignInFormData>({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const { signIn } = useAuth();

  const onSubmit = useCallback(
    async (data: ISignInFormData) => {
      setIsLoading(true);
      try {
        await signIn(data);
        setIsLoading(false);
        history.push('/home');
      } catch (error) {
        setIsLoading(false);
      }
    },
    [signIn, history],
  );

  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Box
      marginTop="auto"
      marginBottom="auto"
      boxShadow={{
        base: 'none',
        sm: 'none',
        md:
          'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
      }}
    >
      <Fade>
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          borderRadius="4px"
          width="100%"
          maxWidth="350px"
          padding={{
            base: '10px 10px',
            sm: '10px 10px',
            md: '20px 40px',
            lg: '20px 40px',
          }}
        >
          <h3>Login</h3>
          <form style={{ width: '100%', fontStyle: '14px' }}>
            <FormInput
              name="matricula"
              fontSize={14}
              register={register}
              icon={FaAddressCard}
              placeholder="MATRÍCULA"
              onKeyPress={(e) => handleKeypress(e)}
              error={errors.matricula?.message}
            />

            <InputPassword
              name="senha"
              id="senha"
              fontSize={14}
              register={register}
              placeholder="Senha"
              onKeyPress={(e) => handleKeypress(e)}
              error={errors.senha?.message}
            />
          </form>
          <Button
            fontSize="13px"
            isLoading={isLoading}
            loadingText="VERIFICANDO"
            type="submit"
            colorScheme="primary"
            onClick={handleSubmit((data) => onSubmit(data))}
          >
            ENTRAR
          </Button>
          <Info>Acesse com o mesmo usuário e senha do sistema SISBOL!</Info>
          <Link
            color="blue.500"
            href="https://sga.pm.ce.gov.br/esqueci"
            isExternal
          >
            {' '}
            Esquece a senha?
          </Link>
        </Flex>
      </Fade>
    </Box>
  );
};

export default SignIn;
