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


// Function to generate the next expenseID based on the largest existing expenseID in the expense data
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


// const generateExpenseID = (expenseData) => {
//   if (expenseData.length === 0) return 'exp001'; // Default ID if no expenses exist

//   const lastExpenseID = expenseData[0]?.expenseID; // Get the ID of the last expense (first in descending order)
//   const numericPart = parseInt(lastExpenseID.match(/\d+/)[0], 10); // Extract numeric part
//   const newNumericPart = numericPart + 1; // Increment numeric part
//   return `exp${newNumericPart.toString().padStart(3, '0')}`; // Construct new expense ID
// };



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
const ExpenseForm = ({ initialValues, onSubmit, onCancel, label, setLabel, expensesData, setIsAddLoadingCus, isAddLoadingCus, isEditing }) => {
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

// ExpenseDialog component
// const ExpenseDialog = ({ open, onClose, expense, onSubmit, handleDelete, label, expensesData, setIsAddLoadingCus }) => {
//   const isEditing = Boolean(expense);
//   const title = isEditing ? 'Edit Expense' : 'Record New Expense';
//   const theme = useTheme();

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         <ExpenseForm
//           initialValues={expense}
//           onSubmit={(values) => {
//             onSubmit(values);
//           }}
//           onCancel={onClose}
//           label={label}
//           expensesData={expensesData}
//           setIsAddLoadingCus={setIsAddLoadingCus}
//         />
        
//         {isEditing && (
//           <DeleteIcon
//             sx={{
//               mt: '10px',
//               color: 'grey',
//               cursor: 'pointer'
//             }}
//             onClick={() => handleDelete(expense)}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };
const ExpenseDialog = ({ open, onClose, expense, onSubmit, handleDelete, label, expensesData, setIsAddLoadingCus, isAddLoadingCus }) => {
  const isEditing = Boolean(expense);
  const title = isEditing ? 'Edit Expense' : 'Record New Expense';
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ExpenseForm
          initialValues={expense}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          onCancel={onClose}
          label={label}
          expensesData={expensesData}
          setIsAddLoadingCus={setIsAddLoadingCus}
          isEditing={isEditing}
          isAddLoadingCus={isAddLoadingCus}
        />
        
        {isEditing && (
          <DeleteIcon color='error'
            sx={{
              mt: '-70px',
              cursor: 'pointer'
            }}
            onClick={() => handleDelete(expense)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// DeleteConfirmationDialog component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme, isDeleteLoading  }) => {
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
          {isDeleteLoading  ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Submit"
                        )}
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
  const { isLoading: isExpensesLoading,  refetch } = useGetExpensesQuery();
  const [label, setLabel] = useState('')
  const token = useSelector(selectCurrentToken)
  const [isAddLoadingCus, setIsAddLoadingCus]=useState(false)
  const [isDatatLoadingCus, setIsDataLoadingCus]=useState(false)
  const expensesData = useSelector(selectAllExpenses);
  const role = useSelector(selectCurrentRole)





  useEffect(() => {
    console.log(expensesData);
  }, [expensesData]);


 

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



  const [addExpense, {isLoading: isExpenseAdding}] = useAddExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense, {isLoading: isDeleteLoading}] = useDeleteExpenseMutation();

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

        const response = await fetch(`https://jta-node-api.onrender.com/expense/${expenseID}/${date}`, requestOptions);
        
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



  // const handleSubmit = async (values) => {
  //   try {
  //   //   if (editingExpense) {
  //   //     await updateExpense(values).unwrap();
  //   //     toast.success('Expense updated successfully');
  //   //   } else {
  //       await addExpense(values).unwrap();
  //       toast.success('Expense added successfully');
  //     // }
  //     handleCloseDialog();
  //   } catch (error) {
  //     toast.error('An error occurred. Please try again.');
  //   }
  // };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpenDialog(true);
  };

  const handleDelete = (expense) => {
    setOpenDeleteDialog(true);
    setSelectedExpense(expense)
  };

  const handleConfirmDelete = async () => {
  try { 
    const {expenseID, date} = selectedExpense
    console.log({ expenseID, date})
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`https://jta-node-api.onrender.com/expense/${expenseID}/${date}`, requestOptions)
      .then((response) => {
         if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`Error ${response.status}`);
        } else{
          response.json() 
          setOpenDialog(false);
          setIsDataLoadingCus(true)
         
        
        }
  })
      .then((result) => refetch())
      .catch((error) => console.error(error));
      toast.success('Selected expense(s) deleted successfully');
      setSelectedExpense(null);

  } catch (error) {
    toast.error('An error occurred while deleting expense(s). Please try again.');
    return (error.response.data);
    
  } 
  finally{
    setOpenDeleteDialog(false);
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
        
          (isExpensesLoading || isExpenseAdding || isAddLoadingCus || isDatatLoadingCus) ? 
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
      <Header title="EXPENSES" color='#10453e' />
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
      />
      <ToastContainer />
    </Box>
  );
};

export default Expenses;