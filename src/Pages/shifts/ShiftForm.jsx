/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import { Box, TextField, MenuItem, Button } from '@mui/material';

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
  


// eslint-disable-next-line no-unused-vars
export const ShiftForm = ({ initialValues, onSubmit, onCancel, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus, shift,
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
  