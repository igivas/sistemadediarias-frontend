import React, { useState } from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import api from 'services/api';
import { SiMicrosoftexcel } from 'react-icons/si';
import { Button, HStack, Tooltip, useToast } from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';

interface IProps {
  fileName: string;
  headers: string[];
  csvData?: any;
  async?: boolean;
  serverPagination?: boolean;
  url?: string;
}
const ExportCSV: React.FC<IProps> = ({
  csvData,
  fileName,
  headers,
  async = false,
  serverPagination = false,
  url,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const renameColumn = (ws: any): void => {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.r; C <= range.e.r; ++C) {
      const address = `${XLSX.utils.encode_col(C)}1`; // <-- first row, column number C

      // eslint-disable-next-line
      if (!ws[address]) continue;
      // eslint-disable-next-line
      ws[address].v = headers[C].toUpperCase();
    }
  };

  const exportToCSV = (dataCsv: any, filename: string): void => {
    const ws = XLSX.utils.json_to_sheet(dataCsv);
    renameColumn(ws);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
  };

  const requestData = async (): Promise<void> => {
    if (async) {
      setLoading(true);
      try {
        const response = await api.get(url || '');
        exportToCSV(
          serverPagination ? response.data.items : response.data,
          fileName,
        );
        toast({
          title: 'Sucesso!',
          description: 'Arquivo baixado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        toast({
          title: 'Erro!',
          description: 'Ocorreu um erro ao baixar o arquivo!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setLoading(false);
    } else {
      exportToCSV(csvData, fileName);
    }
  };

  return (
    <>
      <HStack>
        {loading && (
          <PulseLoader size={8} margin={3} color="#1a8d4c" loading={loading} />
        )}
        <Tooltip hasArrow label="Baixar" placement="top" ml={2}>
          <Button
            colorScheme="green"
            rightIcon={<SiMicrosoftexcel size={22} />}
            onClick={() => requestData()}
            size="sm"
          >
            {loading ? 'Carregando...' : 'Baixar planilha'}
          </Button>
        </Tooltip>
      </HStack>
    </>
  );
};

export default ExportCSV;
