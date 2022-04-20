import React from 'react';
import { Switch } from 'react-router-dom';

import FinalidadeNovo from 'pages/Finalidade/Cadastrar';

import HospedagemNovo from 'pages/Hospedagem/Cadastrar';
import TransporteNovo from 'pages/Transporte/Cadastrar';
import Novo from '../pages/ViagemIntermunicipal/Novo';
import Home from '../pages/Home';
import Route from './Route';
import SignIn from '../pages/SignIn';
import ListClasse from '../pages/Classe/ListClasse';
import ListClasseCargo from '../pages/ClasseCargo/ListClasseCargo';
import ListCredor from '../pages/Credor/ListCredor';
import ListLegislacao from '../pages/Legislacao/ListLegislacao';
import ListFinalidade from '../pages/Finalidade/ListFinalidade';
import ListHospedagem from '../pages/Hospedagem/ListHospedagem';
import ListTransporte from '../pages/Transporte/ListTransporte';
import ConsultaLegislacao from '../pages/Legislacao/ConsultaLegislacao';
import ConsultaFinalidade from '../pages/Finalidade/ConsultaFinalidade';
import ConsultaTransporte from '../pages/Transporte/ConsultaTransporte';
import ConsultaHospedagem from '../pages/Hospedagem/ConsultaHospedagem';
import ConsultaClasse from '../pages/Classe/ConsultaClasse';
import ConsultaClasseCargo from '../pages/ClasseCargo/ConsultaClasseCargo';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/home" component={Home} isPrivate />
      <Route path="/classes" component={ListClasse} isPrivate />
      <Route path="/classescargos" component={ListClasseCargo} isPrivate />
      <Route path="/legislacoes" component={ListLegislacao} isPrivate />
      <Route path="/finalidades" component={ListFinalidade} isPrivate />
      <Route path="/hospedagens" component={ListHospedagem} isPrivate />
      <Route path="/transportes" component={ListTransporte} isPrivate />
      <Route path="/finalidadenovo" component={FinalidadeNovo} isPrivate />
      <Route path="/hospedagemnovo" component={HospedagemNovo} isPrivate />
      <Route path="/viagemintermunicipal" component={Novo} isPrivate />
      <Route path="/transportenovo" component={TransporteNovo} isPrivate />
      <Route path="/listalegislacao" component={ConsultaLegislacao} isPrivate />
      <Route path="/listafinalidade" component={ConsultaFinalidade} isPrivate />
      <Route path="/listatransporte" component={ConsultaTransporte} isPrivate />
      <Route path="/listahospedagem" component={ConsultaHospedagem} isPrivate />
      <Route path="/listaclasse" component={ConsultaClasse} isPrivate />
      <Route path="/credor" component={ListCredor} isPrivate />
      <Route
        path="/listaclassecargo"
        component={ConsultaClasseCargo}
        isPrivate
      />
    </Switch>
  );
};

export default Routes;
