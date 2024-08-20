/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import { Box, TextField,  Button } from '@mui/material';

const generateExpenseID = (expenseData) => {
    const defaultID = 'exp001'; // Default ID if no expenses exist
  
    if (expenseData.length === 0) return defaultID;
  
    // Find the maximum numeric part from all expenseIDs
    const maxNumericPart = expenseData.reduce((max, item) => {
      const match = item.expenseID.match(/\d+$/);
      if (match) {
        const numericPart = parseInt(match[0], 10);
        return Math.max(max, numericPart);
      }
      return max;
    }, 0);
  
    // If no valid IDs found, return default
    if (maxNumericPart === 0) return defaultID;
  
    const newNumericPart = maxNumericPart + 1; // Increment numeric part
    return `exp${newNumericPart.toString().padStart(3, '0')}`; // Construct new expense ID
  };
  
  
  
  // Validation schema for the expense form
  const expenseValidationSchema = Yup.object().shape({
    // Administrative: Yup.number().required('Administrative expense is required'),
    // IT: Yup.number().required('IT expense is required'),
    // Maintenance: Yup.number().required('Maintenance expense is required'),
    // Miscellaneous: Yup.number().required('Miscellaneous expense is required'),
    // 'Ofsted (Admin)': Yup.number().required('Ofsted (Admin) expense is required'),
    // 'Petty Cash': Yup.number().required('Petty Cash expense is required'),
    // 'REG 44': Yup.number().required('REG 44 expense is required'),
    // 'Young Person Weekly Money': Yup.number().required('Young Person Weekly Money expense is required'),
    date: Yup.date().required('Date is required'),
  });
  
  
  
  
  // ExpenseForm component
// eslint-disable-next-line no-unused-vars
export const ExpenseForm = ({ initialValues, onSubmit, onCancel, label, setLabel, expensesData, setIsAddLoadingCus, isAddLoadingCus, isEditing }) => {
    const theme = useTheme();
    const initialExpensesData = generateExpenseID(expensesData);
  
    const formik = useFormik({
      initialValues: initialValues || {
        expenseID: initialExpensesData,
        date: '',
       Transport_Expenses: 0,
       IT_Purchases: 0,
        Maintenance: 0,
        Miscellaneous: 0,
        Ofsted_Admin: 0,
        Petty_Cash: 0,
        REG_44: 0,
        Young_Person_Weekly_Money: 0,
      },
  
      validationSchema: expenseValidationSchema,
      onSubmit: (values) => {
        let expenseData = {
          ...values,
        };
        onSubmit(expenseData);
        setIsAddLoadingCus(true);
        
      },
    });
  
  
  
    return (
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '10px' }}>
          {/* <TextField
            fullWidth
            id="expenseID"
            name="expenseID"
            label="Expense ID"
            value={formik.values.expenseID}
            InputProps={{
              readOnly: true,
            }}
          /> */}
          {Object.keys(formik.initialValues)
            .filter(field => field !== 'expenseID') // Exclude expenseID and index from this loop
            .map((field) => (
              <TextField
                key={field}
                fullWidth
                id={field}
                name={field}
                label={field}
                type={field === 'date' ? 'date' : 'number'}
                value={formik.values[field]}
                onChange={formik.handleChange}
                error={formik.touched[field] && Boolean(formik.errors[field])}
                helperText={formik.touched[field] && formik.errors[field]}
                InputLabelProps={field === 'date' ? { shrink: true } : {}}
              />
            ))}
      
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onCancel} sx={{ color: theme.palette.grey[500] }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: 'grey',
                '&:hover': {
                  backgroundColor: theme.palette.secondary[200],
                  color: theme.palette.primary[900],
                },
              }}
            >
               {isAddLoadingCus  ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            isEditing?
                            "Update":"Submit"
                          )}
            </Button>
          </Box>
        </Box>
      </form>
    );
  };