import React from 'react';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CaptureDashboardButton = () => {
  const captureDashboard = () => {
    const input = document.getElementById('dashboard-content');
    if (!input) {
      console.error('Dashboard content not found');
      return;
    }

    // Hide the date range picker
    const dateRangePicker = document.querySelector('.date-range-picker');
    if (dateRangePicker) {
      dateRangePicker.style.display = 'none';
    }

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('dashboard.pdf');

      // Show the date range picker again
      if (dateRangePicker) {
        dateRangePicker.style.display = '';
      }
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={captureDashboard}
      sx={{ marginBottom: '9' }}
    >
      Capture Dashboard as PDF
    </Button>
  );
};

export default CaptureDashboardButton;
