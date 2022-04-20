import React, { useEffect, useState } from 'react';
import api from 'services/api';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/auth';

const Home: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <>
      <h1>PAGINA INICIAL</h1>
    </>
  );
};

export default Home;
