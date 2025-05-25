import React from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ExportExcel = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get('/api/papers/export', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'extracted_papers.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      color="success"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      sx={{ mt: 2 }}
    >
      Export to Excel
    </Button>
  );
};

export default ExportExcel;