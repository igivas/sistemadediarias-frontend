import React from 'react';
import {
  MdEdit,
  MdHelp,
  MdSearch,
  MdDashboard,
  MdCheck,
  MdList,
  MdSettingsApplications,
} from 'react-icons/md';
import { IoMdShirt } from 'react-icons/io';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Accordion,
  Center,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import MenuDropdown from './MenuDropdown';
import { useAuth } from '../../../../contexts/auth';

import Logo from './Logo';
import MenuItem from './Menu';

interface ISideBarProps {
  isOpen: boolean;
  onClose(): void;
}

const cadastrosItems = [
  { label: 'ATUALIZAR FARDAMENTO', to: '/cadastrarpendentes' },
];

const cadastrosItemsColog = [
  { label: 'ESTOQUE', to: '/cadastrarestoque' },
  { label: 'FORNECEDORES', to: '/cadastrarfornecedor' },
  { label: 'PAGAR FARDAMENTO PM', to: '/pagardardamentoopm' },
  { label: 'ITENS', to: '/cadastraritem' },
];

const cadastroIndividual = [{ label: 'ATUALIZAR FARDAMENTO', to: '/edituser' }];

const consultasItems = [
  { label: 'EFETIVO GERAL', to: '/listarfardamentos' },
  { label: 'EFETIVO PENDENTE', to: '/listarfardamentospendentes' },
  { label: 'RELATÓRIO QUANTITATIVO', to: '/relatorioquantitativo' },
];

const consultasItemsColog = [
  { label: 'LISTAR ESTOQUE', to: '/listarestoque' },
  { label: 'ITENS', to: '/listaritens' },
  { label: 'ENTRADAS', to: '/listarentradacolog' },
  { label: 'FORNECEDORES', to: '/listarfornecedores' },
  { label: 'EFETIVO GERAL', to: '/listarfardamentos' },
  { label: 'RELATÓRIO QUANTITATIVO', to: '/relatorioquantitativo' },
];

const admItens = [
  { label: 'CLASSE', to: '/classes' },
  { label: 'FINALIDADE', to: '/finalidades' },
  { label: 'HOSPEDAGEM', to: '/hospedagens' },
  { label: 'LEGISLAÇÃO', to: '/legislacoes' },
  { label: 'TRANSPORTE', to: '/transportes' },
];

const cadastroItens = [
  { label: 'VIAGEM INTERMUNICIPAL', to: '/viagemintermunicipal' },
];

const consultaItens = [
  { label: 'CLASSE', to: '/listaclasse' },
  { label: 'FINALIDADE', to: '/listafinalidade' },
  { label: 'HOSPEDAGEM', to: '/listahospedagem' },
  { label: 'LEGISLAÇÃO', to: '/listalegislacao' },
  { label: 'TRANSPORTE', to: '/listatransporte' },
];

const SideBarMobile: React.FC<ISideBarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  return (
    <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isOpen}
      size="xs"
      isFullHeight
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack justifyContent="center">
              <DrawerCloseButton />
              <Logo />
            </HStack>
          </DrawerHeader>
          <DrawerBody bg="green.500" p={0}>
            {/* {user.currentPerfil === 'SISFARD - OPM' && (
              <MenuItem
                to="/home"
                label="INICIAL"
                icon={MdDashboard}
                onClose={onClose}
              />
            )} */}
            <MenuItem
              to="/home"
              label="INICIAL"
              icon={MdDashboard}
              onClose={onClose}
            />

            <MenuDropdown
              label="ADMINISTRAÇÃO"
              icon={MdSettingsApplications}
              items={admItens}
            />

            <MenuDropdown
              label="CADASTRO"
              icon={MdEdit}
              items={cadastroItens}
            />

            <MenuDropdown
              label="CONSULTA"
              icon={MdSearch}
              items={consultaItens}
            />

            {user.currentPerfil === 'SISFARD - COLOG' && (
              <MenuItem
                to="/homecolog"
                label="INICIAL"
                icon={MdDashboard}
                onClose={onClose}
              />
            )}

            {user.currentPerfil === 'SISFARD - OPM' && (
              <MenuDropdown
                label="CADASTRO"
                icon={MdEdit}
                items={cadastrosItems}
              />
            )}

            {user.currentPerfil === 'SISFARD - COLOG' && (
              <MenuDropdown
                label="CADASTRO"
                icon={MdEdit}
                items={cadastrosItemsColog}
              />
            )}

            {user.currentPerfil === 'SISFARD - OPM' && (
              <MenuDropdown
                label="CONSULTA"
                icon={MdSearch}
                items={consultasItems}
              />
            )}

            {user.currentPerfil === 'SISFARD - COLOG' && (
              <MenuDropdown
                label="CONSULTA"
                icon={MdSearch}
                items={consultasItemsColog}
              />
            )}

            {user.currentPerfil === 'SISFARD - BCG' && (
              <MenuDropdown
                label="CADASTRO"
                icon={MdEdit}
                items={cadastroIndividual}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SideBarMobile;
