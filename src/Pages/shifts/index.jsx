/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import  { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetShiftsQuery, selectAllShifts, useAddShiftMutation, useDeleteShiftMutation, selectShiftIds } from "../../features/shifts/shiftSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";
import { selectCurrentToken, selectCurrentRole } from "../../features/auth/authSlice"
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';



// Validation schema for the shift form
const shiftValidationSchema = Yup.object().shape({
  staffID: Yup.string().required('Staff ID is required'),
  startDate: Yup.date().required('Start date is required'),
  // End_Date: Yup.date().required('End date is required'),
  // House: Yup.string().required('House is required'),
  // Shift: Yup.string().required('Shift is required'),
  // Shift_Start: Yup.string().required('Shift start time is required'),
  // Shift_End: Yup.string().required('Shift end time is required'),
  // Absence: Yup.string().required('Absence is required'),
  // Absence_Status: Yup.string().required('Absence status is required'),
});

const generateShiftID = (shiftData) => {
  if (shiftData.length === 0) return 'S001'; // Default ID if no shifts exist

  // Filter out elements that match the pattern S followed by digits
  const validShiftIDs = shiftData.filter(id => /^S\d+$/.test(id));

  // If no valid IDs found, return default
  if (validShiftIDs.length === 0) return 'S001';

  // Extract numeric parts and find the largest number
  const largestNumericPart = validShiftIDs
    .map(id => parseInt(id.match(/\d+/)[0], 10))
    .reduce((max, num) => Math.max(max, num), 0);

  // Increment the largest number
  const newNumericPart = largestNumericPart + 1;

  // Construct new shift ID
  return `S${newNumericPart.toString().padStart(3, '0')}`;
};




const ShiftForm = ({ initialValues, onSubmit, onCancel, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus, shift,
  isShiftAdding,
  isDatatLoadingCus,
  isAddLoadingCus,
  isShiftsLoading,
  isEditing,

}) => {
  const theme = useTheme();
  const initialShiftID = generateShiftID(shiftsIds);
  
  const formik = useFormik({
    initialValues: initialValues || {
      shiftID: initialShiftID,
      staffID: '',
      startDate: '',
      Absence: 'No',
      Absence_Status: 'Present',
      End_Date: '',
      House: '',
      Shift: '',
      Shift_Start: '',
      Shift_End: '',
      Absence_Duration: 0
    },
    validationSchema: shiftValidationSchema,
    onSubmit: (values) => {
      let shiftData;
    
        const shiftStartTime = new Date(`${values.startDate}T${values.Shift_Start}`);
        const shiftEndTime = new Date(`${values.End_Date}T${values.Shift_End}`);
  
        // If shiftEndTime is earlier than shiftStartTime, add one day to shiftEndTime
        if (shiftEndTime <= shiftStartTime) {
          shiftEndTime.setDate(shiftEndTime.getDate() + 1);
        }
  
        const shiftDuration = (shiftEndTime - shiftStartTime) / (1000 * 60 * 60); // in hours
        // console.log(shiftDuration);
        const totalHours = Math.min(shiftDuration); // Cap at 12 hours
        const overtime = Math.max(0, shiftDuration - 12);
  
        // Find the staff's hourly rate
        const staff = staffsData.find(staff => staff.staffID === values.staffID);
        const hourlyRate = staff ? staff.hourlyRate : 0; // Default to 15 if not found
  
        const totalWage = (totalHours) * hourlyRate;
  
        shiftData = {
          shiftID: values.shiftID,
          staffID: values.staffID,
          startDate: values.startDate,
          Absence: values.Absence,
          Absence_Status: values.Absence_Status,
          End_Date: values.End_Date,
          House: values.House,
          Shift: values.Shift,
          Shift_Start: values.Shift_Start,
          Shift_End: values.Shift_End,
          Overtime: overtime.toFixed(2),
          Total_Hours: totalHours.toFixed(2),
          Total_Wage: totalWage.toFixed(2),
          Absence_Duration: values.Absence_Duration
        };
   
      onSubmit(shiftData);
      setIsAddLoadingCus(true)
  
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '10px' }}>
        {/* <TextField
          fullWidth
          id="shiftID"
          name="shiftID"
          label="Shift ID"
          value={formik.values.shiftID}
          onChange={formik.handleChange}
          InputProps={{
            readOnly: true,
          }}
        /> */}
        <TextField
          fullWidth
          id="staffID"
          name="staffID"
          label="Staff Name"
          select
          value={formik.values.staffID}
          onChange={formik.handleChange}
          error={formik.touched.staffID && Boolean(formik.errors.staffID)}
          helperText={formik.touched.staffID && formik.errors.staffID}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary[100],
              },
            },
          }}
        >
          {staffsData.map((staff) => (
            <MenuItem key={staff.staffID} value={staff.staffID}>
              {staff.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          id="startDate"
          name="startDate"
          label='Start Date'
          type="date"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
          helperText={formik.touched.startDate && formik.errors.startDate}
          InputLabelProps={{ shrink: true }}
        />
            <TextField
              fullWidth
              id="End_Date"
              name="End_Date"
              label="End Date"
              type="date"
              value={formik.values.End_Date}
              onChange={formik.handleChange}
              error={formik.touched.End_Date && Boolean(formik.errors.End_Date)}
              helperText={formik.touched.End_Date && formik.errors.End_Date}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              id="House"
              name="House"
              label="House"
              value={formik.values.House}
              onChange={formik.handleChange}
              error={formik.touched.House && Boolean(formik.errors.House)}
              helperText={formik.touched.House && formik.errors.House}
            >
              <MenuItem value="Jericho House">Jericho House</MenuItem>
              <MenuItem value="Howards House">Howards House</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="Shift"
              name="Shift"
              label="Shift"
              select
              value={formik.values.Shift}
              onChange={formik.handleChange}
              error={formik.touched.Shift && Boolean(formik.errors.Shift)}
              helperText={formik.touched.Shift && formik.errors.Shift}
            >
              <MenuItem value="Day">Day</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </TextField>
            <TextField
              fullWidth
              id="Shift_Start"
              name="Shift_Start"
              label="Shift Start"
              type="time"
              value={formik.values.Shift_Start}
              onChange={formik.handleChange}
              error={formik.touched.Shift_Start && Boolean(formik.errors.Shift_Start)}
              helperText={formik.touched.Shift_Start && formik.errors.Shift_Start}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              id="Shift_End"
              name="Shift_End"
              label="Shift End"
              type="time"
              value={formik.values.Shift_End}
              onChange={formik.handleChange}
              error={formik.touched.Shift_End && Boolean(formik.errors.Shift_End)}
              helperText={formik.touched.Shift_End && formik.errors.Shift_End}
              InputLabelProps={{ shrink: true }}
            />
        
        

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
            {isShiftAdding || isAddLoadingCus || isDatatLoadingCus || isShiftsLoading ? (
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



// ShiftDialog component
const ShiftDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus, isShiftAdding,
  isDatatLoadingCus,
  isAddLoadingCus,
  isShiftsLoading }) => {
  const isEditing = Boolean(shift);
  const title = isEditing ? 'Edit Shift' : 'Record New Shift';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ShiftForm
          initialValues={shift}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
          onCancel={onClose}
          staffsData={staffsData}
          shiftsData={shiftsData}
          shiftsIds={shiftsIds}
          navigate={navigate}
          setIsAddLoadingCus={setIsAddLoadingCus}
          isShiftAdding={isShiftAdding}
          isDatatLoadingCus={isDatatLoadingCus}
          isAddLoadingCus={isAddLoadingCus}
          isShiftsLoading={isShiftsLoading} 
          isEditing={isEditing}
        />
        {isEditing? 
      
        <DeleteIcon color="error" sx={{
          mt: '-70px'
        }}
        onClick={() => handleDelete(shift)}
        /> : 
        ''}
      </DialogContent>
    </Dialog>
  );
};

// DeleteConfirmationDialog component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme, isDeleteLoading,
  isDatatLoadingCus,
  isShiftsLoading   }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the selected shift(s)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  sx={{
          marginTop: '10px',
          color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }}>
          Cancel
        </Button>
        <Button onClick={onConfirm}  sx={{
          marginTop: '10px',
          color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }} autoFocus>
          {isDatatLoadingCus || isShiftsLoading? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Delete"
                        )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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


