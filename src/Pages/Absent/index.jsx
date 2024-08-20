/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme, Checkbox, FormControlLabel, Button } from "@mui/material";
import  { useState, useEffect, useMemo} from 'react';
import { Box,  } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useGetShiftsQuery, selectAllShifts , useDeleteShiftMutation, useAddShiftMutation, selectShiftIds } from "../../features/shifts/shiftSlice";
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import { selectCurrentToken, selectCurrentRole } from "../../features/auth/authSlice"
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AbsentDialog } from "./AbsenceDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";




const AbsentReadOnly = () => {
    const theme = useTheme();
    const navigate = useNavigate()
    const {isLoading: isShiftsLoading, refetch} = useGetShiftsQuery()
    const { isLoading: isStaffLoading } = useGetStaffQuery();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [selectedShift, setSelectedShift] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDataLoadingCus, setIsDataLoadingCus] = useState(false)
    const token = useSelector(selectCurrentToken)
    const role = useSelector(selectCurrentRole)
    const [{isLoading: isDeleteLoading}] = useDeleteShiftMutation();
    const [addShift, {isLoading: isShiftAdding}] = useAddShiftMutation();
    const staffsData = useSelector(selectAllStaff);
    const shiftsData = useSelector(selectAllShifts)
    const [isAddLoadingCus, setIsAddLoadingCus]=useState(false)
    const shiftsIds = useSelector(selectShiftIds)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoadingCus(false);
    }, 3000);

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

 
  // useEffect(()=>{
  //   console.log(shiftsIds)
  //   // console.log(absenceDuration)
  //   // console.log(endDate)
  // },[shiftsIds])


  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDataLoadingCus(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [shiftsData]);

    const handleDelete = (shift ) => {
      setOpenDeleteDialog(true);
      setSelectedShift(shift)
    };

    const handleOpenDialog = () => {
      setEditingShift(null);
      setOpenDialog(true);
    };
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setEditingShift(null);
    };
    const handleEdit = (shift) => {
      // console.log(shift)
      setEditingShift(shift);
      setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
      try { 
        // console.log(selectedShift)
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
              setIsDataLoadingCus(true)
              refetch()
              toast.success('Selected Absent deleted successfully');
            }
      })
          .then((result) => refetch())
          .catch((error) => console.error(error));
        
        setSelectedShift('');

      } catch (error) {
        toast.error('An error occurred while deleting shifts. Please try again.');
        return (error.response.data);
        
      } 
      finally{
        setOpenDeleteDialog(false);
        handleCloseDialog()
    }
  }
  


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
          setIsDataLoadingCus(true)
          setIsAddLoadingCus(true)
          refetch();
        } else {

          await addShift(values).unwrap();
          toast.success('Shift added successfully');
          // console.log(values)
          handleCloseDialog();
      } 
    }
    catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    };
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ShiftDialog component

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const processedAbsenceData = useMemo(() => {
      const mapShiftAndStaffData = (shiftData, staffData) => {
        const shiftRefined = shiftData.filter((shift) => shift.Absence === "Yes");
        return shiftRefined.map((shift, index) => {
          const staff = staffData.find(staff => staff.staffID === shift.staffID);
          const startDate = dayjs(shift.startDate);
          const endDate = dayjs(shift.End_Date);
          const today = dayjs();
    
          let absenceDuration = shift.Absence_Duration;
          if (typeof absenceDuration !== 'number' || isNaN(absenceDuration)) {
            absenceDuration = endDate.isValid() ? endDate.diff(startDate, 'day') + 1 : null;
          }
    
          let daysRemaining = endDate.isValid() ? endDate.diff(today, 'day') + 1 : null;
          // Adjust daysRemaining if staff has returned to work
          if (shift.ReturnedToWork) {
            daysRemaining = null; // or any other value indicating the absence is no longer valid
          }
    
          return {
            index: shiftRefined.length - index,
            shiftID: shift.shiftID,
            startDate: startDate.isValid() ? startDate.format('YYYY-MM-DD') : 'Input Start Date',
            End_Date: endDate.isValid() ? endDate.format('YYYY-MM-DD') : 'Input End Date',
            fullName: staff ? staff.fullName : "Unknown Staff",
            Absence: shift.Absence,
            Absence_Status: shift.Absence_Status,
            Absence_Duration: absenceDuration,
            daysRemaining: daysRemaining,
            staffID: staff?.staffID,
            ReturnedToWork: shift.ReturnedToWork 
          };
        });
      };
    
      return mapShiftAndStaffData(shiftsData, staffsData);
    }, [shiftsData, staffsData]);
    
  
    const columns = [
      { field: 'index', headerName: 'Index', flex: 0.1 },
      { field: 'startDate', headerName: 'Start Date', flex: 0.3},
      { field: 'End_Date', headerName: 'End Date', flex: 0.3},
      { field: 'fullName', headerName: 'Staff Name', flex: 0.5},
      { field: 'Absence', headerName: 'Absence', flex: 0.3},
      { field: 'Absence_Status', headerName: 'Absence Status', flex: 0.4 },
      { 
        field: 'Absence_Duration', 
        headerName: 'Absence Duration (days)', 
        flex: 0.6,
        renderCell: (params) => {
          const { Absence_Duration, daysRemaining } = params.row;
          
          if (Absence_Duration === null || daysRemaining === null) {
            return (
              <div style={{ backgroundColor: theme.palette.secondary[700], width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Absence_Duration}
              </div>
            );
          }
          
          const cellStyle = {
            backgroundColor: daysRemaining <= 0 ? theme.palette.error.light : theme.palette.success.light,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
          };
  
          const durationText = `${Absence_Duration} day(s)`;
          const remainingText = daysRemaining <= 0 
            ? `(${Math.abs(daysRemaining)} day(s) overdue)` 
            : `(${daysRemaining} day(s) remaining)`;
  
          return (
            <div style={cellStyle}>
              <span>{durationText}</span>
              <span style={{ fontStyle: 'italic' }}>{remainingText}</span>
            </div>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 60,
        renderCell: (params) => (
          isShiftsLoading || isShiftAdding || isDataLoadingCus? <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        : 
        role === "ADMIN"?
          <EditIcon  onClick={() => handleEdit(params.row)} />
          : 
          <LockIcon sx={{color: theme.palette.secondary[300]}}/>
        ),
      },
    ];
  
    return (
      <Box m="20px" >
        <Header title="ABSENCE"  color= '#10453e' />
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
        <strong >Record Absence</strong>
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
            rows={processedAbsenceData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.index}
          />
        </Box>
        <AbsentDialog
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
        isShiftAdding={ isShiftAdding}
        isDatatLoadingCus={isDataLoadingCus}
        isAddLoadingCus={isAddLoadingCus}
        isShiftsLoading={isAddLoadingCus} 
      />
        <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
        isDeleteLoading = {isDeleteLoading }
        token = {token }
        isDataLoadingCus={isDataLoadingCus}
        isShiftsLoading={isShiftsLoading}
      />
      <ToastContainer />
      </Box>
    );
}

export default AbsentReadOnly






