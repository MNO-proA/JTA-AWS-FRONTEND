/* eslint-disable react/prop-types */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetExpensesQuery, selectAllExpenses } from "../../features/expenses/expenseSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";

// Validation schema for the expense form
const expenseValidationSchema = Yup.object().shape({
  Administrative: Yup.number().required('Administrative expense is required'),
  IT: Yup.number().required('IT expense is required'),
  Maintenance: Yup.number().required('Maintenance expense is required'),
  Miscellaneous: Yup.number().required('Miscellaneous expense is required'),
  'Ofsted (Admin)': Yup.number().required('Ofsted (Admin) expense is required'),
  'Petty Cash': Yup.number().required('Petty Cash expense is required'),
  'REG 44': Yup.number().required('REG 44 expense is required'),
  'Young Person Weekly Money': Yup.number().required('Young Person Weekly Money expense is required'),
  date: Yup.date().required('Date is required'),
});

// ExpenseForm component
const ExpenseForm = ({ initialValues, onSubmit, onCancel, label, setLabel }) => {
  const theme = useTheme();
  const [customFields, setCustomFields] = useState([]);

  const formik = useFormik({
    initialValues: initialValues || {
      Administrative: '',
      IT: '',
      Maintenance: '',
      Miscellaneous: '',
      'Ofsted (Admin)': '',
      'Petty Cash': '',
      'REG 44': '',
      'Young Person Weekly Money': '',
      date: '',
      ...customFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
    },

    validationSchema: expenseValidationSchema,
    onSubmit: (values) => {
      const expenseData = {
        ...values,
        ...customFields.reduce((acc, field) => ({ ...acc, [field.name]: values[field.name] }), {}),
      };
      onSubmit(expenseData);
    },
  });

  const addCustomField = () => {
    const newField = {
      name: label,
      label: `Custom Field ${customFields.length + 1}`,
    };
    setCustomFields([...customFields, newField]);
    formik.setFieldValue(newField.name, '');
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.keys(formik.initialValues).map((field) => (
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
        {customFields.map((field) => (
          <>
          <TextField
            key={field.name}
            fullWidth
            id={field.name}
            name={field.name}
            label={field.label}
            type="number"
            value={formik.values[field.name]}
            onChange={formik.handleChange}
          />
           <TextField
          id="custom-expense-name"
          label="Custom Expense Name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
        />
          </>
        ))}
        <IconButton onClick={addCustomField} sx={{ alignSelf: 'flex-start' }}>
          <AddIcon />
        </IconButton>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} sx={{ color: theme.palette.grey[500] }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }}>
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

// ExpenseDialog component
const ExpenseDialog = ({ open, onClose, expense, onSubmit, handleDelete, label }) => {
  const isEditing = Boolean(expense);
  const title = isEditing ? 'Edit Expense' : 'Record New Expense';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ExpenseForm
          initialValues={expense}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
          onCancel={onClose}
          label={label}
        />
        
        {isEditing && (
          <DeleteIcon
            sx={{
              mt: '-70px',
              color: 'grey',
            }}
            onClick={handleDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// DeleteConfirmationDialog component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the selected expense(s)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{
          marginTop: '10px',
          color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={{
          marginTop: '10px',
          color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Updated Expenses component
const Expenses = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isLoading: isExpensesLoading } = useGetExpensesQuery();
  const [label, setLabel] = useState('')

  const expensesData = useSelector(selectAllExpenses);
  useEffect(() => {
    console.log(expensesData);
  }, [expensesData]);

  // Uncomment these lines when you have the actual mutation hooks
  // const [addExpense] = useAddExpenseMutation();
  // const [updateExpense] = useUpdateExpenseMutation();
  // const [deleteExpense] = useDeleteExpenseMutation();

  const handleOpenDialog = () => {
    setEditingExpense(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingExpense) {
        // await updateExpense(values).unwrap();
        toast.success('Expense updated successfully');
      } else {
        // await addExpense(values).unwrap();
        toast.success('Expense added successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // await deleteExpense(selectedExpense).unwrap();
      toast.success('Selected expense(s) deleted successfully');
      setSelectedExpense(null);
    } catch (error) {
      toast.error('An error occurred while deleting expense(s). Please try again.');
    }
    setOpenDeleteDialog(false);
  };

  const columns = [
    { field: 'expenseID', headerName: 'Expense ID', flex: 1, minWidth: 100  },
    { field: 'Administrative', headerName: 'Administrative', flex: 1, minWidth: 100  },
    { field: 'IT', headerName: 'IT', flex: 1 },
    { field: 'Maintenance', headerName: 'Maintenance', flex: 1, minWidth: 100  },
    { field: 'Miscellaneous', headerName: 'Miscellaneous', flex: 1, minWidth: 100  },
    { field: 'Ofsted (Admin)', headerName: 'Ofsted (Admin)', flex: 1, minWidth: 100  },
    { field: 'Petty Cash', headerName: 'Petty Cash', flex: 1, minWidth: 100  },
    { field: 'REG 44', headerName: 'REG 44', flex: 1, minWidth: 100  },
    { field: 'Young Person Weekly Money', headerName: 'Young Person Weekly Money', flex: 1, minWidth: 100  },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 100  },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params) => (
        <EditIcon onClick={() => handleEdit(params.row)} sx={{
          color: 'grey'
        }}/>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="EXPENSES" color='#10453e' />
      <Button
        sx={{
          marginTop: '10px',
          color: '#10453e',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }}
        variant="contained"
        onClick={handleOpenDialog}
      >
        Record Expense
      </Button>
      <Box
        m="40px 0 0 0"
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            overflow: "auto",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            // backgroundColor: theme.palette.background.alt,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          '& .MuiCheckbox-root': {
            color: '#555',
          },
          '& .MuiCheckbox-colorPrimary.Mui-checked': {
            color: '#555'
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={expensesData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.expenseID}
          width="100%"
          disableExtendRowFullWidth={false}
          scrollbarSize={10}
          
        />
      </Box>
      <ExpenseDialog
        open={openDialog}
        onClose={handleCloseDialog}
        expense={editingExpense}
        onSubmit={handleSubmit}
        handleDelete={handleDelete}
        label={label}
        setLabel={setLabel}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
      />
      <ToastContainer />
    </Box>
  );
};

export default Expenses;