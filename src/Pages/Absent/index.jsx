/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import  { useState, useEffect, useCallback, useMemo} from 'react';
import { Box,  } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem } from '@mui/material';
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
import { differenceInDays } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";




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
    // const [updateShift] = useUpdateShiftMutation();
    // const [ {isLoading: isDeleteLoading}] = useDeleteShiftMutation();
    // const [absenceDuration, setAbsenceDuration] = useState('');
    
    
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


  //  useEffect((startDate, End_Date) => {
  //   if (startDate && End_Date) {
  //     const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1; // +1 to include both start and end days
  //     setAbsenceDuration(duration);
  //   }
  // }, []);

  // const handleDateDuration = (startDate, End_Date)=>{
  //   if (startDate && End_Date) {
  //     const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1; // +1 to include both start and end days
  //     console.log('daterange')
  //     return duration
  //     // setAbsenceDuration(duration);
      
  //   }
  //   console.log('not working')
  // }

  // const absenceDuration = handleDateDuration()
 
  useEffect(()=>{
    console.log(shiftsIds)
    // console.log(absenceDuration)
    // console.log(endDate)
  },[shiftsIds])


  
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
      console.log(shift)
      setEditingShift(shift);
      setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
      try { 
        console.log(selectedShift)
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
  
  
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // const useDateRangePicker = () => {
    //   const [startDate, setStartDate] = useState(null);
    //   const [endDate, setEndDate] = useState(null);
    
    //   const handleDateRangeChange = useCallback((start, end) => {
    //     setStartDate(start);
    //     setEndDate(end);
    //   }, []);
    
    //   const handleShortcutRange = useCallback((range) => {
    //       const today = dayjs();
    //       switch (range) {
    //         case 'This Week':
    //           handleDateRangeChange(today.startOf('week'), today.endOf('week'));
    //           break;
    //         case 'Last Week': {
    //           const lastWeek = today.subtract(1, 'week');
    //           handleDateRangeChange(lastWeek.startOf('week'), lastWeek.endOf('week'));
    //           break;
    //         }
    //         case 'This Month':
    //           handleDateRangeChange(today.startOf('month'), today.endOf('month'));
    //           break;
    //         case 'Last Month': {
    //           const lastMonth = today.subtract(1, 'month');
    //           handleDateRangeChange(lastMonth.startOf('month'), lastMonth.endOf('month'));
    //           break;
    //         }
    //         case 'Reset':
    //           handleDateRangeChange(null, null);
    //           break;
    //         default:
    //           break;
    //       }
    //     }, [handleDateRangeChange]);
        
    
    //   return {
    //     startDate,
    //     endDate,
    //     handleDateRangeChange,
    //     handleShortcutRange
    //   };
    // };
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      const shiftValidationSchema = Yup.object().shape({
        staffID: Yup.string().required('Staff ID is required'),
        startDate: Yup.date().required('Start date is required'),
        End_Date: Yup.date().required('End date is required'),
        Absence_Duration: Yup.number().required('Duration is required'),
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

    const AbsentForm = ({ initialValues, onSubmit, onCancel, staffsData, shiftsData, shiftsIds, navigate,     setIsAddLoadingCus, shift, isEditing, 
      isShiftAdding,
      isDatatLoadingCus,
      isAddLoadingCus,
      isShiftsLoading,
    }) => {
      const theme = useTheme();
      const initialShiftID = generateShiftID(shiftsIds);
     
      // const updateAbsenceDuration = (startDate, End_Date) => {
      //   if (startDate && End_Date) {
      //     const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1; // +1 to include both start and end days
      //     return duration
      //   }
      // };
      // const startDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
      // const endDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()+1).padStart(2, '0')}`;
      

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
          Absence_Duration: 0
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
      
    
      
      

   

      // const duration = calculateAbsenceDuration(formik.values.startDate, formik.values.End_Date);
      // setAbsenceDuration(duration);
      // useEffect(() => {
      //   const duration = calculateAbsenceDuration(formik.values.startDate, formik.values.End_Date);
      //   setAbsenceDuration(duration);
      //   formik.setFieldValue('Absence_Duration', duration, false); // Pass false to avoid validation
      // // eslint-disable-next-line react-hooks/exhaustive-deps
      // }, [calculateAbsenceDuration, formik.values.startDate, formik.values.End_Date]);
    
      // const handleDateDuration = (startDate, End_Date)=>{
      //   if (startDate && End_Date) {
      //     const duration = dayjs(End_Date).diff(dayjs(startDate), 'day') + 1; 
      //     formik.setFieldValue('Absence_Duration', duration, false)
      //     console.log('daterange')
      //   }
      //   else{
      //     console.log('not working')
      //   }
      // }
      // Add this function to calculate the duration
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
          {/* <Button onClick={() => handleDateDuration(formik.values.startDate, formik.values.End_Date)}  sx={{
                  color: theme.palette.primary[400],
                  backgroundColor: theme.palette.primary[600],
                  '&:hover': {
                    backgroundColor: theme.palette.secondary[200],
                    color: theme.palette.primary[900],
                  },
                }}><strong>cal</strong></Button> */}


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
  
          const response = await fetch(`https://jta-node-api.onrender.com/shifts/${shiftID}/${startDate}`, requestOptions);
          
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
          console.log(values)
          handleCloseDialog();
      } 
    }
    catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    };
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ShiftDialog component
const AbsentDialog = ({ open, onClose, shift, onSubmit, handleDelete, staffsData, shiftsData, shiftsIds, navigate, setIsAddLoadingCus,
  isShiftAdding,
  isDatatLoadingCus,
  isAddLoadingCus,
  isShiftsLoading 
 }) => {
  const isEditing = Boolean(shift);
  const title = isEditing ? 'Edit Shift' : 'Record New Absence';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <AbsentForm
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
          isEditing={isEditing}
          isShiftAdding={ isShiftAdding}
          isDatatLoadingCus={isDatatLoadingCus}
          isAddLoadingCus={isAddLoadingCus}
          isShiftsLoading={isShiftsLoading} 
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
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
              {isDataLoadingCus || isShiftsLoading ? (
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
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 
    // function mapShiftAndStaffData(shiftData, staffData) {
    //   const shiftRefined = shiftData.filter((shift)=> shift.Absence === "Yes" )
    //     return shiftRefined.map(shift => {
    //         const staff = staffData.find(staff => staff.staffID === shift.staffID);
    //         if (staff) {
    //             return {
    //                 shiftID: shift.shiftID,
    //                 startDate: shift.startDate,
    //                 End_Date: shift?.End_Date,
    //                 fullName: staff.fullName,
    //                 Absence: shift.Absence,
    //                 Absence_Status: shift.Absence_Status,
    //                 Absence_Duration: shift?.Absence_Duration,
    //                 staffID: staff?.staffID
    //             };
    //         } else {
    //             // Handle case where staffID is not found in staffData
    //             return {
    //               shiftID: shift.shiftID,
    //               startDate: shift.startDate,
    //               End_Date: shift?.End_Date,
    //               fullName: " ",
    //               Absence: shift.Absence,
    //               Absence_Status: shift.Absence_Status,
    //               Absence_Duration: shift?.Absence_Duration,
    //               staffID: staff?.staffID
    //             };
    //         }
    //     });
    // }
    // const AbsenceData = mapShiftAndStaffData(shiftsData, staffsData)
    // const AbsenceDataWithIndex = AbsenceData.map((absence, index) => ({
    //   ...absence,
    //   index: AbsenceData.length - index
    // }));
    // const getRowId = (row) => row.index;


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
  
          const daysRemaining = endDate.isValid() ? endDate.diff(today, 'day') + 1 : null;
  
          return {
            index: shiftRefined.length - index,
            shiftID: shift.shiftID,
            startDate: startDate.isValid() ? startDate.format('YYYY-MM-DD') : 'Invalid Date',
            End_Date: endDate.isValid() ? endDate.format('YYYY-MM-DD') : 'Invalid Date',
            fullName: staff ? staff.fullName : "Unknown Staff",
            Absence: shift.Absence,
            Absence_Status: shift.Absence_Status,
            Absence_Duration: absenceDuration,
            daysRemaining: daysRemaining,
            staffID: staff?.staffID
          };
        });
      };
  
      return mapShiftAndStaffData(shiftsData, staffsData);
    }, [shiftsData, staffsData]);
  
    const columns = [
      { field: 'index', headerName: 'Index', flex: 0.1 },
      { field: 'startDate', headerName: 'Start Date', flex: 0.3},
      { field: 'End_Date', headerName: 'End Dtae', flex: 0.3},
      { field: 'fullName', headerName: 'Staff Name', flex: 0.5},
      { field: 'Absence', headerName: 'Absence', flex: 0.3},
      { field: 'Absence_Status', headerName: 'Absence Status', flex: 0.4 },
      { 
        field: 'Absence_Duration', 
        headerName: 'Absence Duration', 
        flex: 0.6,
        renderCell: (params) => {
          const { Absence_Duration, daysRemaining } = params.row;
          
          if (Absence_Duration === null || daysRemaining === null) {
            return (
              <div style={{ backgroundColor: theme.palette.warning.light, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Invalid Data
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
        <Header title="Absence"  color= '#10453e' />
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
      />
      <ToastContainer />
      </Box>
    );
}

export default AbsentReadOnly






