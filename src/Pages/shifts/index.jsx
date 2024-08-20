/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import  { useState, useEffect } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetShiftsQuery, selectAllShifts, useAddShiftMutation, useDeleteShiftMutation, selectShiftIds } from "../../features/shifts/shiftSlice";
import EditIcon from '@mui/icons-material/Edit';

import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";
import { selectCurrentToken, selectCurrentRole } from "../../features/auth/authSlice"
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import { ShiftDialog } from "./ShiftDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

// ShiftDialog component


// DeleteConfirmationDialog component

// Shifts component
const Shifts = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {isLoading: isShiftsLoading, refetch} = useGetShiftsQuery()
  const { isLoading: isStaffLoading } = useGetStaffQuery();
  const token = useSelector(selectCurrentToken)
  const role = useSelector(selectCurrentRole)
  const shiftsIds = useSelector(selectShiftIds)
  const navigate = useNavigate();
  const shiftsData = useSelector(selectAllShifts)
  const staffsData = useSelector(selectAllStaff);
  const [addShift, {isLoading: isShiftAdding}] = useAddShiftMutation();
  const [ {isLoading: isDeleteLoading}] = useDeleteShiftMutation();
  const [isAddLoadingCus, setIsAddLoadingCus]=useState(false)
  const [isDatatLoadingCus, setIsDataLoadingCus]=useState(false)

  // useEffect(()=>{
  //   console.log(shiftsData)
  //   console.log(shiftsIds)
  // },[shiftsData, shiftsIds])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoadingCus(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [shiftsData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAddLoadingCus(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [shiftsData]);


  
  const handleOpenDialog = () => {
    setEditingShift(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShift(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingShift) {
        const { shiftID, startDate, ...updates } = values;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({ updates }),
          redirect: "follow"
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/shifts/${shiftID}/${startDate}`, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
        toast.success('Shift updated successfully');
        handleCloseDialog();
        refetch();
        setIsAddLoadingCus(true)
      } else {
   
        await addShift(values).unwrap();
        toast.success('Shift added successfully');
        // console.log(values)
       handleCloseDialog();
      //  setIsAddLoadingCus(true)
    } 
  }
  catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (shift) => {
    // console.log(shift)
    setEditingShift(shift);
    setOpenDialog(true);
  };

  const handleDelete = (shift ) => {
    setOpenDeleteDialog(true);
    setSelectedShift(shift)
  };

 
  const handleConfirmDelete = async () => {
      try { 
        const {shiftID, startDate} = selectedShift
        // console.log({shiftID, startDate})
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        
        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };
        
        fetch(`${import.meta.env.VITE_API_URL}/shifts/${shiftID}/${startDate}`, requestOptions)
          .then((response) => {
             if (!response.ok) {
              // Handle HTTP errors
              throw new Error(`Error ${response.status}`);
            } else{
              response.json()  
              setOpenDialog(false)
              setIsDataLoadingCus(true)
            }
      })
          .then((result) => refetch())
          .catch((error) => console.error(error));
        toast.success('Selected shift deleted successfully');
        setSelectedShift('');

      } catch (error) {
        toast.error('An error occurred while deleting shifts. Please try again.');
        return (error.response.data);
        
      } 
      finally{
        setOpenDeleteDialog(false);
        setOpenDialog(false)
    }
  }

  function mapShiftAndStaffData(shiftData, staffData) {
    const shiftRefined = shiftData.filter((shift)=> shift.Absence !== "Yes" )
    return shiftRefined.map(shift => {
        const staff = staffData.find(staff => staff.staffID === shift.staffID);
        if (staff) {
            return {
              shiftID: shift?.shiftID,
              fullName: staff?.fullName,
              staffID: shift.staffID,
              startDate: shift?.startDate,
              End_Date: shift?.End_Date,
              House: shift?.House,
              Shift: shift?.Shift,
              Shift_Start: shift?.Shift_Start,
              Shift_End: shift?. Shift_End,
              Overtime: shift?.Overtime,
              Total_Hours: shift?.Total_Hours,
              Total_Wage: shift?.Total_Wage,
            };
        } else {
            // Handle case where staffID is not found in staffData
            return {
              shiftID: shift?.shiftID,
              fullName: "Unknown",
              startDate: shift?.startDate,
              End_Date: shift?.End_Date,
              Overtime: shift?.Overtime,
              Total_Hours: shift?.Total_Hours,
              Total_Wage: shift?.Total_Wage,
              House: shift?.House,
            };
        }
    });
}

const revisedShiftsData = mapShiftAndStaffData(shiftsData, staffsData)
const revisedShiftsDataWithIndex = revisedShiftsData.map((shift, index) => ({
  ...shift,
  index: revisedShiftsData.length - index
}));
const getRowId = (row) => row.index;
  const columns = [
    { field: 'index', headerName: 'Index', flex:0.2 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.4 },
    { field: 'End_Date', headerName: 'End Date', flex: 0.4 },
    { field: 'Shift', headerName: 'Shift', flex: 0.2 },
    { field: 'House', headerName: 'House', flex: 0.5 },
    { field: 'fullName', headerName: 'Full Name', flex: 0.7 },
    { field: 'Overtime', headerName: 'Overtime', flex: 0.3 },
    { field: 'Total_Hours', headerName: 'Total Hours', flex: 0.3 },
    { field: 'Total_Wage', headerName: 'Total Wage(£)', flex: 0.4 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params) => (
        isShiftsLoading || isShiftAdding || isDatatLoadingCus || isAddLoadingCus? <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>: 
      (role === "ADMIN")? ( <EditIcon  onClick={() =>  handleEdit(params.row)} />) 
        :   <LockIcon sx={{color: theme.palette.secondary[300]}}/>
      ),
    },
  ];


  return (
    <Box m="20px" >
      <Header title="SHIFTS"  color= '#10453e' />
      {role === "ADMIN" ? 
      <Button
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
        <strong >Record Shifts</strong>
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
          rows={revisedShiftsDataWithIndex}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
        />
      </Box>
      <ShiftDialog
        open={openDialog}
        onClose={handleCloseDialog}
        shift={editingShift}
        onSubmit={handleSubmit}
        handleDelete={handleDelete}
        staffsData={staffsData}
        shiftsData={shiftsData}
        shiftsIds={shiftsIds}
        navigate={navigate}
        setIsAddLoadingCus={ setIsAddLoadingCus}
        isShiftAdding={isShiftAdding}
        isDatatLoadingCus={isDatatLoadingCus}
        isAddLoadingCus={isAddLoadingCus}
        isShiftsLoading={isShiftsLoading}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
        isDeleteLoading = {isDeleteLoading }
        token = {token }
        isDatatLoadingCus={isDatatLoadingCus}
        isShiftsLoading={isShiftsLoading}
      />
      <ToastContainer />
    </Box>
  );
};

export default Shifts;


