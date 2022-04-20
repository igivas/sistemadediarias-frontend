import { Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';

type IValues = {
  nome_evento: string;
  comandante_resp_pedido: string;
};

type IProps = {
  step0?: IValues;
};

const ResumoViagem: React.FC<IProps> = () => {
  return <div>teste</div>;
};
export default ResumoViagem;
