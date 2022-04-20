import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface IDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

interface IDashPanelProps {
  title: string;
  color: string;
  opm: string | undefined;
  data: {
    labels: string[];
    datasets: IDataset[];
  };
  onClick?(): void;
}

const DashPanel: React.FC<IDashPanelProps> = ({
  color,
  title,
  data,
  opm,
  onClick,
}) => {
  const [maiorQue480px] = useMediaQuery('(min-width: 480px)');
  return (
    <Flex
      direction="column"
      p={{ base: '0px', sm: '0px', md: '0px', lg: '20px' }}
      alignItems="center"
      marginBottom={{ sm: '8px', md: '8px', lg: '20px' }}
      width={{ base: '50%', lg: '50%', xl: '50%', md: '100%', sm: '100%' }}
      onClick={onClick}
      cursor="pointer"
    >
      <Box
        bg={color}
        width="100%"
        minHeight="110px"
        borderRadius="4px"
        p="16px"
        flexDirection="column"
        justifyContent="space-between"
        color="#fff"
      >
        <Flex direction="row" justifyContent="space-between">
          <Box fontWeight="bold" fontSize="1.125rem">
            {title}
          </Box>
          <Box fontWeight="bold" fontSize="1.25rem">
            {data.datasets[0].data[0]}/
            {data.datasets[0].data[1] + data.datasets[0].data[0]}
          </Box>
        </Flex>
        <Box fontWeight="400" fontSize="0.95rem">
          {opm}
        </Box>
      </Box>
      {maiorQue480px && (
        <Box
          bg="#fff"
          minHeight="160px"
          mt="8px"
          borderRadius="4px"
          width="100%"
          border="1px solid #ddd"
          align="center"
          py="8px"
        >
          <Flex
            width="80%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            padding="4px"
          >
            <Doughnut
              data={data}
              // options={{
              //   responsive: true,
              // }}
            />
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default DashPanel;
