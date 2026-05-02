import { Button, Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

const ExcelExport = ({ data, fileName }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Box className="flex flex-col items-center gap-4 fluid-padding">
      <Typography variant="h6" className="fluid-text-lg font-semibold text-gray-800">
        Exportar datos a Excel
      </Typography>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleExport}
        disabled={!data || data.length === 0}
        className="bg-brand-primary hover:bg-brand-primary-light"
      >
        Exportar a Excel
      </Button>
    </Box>
  );
};

export default ExcelExport;
