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
import { useGetShiftsQuery, selectAllShifts, useAddShiftMutation, useDeleteShiftMutation, useUpdateShiftMutation } from "../../features/shifts/shiftSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";
import { selectCurrentToken } from "../../features/auth/authSlice"



// Validation schema for the shift form
const shiftValidationSchema = Yup.object().shape({
  staffID: Yup.string().required('Staff ID is required'),
  startDate: Yup.date().required('Start date is required'),
  End_Date: Yup.date().required('End date is required'),
  House: Yup.string().required('House is required'),
  Shift: Yup.string().required('Shift is required'),
  Shift_Start: Yup.string().required('Shift start time is required'),
  Shift_End: Yup.string().required('Shift end time is required'),
  Absence: Yup.string().required('Absence is required'),
  Absence_Status: Yup.string().required('Absence status is required'),
});

const generateShiftID = (shiftData) => {
  if (shiftData.length === 0) return 'shift001'; // Default ID if no shifts exist

  const lastShiftID = shiftData[0]?.shiftID; // Get the ID of the last shift (first in descending order)
  const numericPart = parseInt(lastShiftID.match(/\d+/)[0], 10); // Extract numeric part
  const newNumericPart = numericPart + 1; // Increment numeric part
  return `S${newNumericPart.toString().padStart(3, '0')}`; // Construct new shift ID
};

// ShiftForm component
const ShiftForm = ({ initialValues, onSubmit, onCancel, staffsData, shiftsData }) => {
  const theme = useTheme();
  const initialshiftID= generateShiftID(shiftsData);
  const formik = useFormik({
    initialValues: initialValues || {
      shiftID: initialshiftID,
      staffID: '',
      startDate: '',
      End_Date: '',
      House: '',
      Shift: '',
      Shift_Start: '',
      Shift_End: '',
      Absence: 'No',
      Absence_Status: 'None',
    },
    validationSchema: shiftValidationSchema,
    onSubmit: (values) => {
      const shiftStartTime = new Date(`${values.startDate}T${values.Shift_Start}`);
      const shiftEndTime = new Date(`${values.End_Date}T${values.Shift_End}`);

      // If shiftEndTime is earlier than shiftStartTime, add one day to shiftEndTime
      if (shiftEndTime <= shiftStartTime) {
        shiftEndTime.setDate(shiftEndTime.getDate() + 1);
      }

      const shiftDuration = (shiftEndTime - shiftStartTime) / (1000 * 60 * 60); // in hours
      console.log(shiftDuration);
      const totalHours = Math.min(shiftDuration); // Cap at 12 hours
      const overtime = Math.max(0, shiftDuration - 12);

      // Find the staff's hourly rate
      const staff = staffsData.find(staff => staff.staffID === values.staffID);
      const hourlyRate = staff ? staff.hourlyRate : 0; // Default to 15 if not found

      const totalWage = (totalHours) * hourlyRate;

      const shiftData = {
        ...values,
        Overtime: overtime.toFixed(2),
        Total_Hours: totalHours.toFixed(2),
        Total_Wage: totalWage.toFixed(2),
      };
      onSubmit(shiftData)
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
          fullWidth
          id="shiftID"
          name="shiftID"
          label="Shift ID"
          value={formik.values.shiftID}
          onChange={formik.handleChange}
          // InputProps={{
          //   readOnly: true,
          // }}
        />
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
                // '& fieldset': {
                //   borderColor: 'your_color_here', // Normal border color
                // },
                // '&:hover fieldset': {
                //   borderColor: 'your_hover_color_here', // Border color on hover
                // },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.secondary[100], // Border color when focused
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
          label="Start Date"
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
          helperText={formik.touched.endDate && formik.errors.endDate}
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
          label="Shift_Start"
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
        <TextField
          fullWidth
          id="Absence"
          name="Absence"
          label="Absence"
          select
          value={formik.values.Absence}
          onChange={formik.handleChange}
          error={formik.touched.Absence && Boolean(formik.errors.Absence)}
          helperText={formik.touched.Absence && formik.errors.Absence}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
          <TextField
            fullWidth
            id="Absence_Status"
            name="Absence_Status"
            label="Absence Status"
            select
            value={formik.values.Absence_Status}
            onChange={formik.handleChange}
            error={formik.touched.Absence_Status &&  Boolean(formik.errors.Absence_Status)}
            helperText={formik.touched.Absence_Status && formik.errors.Absence_Status}
          >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Sick">Sick</MenuItem>
              <MenuItem value="Vacation">Vacation</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Absence Without Leave">Absence Without Leave</MenuItem>
              <MenuItem value="Holiday">Holiday</MenuItem>
        </TextField>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} sx={{ color: theme.palette.grey[500] }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained"  sx={{color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }} >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

// ShiftDialog component
const ShiftDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData, shiftsData }) => {
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
        />
        {isEditing? 
      
        <DeleteIcon sx={{
          mt: '-70px',
          color: 'grey',
        }}
        onClick={handleDelete}
        /> : 
        ''}
         
         
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

// Updated Shifts component
const Shifts = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {isLoading: isShiftsLoading, refetch} = useGetShiftsQuery()
  const { isLoading: isStaffLoading } = useGetStaffQuery();
  const token = useSelector(selectCurrentToken)


  const staffsData = useSelector(selectAllStaff);



  const shiftsData = useSelector(selectAllShifts)
  useEffect(()=>{
    console.log(shiftsData)
  },[shiftsData])



  const [addShift] = useAddShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift, {isLoading: isDeleteLoading}] = useDeleteShiftMutation();

  
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
   
        await addShift(values).unwrap();
        toast.success('Shift added successfully');
        console.log(values)
      handleCloseDialog();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setOpenDialog(true);
  };

  const handleDelete = (shift ) => {
    setOpenDeleteDialog(true);
    setSelectedShift(shift)
  };

  // const deleteShift = async (shiftID, startDate, refetch) => {
  //   const url = `https://jta-node-api.onrender.com/shifts/${shiftID}/${startDate}`;
  //   const requestOptions = {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  
  //   try {
  //     const response = await fetch(url, requestOptions);
  //     if (!response.ok) {
  //       // Handle HTTP errors
  //       const errorText = await response.text();
  //       throw new Error(`Error ${response.status}: ${errorText}`);
  //     }
  //     // Assuming the response is a text
  //     const result = await response.text();
  //     console.log('Delete successful:', result);
  //     refetch(); // Trigger refetch
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //   }
  // };

  const handleConfirmDelete = async () => {
  
     
      try { 
        const {shiftID, startDate} = selectedShift
        console.log({shiftID, startDate})
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        
        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };
        
        fetch(`https://jta-node-api.onrender.com/shifts/${shiftID}/${startDate}`, requestOptions)
          .then((response) => {
             if (!response.ok) {
              // Handle HTTP errors
              throw new Error(`Error ${response.status}`);
            } else{response.json()}
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
    }
  }





  function mapShiftAndStaffData(shiftData, staffData) {
    return shiftData.map(shift => {
        const staff = staffData.find(staff => staff.staffID === shift.staffID);
        if (staff) {
            return {
              shiftID: shift?.shiftID,
              fullName: staff?.fullName,
              startDate: shift?.startDate,
              End_Date: shift?.End_Date,
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
            };
        }
    });
}

const revisedShiftsData = mapShiftAndStaffData(shiftsData, staffsData)

  const columns = [
    { field: 'shiftID', headerName: 'Shift ID', flex: 0.5 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.5 },
    { field: 'End_Date', headerName: 'End Date', flex: 0.5 },
    { field: 'fullName', headerName: 'Full Name', flex: 0.7 },
    { field: 'Overtime', headerName: 'Overtime', flex: 0.3 },
    { field: 'Total_Hours', headerName: 'Total Hours', flex: 0.3 },
    { field: 'Total_Wage', headerName: 'Total Wage', flex: 0.3 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params) => (
        isShiftsLoading? <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>: 
        <DeleteIcon color="error"  onClick={() => handleDelete(params.row)} />
      ),
    },
  ];

  return (
    <Box m="20px" >
      <Header title="SHIFTS"  color= '#10453e' />
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
        Record Shifts
      </Button>
    
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
          rows={revisedShiftsData }
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.shiftID}
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
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
        isDeleteLoading = {isDeleteLoading }
      token = {token }
      />
      <ToastContainer />
    </Box>
  );
};

export default Shifts;


 //   { field: "shiftStart", headerName: "shiftStart",
  //     flex: 1 },
  //   { field: "shiftEnd", headerName: "shiftEnd",
  //     flex: 1 },

  //   {
  //     field: "name",
  //     headerName: "Name",
  //     flex: 1,
  //     cellClassName: "name-column--cell",
  //   },
  //   {
  //     field: "age",
  //     headerName: "Age",
  //     type: "number",
  //     headerAlign: "left",
  //     align: "left",
  //   },
  //  