import { useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import Logo from '../../../../assets/sspds-pm.png';
import { Container, LogoContainer, WhiteContainer, LogoImage } from './styles';

interface IProps {
  title: string;
  sigla: string;
}

const Header: React.FC<IProps> = ({ title, sigla }) => {
  const [maiorQue480px] = useMediaQuery('(min-width: 480px)');
  return (
    <Container>
      <LogoContainer>
        <a href="https://www.pm.ce.gov.br/">
          <LogoImage src={Logo} alt="logotipo" />
        </a>
      </LogoContainer>

      <WhiteContainer>
        <div
          id="title-page"
          className="justify-content-center align-items-center"
        >
          <h3>
            {title}
            {/* {maiorQue480px && ` - ${sigla}`} */}
            {maiorQue480px}
          </h3>
        </div>
      </WhiteContainer>
    </Container>
  );
};

export default Header;
