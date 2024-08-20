/* eslint-disable no-unused-vars */
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
import { useGetExpensesQuery, selectAllExpenses, useAddExpenseMutation, useDeleteExpenseMutation, useUpdateExpenseMutation } from "../../features/expenses/expenseSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentRole } from "../../features/auth/authSlice"
import LockIcon from '@mui/icons-material/Lock';
import { ExpenseDialog } from './expenseDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

// DeleteConfirmationDialog component


// Updated Expenses component
const Expenses = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isLoading: isExpensesLoading,  refetch } = useGetExpensesQuery();
  const [label, setLabel] = useState('')
  const token = useSelector(selectCurrentToken)
  const [isAddLoadingCus, setIsAddLoadingCus]=useState(false)
  const [isDataLoadingCus, setIsDataLoadingCus]=useState(false)
  const expensesData = useSelector(selectAllExpenses);
  const role = useSelector(selectCurrentRole)
  const [addExpense, {isLoading: isExpenseAdding}] = useAddExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense, {isLoading: isDeleteLoading}] = useDeleteExpenseMutation();

  // useEffect(() => {
  //   console.log(expensesData);
  // }, [expensesData]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoadingCus(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [expensesData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAddLoadingCus(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [expensesData]);
 

  const handleOpenDialog = () => {
    setEditingExpense(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };


  const handleSubmit = async (values) => {
    setIsAddLoadingCus(true);
    try {
      if (editingExpense) {
        const { expenseID, date, index, ...updates } = values;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({ updates }),
          redirect: "follow"
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/expense/${expenseID}/${date}`, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
        toast.success('Expense updated successfully');
        refetch();
      } else {
        await addExpense(values).unwrap();
        toast.success('Expense added successfully');
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsAddLoadingCus(false);
      handleCloseDialog();
    }
  };


  const handleEdit = (expense) => {
    const {index, ...updatedExpense} = expense
    setEditingExpense(updatedExpense);
    setOpenDialog(true);
  };

  const handleDelete = (expense) => {
    setOpenDeleteDialog(true);
    setSelectedExpense(expense)
  };

  const handleConfirmDelete = async () => {
  try { 
    const {expenseID, date} = selectedExpense
    // console.log({ expenseID, date})
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`${import.meta.env.VITE_API_URL}/expense/${expenseID}/${date}`, requestOptions)
      .then((response) => {
         if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`Error ${response.status}`);
        } else{
          response.json() 
          setIsDataLoadingCus(true) 
          refetch()
          toast.success('Selected expense(s) deleted successfully');
          
        }
  })
      .then((result) => refetch())
      .catch((error) => console.error(error));
      setSelectedExpense(null);

  } catch (error) {
    toast.error('An error occurred while deleting expense(s). Please try again.');
    return (error.response.data);
    
  } 
  finally{
    setOpenDeleteDialog(false);
    handleCloseDialog()
}
}
const expensesDataWithIndex = expensesData.map((expense, index) => ({
  ...expense,
  index: expensesData.length - index
}));

const getRowId = (row) => row.index;
  const columns = [
    { field: 'index', headerName: 'Index', flex: 0.2 },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 100  },
    { field: 'Transport_Expenses', headerName: 'Transport Expenses', flex: 1, minWidth: 100  },
    { field: 'IT_Purchases', headerName: 'IT/Purchases', flex: 1 },
    { field: 'Maintenance', headerName: 'Maintenance', flex: 1, minWidth: 100  },
    { field: 'Miscellaneous', headerName: 'Miscellaneous', flex: 1, minWidth: 100  },
    { field: 'Ofsted_Admin', headerName: 'Ofsted (Admin)', flex: 1, minWidth: 100  },
    { field: 'Petty_Cash', headerName: 'Petty Cash', flex: 1, minWidth: 100  },
    { field: 'REG_44', headerName: 'REG 44', flex: 1, minWidth: 100  },
    { field: 'Young_Person_Weekly_Money', headerName: 'YPWM', flex: 1, minWidth: 100  },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params) => (
        
          (isExpensesLoading || isExpenseAdding || isAddLoadingCus || isDataLoadingCus) ? 
          ( <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span> )
        : (role === "ADMIN")? (  <EditIcon 
          style={{ cursor: 'pointer', marginRight: '10px' }} 
          onClick={() => handleEdit(params.row)} 
        />) 
        :   <LockIcon sx={{color: theme.palette.secondary[300]}}/>
      )
    }
  ];

  return (
    <Box m="20px">
      <Header title="EXPENSE" color='#10453e' />
      {role === "ADMIN"? <Button
        sx={{
          marginTop: '10px',
          color: theme.palette.secondary[100],
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }}
        variant="contained"
        onClick={handleOpenDialog}
      >
          <strong>Record Expense</strong>
      </Button> 
      :  
      <LockIcon sx={{color: theme.palette.secondary[300]}}/>
        }
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
          rows={expensesDataWithIndex}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
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
        expensesData={expensesData}
        setIsAddLoadingCus={setIsAddLoadingCus}
        isAddLoadingCus={isAddLoadingCus}
        
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
        isDeleteLoading = {isDeleteLoading }
        isDataLoadingCus={isDataLoadingCus}
        isExpensesLoading={isExpensesLoading}
      />
      <ToastContainer />
    </Box>
  );
};

export default Expenses;