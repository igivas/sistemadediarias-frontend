import React from 'react';
import {
  MdEdit,
  MdDashboard,
  MdSearch,
  MdCardTravel,
  MdSettingsApplications,
} from 'react-icons/md';
import {
  Accordion,
  Center,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import Logo from '../components/Logo';
import MenuItem from './Menu';
import MenuDropdown from './MenuDropdown';
import LogoCetic from '../../../../assets/logo-cetic-35px.png';
import { Container, HeaderMenu, Footer } from './styles';
import { useAuth } from '../../../../contexts/auth';

interface ISideBarProps {
  activated: boolean;
  handleActiveSideBar(): void;
}

const SideBar: React.FC<ISideBarProps> = ({
  activated,
  handleActiveSideBar,
}) => {
  const { user } = useAuth();
  const bg = useColorModeValue('green.500', '#5b5b58');
  const color = useColorModeValue('gray.500', 'white');
  const cadastroItens = [
    { label: 'VIAGEM INTERMUNICIPAL', to: '/viagemintermunicipal' },
  ];
  const admItens = [
    { label: 'CLASSE', to: '/classes' },
    { label: 'CREDOR', to: '/credor' },
    { label: 'CLASSE / CARGO', to: '/classescargos' },
    { label: 'FINALIDADE', to: '/finalidades' },
    { label: 'HOSPEDAGEM', to: '/hospedagens' },
    { label: 'LEGISLAÇÃO', to: '/legislacoes' },
    { label: 'TRANSPORTE', to: '/transportes' },
  ];
  const consultaItens = [
    { label: 'CLASSE', to: '/listaclasse' },
    { label: 'CLASSE / CARGO', to: '/listaclassecargo' },
    { label: 'FINALIDADE', to: '/listafinalidade' },
    { label: 'HOSPEDAGEM', to: '/listahospedagem' },
    { label: 'LEGISLAÇÃO', to: '/listalegislacao' },
    { label: 'TRANSPORTE', to: '/listatransporte' },
  ];

  return (
    <Container activated={activated}>
      <HeaderMenu activated={activated}>
        <Logo activated={activated} />
      </HeaderMenu>

      <Flex
        bg={bg}
        textColor="black"
        color={color}
        direction="column"
        alignItems="initial"
        flex="1"
      >
        <Accordion allowToggle>
          <MenuItem
            to="/home"
            label="INICIAL"
            icon={MdDashboard}
            activated={activated}
          />
        </Accordion>
        <Accordion allowToggle>
          <MenuDropdown
            label="ADMINISTRAÇÃO"
            icon={MdSettingsApplications}
            items={admItens}
            activated={activated}
            handleActiveSideBar={handleActiveSideBar}
          />
        </Accordion>
        <Accordion allowToggle>
          <MenuDropdown
            label="CADASTRO"
            icon={MdEdit}
            items={cadastroItens}
            activated={activated}
            handleActiveSideBar={handleActiveSideBar}
          />
        </Accordion>
        <Accordion allowToggle>
          <MenuDropdown
            label="CONSULTA"
            icon={MdSearch}
            items={consultaItens}
            activated={activated}
            handleActiveSideBar={handleActiveSideBar}
          />
        </Accordion>
      </Flex>
      <Footer activated={activated}>
        <Center w="100%">
          {activated && <Image src={LogoCetic} alt="logo cetic" />}
        </Center>
      </Footer>
    </Container>
  );
};

export default SideBar;
