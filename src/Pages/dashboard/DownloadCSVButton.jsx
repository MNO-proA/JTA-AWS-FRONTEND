/* eslint-disable react/prop-types */
import { Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { saveAs } from 'file-saver';

const DownloadCSVButton = ({ staffData, shiftData, expenseData }) => {
    const theme = useTheme()
    const convertToCSV = (data, fields) => {
        const csvRows = [];
    
        // Add the header row
        const headers = fields.join(',');
        csvRows.push(headers);
    
        // Add the data rows
        data.forEach(row => {
            const values = fields.map(field => {
                const escaped = ('' + row[field]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });
    
        return csvRows.join('\n');
    };
    

    const handleDownload = () => {
        // Join staff and shift data on staffID
        const joinedData = shiftData.map(shift => {
            const staff = staffData.find(staff => staff.staffID === shift.staffID);
            return {
                fullName: staff?.fullName,
                employmentType: staff?.employmentType,
                hourlyRate: staff?.hourlyRate,
                jobTitle: staff?.jobTitle,
                absence: shift.Absence,
                absenceDuration: shift.Absence_Duration,
                absenceStatus: shift.Absence_Status,
                endDate: shift.End_Date,
                house: shift.House,
                overtime: shift.Overtime,
                shift: shift.Shift,
                shiftEnd: shift.Shift_End,
                shiftStart: shift.Shift_Start,
                totalHours: shift.Total_Hours,
                totalWage: shift.Total_Wage,
                startDate: shift.startDate,
            };
        });

        // Define fields for CSV
        const shiftFields = [
            'fullName', 'employmentType', 'hourlyRate', 'jobTitle', 
            'absence', 'absenceDuration', 'absenceStatus', 'endDate', 
            'house', 'overtime', 'shift', 'shiftEnd', 'shiftStart', 
            'totalHours', 'totalWage', 'startDate'
        ];
        const expenseFields = [
            'IT_Purchases', 'Maintenance', 'Miscellaneous', 'Ofsted_Admin',
            'Petty_Cash', 'REG_44', 'Transport_Expenses', 'Young_Person_Weekly_Money', 'date'
        ];

        // Convert JSON to CSV
        const shiftCSV = convertToCSV(joinedData, shiftFields);
        const expenseCSV = convertToCSV(expenseData, expenseFields);

        // Create and save CSV files
        const shiftBlob = new Blob([shiftCSV], { type: 'text/csv;charset=utf-8;' });
        const expenseBlob = new Blob([expenseCSV], { type: 'text/csv;charset=utf-8;' });
        saveAs(shiftBlob, 'shift_data.csv');
        saveAs(expenseBlob, 'expense_data.csv');
    };
    return (
        <Button variant="contained" style={{color: theme.palette.secondary[100]}} onClick={handleDownload}>
           <strong>Download CSV</strong> 
        </Button>
    );

};

export default DownloadCSVButton;
