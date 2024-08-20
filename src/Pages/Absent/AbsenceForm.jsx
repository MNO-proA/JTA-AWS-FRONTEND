/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import { Box, TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect } from 'react';
import dayjs from "dayjs";


const shiftValidationSchema = Yup.object().shape({
    staffID: Yup.string().required('Staff ID is required'),
    startDate: Yup.date().required('Start date is required'),
    // End_Date: Yup.date().required('End date is required'),
    // Absence_Duration: Yup.number().required('Duration is required'),
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

export const AbsentForm = ({ initialValues, onSubmit, onCancel, staffsData, shiftsData, shiftsIds, navigate,     setIsAddLoadingCus, shift, isEditing, 
  isShiftAdding,
  isDatatLoadingCus,
  isAddLoadingCus,
  isShiftsLoading,
}) => {
  const theme = useTheme();
  const initialShiftID = generateShiftID(shiftsIds);

  

  const formik = useFormik({
    
    initialValues: initialValues || {
      shiftID: initialShiftID,
      staffID: '',
      startDate: '',
      Absence: 'Yes',
      Absence_Status: 'Absence Without Leave',
      End_Date: '',
      House: '',
      Shift: '',
      Shift_Start: '',
      Shift_End: '',
      Absence_Duration: 0,
      ReturnedToWork: false, 
    },
    validationSchema: shiftValidationSchema,
    onSubmit: (values) => {
      let shiftData;
        shiftData = {
          shiftID: values.shiftID,
          staffID: values.staffID,
          startDate: values.startDate,
          Absence: values.Absence,
          Absence_Status: values.Absence_Status,
          Absence_Duration: values.Absence_Duration,
          End_Date: values.End_Date,
          House: values.House,
          Shift: values.Shift,
          ReturnedToWork: values.ReturnedToWork,
          Shift_Start: '',
          Shift_End: '',
          Overtime: 0,
          Total_Hours: 0,
          Total_Wage: 0,
        };
   
      onSubmit(shiftData);
      setIsAddLoadingCus(true)
  
    }
  });

  useEffect(() => {
    const { startDate, End_Date, Absence_Duration } = formik.values;
  
    if (startDate && End_Date && !Absence_Duration) {
      // Calculate duration
      const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1;
      formik.setFieldValue('Absence_Duration', duration, false);
    } else if (startDate && Absence_Duration && !End_Date) {
      // Calculate End_Date
      const endDate = dayjs(startDate).add(parseInt(Absence_Duration) - 1, 'day').format('YYYY-MM-DD');
      formik.setFieldValue('End_Date', endDate, false);
    } else if (startDate && End_Date && Absence_Duration) {
      // Recalculate duration if all values are present
      const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1;
      if (duration !== Absence_Duration) {
        formik.setFieldValue('Absence_Duration', duration, false);
      }
      // const endDate = dayjs(startDate).add(parseInt(Absence_Duration) - 1, 'day').format('YYYY-MM-DD');
      // formik.setFieldValue('End_Date', endDate, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.startDate, formik.values.End_Date, formik.values.Absence_Duration]);
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
        {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
          
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
    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
    <TextField
      fullWidth
      id="Absence_Duration"
      name="Absence_Duration"
      label="Absence Duration (days)"
      type="number"
      value={formik.values.Absence_Duration}
      onChange={formik.handleChange}
      error={formik.touched.Absence_Duration && Boolean(formik.errors.Absence_Duration)}
      helperText={formik.touched.Absence_Duration && formik.errors.Absence_Duration}
    />
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
      
          <MenuItem value="Sick">Sick</MenuItem>
          <MenuItem value="Vacation">Vacation</MenuItem>
          <MenuItem value="Personal">Personal</MenuItem>
          <MenuItem value="Absence Without Leave">Absence Without Leave</MenuItem>
          <MenuItem value="Holiday">Holiday</MenuItem>
        </TextField>

        <FormControlLabel
            control={
              <Checkbox
                id="ReturnedToWork"
                name="ReturnedToWork"
                checked={formik.values.ReturnedToWork}
                onChange={formik.handleChange}
                sx={{
                  color: theme.palette.secondary[200],
                  '&.Mui-checked': {
                    color: theme.palette.secondary[200],
                  },
                  '& .MuiSvgIcon-root': {
                    borderColor: theme.palette.secondary[200],
                  },
                }}
              />
            }
            label="Returned To Work"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
        />
        

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} sx={{ color: theme.palette.grey[500] }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"  
            sx={{
              color: theme.palette.primary[100],
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