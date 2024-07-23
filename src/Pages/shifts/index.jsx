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
import { useGetShiftsQuery, selectAllShifts } from "../../features/shifts/shiftSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";



// Validation schema for the shift form
const shiftValidationSchema = Yup.object().shape({
  staffID: Yup.string().required('Staff ID is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  house: Yup.string().required('House is required'),
  shift: Yup.string().required('Shift is required'),
  shiftStart: Yup.string().required('Shift start time is required'),
  shiftEnd: Yup.string().required('Shift end time is required'),
  absence: Yup.string().required('Absence status is required'),
  absenceStatus: Yup.string().when('absence', {
    is: 'Yes',
    then: Yup.string().required('Absence status is required when absent'),
    otherwise: Yup.string().nullable(),
  }),
});

// ShiftForm component
const ShiftForm = ({ initialValues, onSubmit, onCancel, staffsData }) => {
  const theme = useTheme();
  const [hourlyRate] = useState(15); // Assuming a fixed hourly rate of $15

  const formik = useFormik({
    initialValues: initialValues || {
      staffID: '',
      startDate: '',
      endDate: '',
      house: '',
      shift: '',
      shiftStart: '',
      shiftEnd: '',
      absence: 'No',
      absenceStatus: '',
    },
    validationSchema: shiftValidationSchema,
    onSubmit: (values) => {
      const shiftStartTime = new Date(`2000-01-01T${values.shiftStart}`);
      const shiftEndTime = new Date(`2000-01-01T${values.shiftEnd}`);
      const shiftDuration = (shiftEndTime - shiftStartTime) / (1000 * 60 * 60); // in hours

      const overtime = Math.max(0, shiftDuration - 12);
      const totalHours = 12 + overtime;
      const totalWage = totalHours * hourlyRate;

      const shiftData = {
        ...values,
        overtime,
        totalHours,
        totalWage,
      };

      onSubmit(shiftData);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          id="endDate"
          name="endDate"
          label="End Date"
          type="date"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          error={formik.touched.endDate && Boolean(formik.errors.endDate)}
          helperText={formik.touched.endDate && formik.errors.endDate}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          id="house"
          name="house"
          label="House"
          value={formik.values.house}
          onChange={formik.handleChange}
          error={formik.touched.house && Boolean(formik.errors.house)}
          helperText={formik.touched.house && formik.errors.house}
        />
        <TextField
          fullWidth
          id="shift"
          name="shift"
          label="Shift"
          value={formik.values.shift}
          onChange={formik.handleChange}
          error={formik.touched.shift && Boolean(formik.errors.shift)}
          helperText={formik.touched.shift && formik.errors.shift}
        />
        <TextField
          fullWidth
          id="shiftStart"
          name="shiftStart"
          label="Shift Start"
          type="time"
          value={formik.values.shiftStart}
          onChange={formik.handleChange}
          error={formik.touched.shiftStart && Boolean(formik.errors.shiftStart)}
          helperText={formik.touched.shiftStart && formik.errors.shiftStart}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          id="shiftEnd"
          name="shiftEnd"
          label="Shift End"
          type="time"
          value={formik.values.shiftEnd}
          onChange={formik.handleChange}
          error={formik.touched.shiftEnd && Boolean(formik.errors.shiftEnd)}
          helperText={formik.touched.shiftEnd && formik.errors.shiftEnd}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          id="absence"
          name="absence"
          label="Absence"
          select
          value={formik.values.absence}
          onChange={formik.handleChange}
          error={formik.touched.absence && Boolean(formik.errors.absence)}
          helperText={formik.touched.absence && formik.errors.absence}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
        {formik.values.absence === 'Yes' && (
          <TextField
            fullWidth
            id="absenceStatus"
            name="absenceStatus"
            label="Absence Status"
            value={formik.values.absenceStatus}
            onChange={formik.handleChange}
            error={formik.touched.absenceStatus && Boolean(formik.errors.absenceStatus)}
            helperText={formik.touched.absenceStatus && formik.errors.absenceStatus}
          />
        )}
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
const ShiftDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData }) => {
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
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme }) => {
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
          Delete
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
  const {isLoading: isShiftsLoading} = useGetShiftsQuery()
  const { isLoading: isStaffLoading } = useGetStaffQuery();


  const staffsData = useSelector(selectAllStaff);



  const shiftsData = useSelector(selectAllShifts)
  useEffect(()=>{
    console.log(shiftsData)
  },[shiftsData])



//   const [addShift] = useAddShiftMutation();
//   const [updateShift] = useUpdateShiftMutation();
//   const [deleteShift] = useDeleteShiftMutation();

  
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
        await updateShift(values).unwrap();
        toast.success('Shift updated successfully');
      } else {
        await addShift(values).unwrap();
        toast.success('Shift added successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async (selectedShift) => {
    try {
      await  deleteShift(selectedShift).unwrap();
      toast.success('Selected shifts deleted successfully');
      setSelectedShift('');
    } catch (error) {
      toast.error('An error occurred while deleting shifts. Please try again.');
    }
    setOpenDeleteDialog(false);
  };

  const columns = [
    { field: 'shiftID', headerName: 'Shift ID', flex: 1 },
    { field: 'staffID', headerName: 'Staff ID', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'Absence', headerName: 'Absence', flex: 1 },
    { field: 'End_Date', headerName: 'End Date', flex: 1 },
    { field: 'Absence_Status', headerName: 'Absence Status', flex: 1 },
    // { field: 'House', headerName: 'House', flex: 1 },
    { field: 'Overtime', headerName: 'Overtime', flex: 1 },
    // { field: 'Shift', headerName: 'Shift', flex: 1 },
    // { field: 'Shift_End', headerName: 'Shift End', flex: 1 },
    // { field: 'Shift_Start', headerName: 'Shift Start', flex: 1 },
    { field: 'Total_Hours', headerName: 'Total Hours', flex: 1 },
    { field: 'Total_Wage', headerName: 'Total Wage', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      renderCell: (params) => (
      
        <EditIcon onClick={() => handleEdit(params.row)}  sx={{
          color: 'grey'
        }}/>
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
          rows={shiftsData}
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