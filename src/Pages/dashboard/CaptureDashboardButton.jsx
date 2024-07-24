
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const CaptureDashboardButton = () => {
  const handleCapture = async () => {
    // Exclude the datepicker and shortcuts from the capture
    const dashboardElement = document.getElementById('dashboard');
    const datePickerElement = document.getElementById('datepicker');
    const shortcutElement = document.getElementById('shortcuts');

    // Temporarily hide datepicker and shortcuts
    if (datePickerElement) datePickerElement.style.display = 'none';
    if (shortcutElement) shortcutElement.style.display = 'none';

    // Capture the dashboard
    const canvas = await html2canvas(dashboardElement);
    const dataUrl = canvas.toDataURL('image/png');

    // Restore the visibility of datepicker and shortcuts
    if (datePickerElement) datePickerElement.style.display = '';
    if (shortcutElement) shortcutElement.style.display = '';

    // Create a link to download the image
    saveAs(dataUrl, 'dashboard.png');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleCapture}>
      Capture Dashboard
    </Button>
  );
};

export default CaptureDashboardButton;
