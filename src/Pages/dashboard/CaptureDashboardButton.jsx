import { useTheme } from '@mui/material';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';

const GeneratePDFButton = () => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const generatePDF = async () => {
    const charts = document.querySelectorAll('.chart-container');
    const pdf = new jsPDF('p', 'mm', 'a4');
    let pageNumber = 1;
    setIsLoading(true)

    for (const chart of charts) {
      // Temporarily remove background and border
      const originalStyle = chart.style.cssText;
      chart.style.background = 'none';
      chart.style.border = 'none';

      const canvas = await html2canvas(chart, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      if (pageNumber > 1) {
        pdf.addPage();
      }

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Restore original style
      chart.style.cssText = originalStyle;

      pageNumber++;
    }

    pdf.save('dashboard_charts.pdf');
    setIsLoading(false)
  };

  return (
    <Button variant="contained" style={{color: theme.palette.secondary[100]}} onClick={generatePDF}>
      <strong> {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Generate Chart PDF"
                        )}</strong>
    </Button>

  );
};

export default GeneratePDFButton;
