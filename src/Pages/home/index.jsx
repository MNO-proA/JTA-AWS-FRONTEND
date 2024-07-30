import { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../Components/Header";
import { selectAllStaff, useGetStaffQuery, useAddStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation, selectStaffIds } from "../../features/staffs/staffSlice";
import { useSelector } from "react-redux";
import { selectCurrentRole, selectCurrentToken } from "../../features/auth/authSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SingleStaff from "./SingleStaff";  // Assuming you have this component
/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';



const generateStaffID = (staffsData) => {
  // Default ID if no staff exists or all IDs are invalid
  const defaultID = 'JTA001';

  // Filter out elements that match the pattern JTA followed by digits
  const validStaffIDs = staffsData.filter(id => /^JTA\d+$/.test(id));

  // If no valid IDs found, return default
  if (validStaffIDs.length === 0) return defaultID;

  // Extract numeric parts and find the largest number
  const numericParts = validStaffIDs.map(id => parseInt(id.slice(3), 10));
  const largestNumericPart = Math.max(...numericParts);
 
  // Increment the largest number
  const newNumericPart = largestNumericPart + 1;
 

  // Construct new staff ID
  return `JTA${newNumericPart.toString().padStart(3, '0')}`;
};





// Validation schema for the staff form
const isAllCaps = (value) => {
  if (!value) {
    // Skip validation if value is empty or undefined
    return true;
  }

  return value === value.toUpperCase();
};
const capitalizeFirstLetter = (value) => {
  if (!value) {
    // Skip validation if value is empty or undefined
    return true;
  }

  const words = value.split(' ');
  return words.every((word) => /^[A-Z]/.test(word));
};



const staffValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .test('capitalized', 'Please capitalize the first letter of each word', capitalizeFirstLetter),
  employmentType: Yup.string()
    .required('Employment type is required')
    .test('capitalized', 'Please capitalize the first letter of each word', capitalizeFirstLetter),
  jobTitle: Yup.string()
    .required('Job title is required')
    .test('allCaps', 'Job title must be all uppercase', isAllCaps),
  hourlyRate: Yup.number()
    .positive('Hourly rate must be positive')
    .required('Hourly rate is required'),
});


// StaffForm component
const StaffForm = ({ initialValues, onSubmit, onCancel, staffData, isStaffLoading, staffsIds,  isAddLoadingCus, 
  isDatatLoadingCus, isEditing, isStaffAddLoading }) => {
  const theme = useTheme();
  const initialStaffID = generateStaffID(staffsIds);
  const formik = useFormik({
    initialValues: initialValues || {
      staffID: initialStaffID,
      fullName: '',
      employmentType: '',
      jobTitle: '',
      hourlyRate: '',
    },
    validationSchema: staffValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '10px' }}>
      {/* <TextField
          fullWidth
          id="staffID"
          name="staffID"
          label="Staff ID"
          value={formik.values.staffID}
          InputProps={{
            readOnly: true,
          }}
        /> */}
        <TextField
          fullWidth
          id="fullName"
          name="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />
        <TextField
          fullWidth
          id="employmentType"
          name="employmentType"
          label="Employment Type"
          value={formik.values.employmentType}
          onChange={formik.handleChange}
          error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
          helperText={formik.touched.employmentType && formik.errors.employmentType}
        />
       
       
        <TextField
          fullWidth
          id="jobTitle"
          name="jobTitle"
          label="Job Title"
          value={formik.values.jobTitle}
          onChange={formik.handleChange}
          error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
          helperText={formik.touched.jobTitle && formik.errors.jobTitle}
        />
        <TextField
          fullWidth
          id="hourlyRate"
          name="hourlyRate"
          label="Hourly Rate"
          type="number"
          value={formik.values.hourlyRate}
          onChange={formik.handleChange}
          error={formik.touched.hourlyRate && Boolean(formik.errors.hourlyRate)}
          helperText={formik.touched.hourlyRate && formik.errors.hourlyRate}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} sx={{ color: theme.palette.grey[500] }}>
            Cancel
          </Button>
          <button type="submit" className="btn btn-block btn-color btn-lg font-weight-medium auth-form-btn">
                        {isStaffLoading || isAddLoadingCus || isDatatLoadingCus || isStaffAddLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          isEditing?
                          "Update":"Submit"
                        )}
                      </button>
                      {/* <Button type="submit" variant="contained" sx={{
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }}>
            Submit
          </Button> */}
        </Box>
      </Box>
    </form>
  );
};

// StaffDialog component
const StaffDialog = ({ open, onClose, staff, onSubmit, handleDelete, staffData,  onEdit, staffsIds, isDatatLoadingCus,  isAddLoadingCus, isDeleteLoading, role, isStaffAddLoading }) => {
  const isEditing = Boolean(staff);
  const title = isEditing ? 'Edit Staff' : 'Create New Staff';
  // const sortStaffDataByIDDesc = (staffData) => {
  //   return staffData.sort((a, b) => {
  //     const numA = parseInt(a.staffID.match(/\d+/)[0], 10);
  //     const numB = parseInt(b.staffID.match(/\d+/)[0], 10);
  //     return numB - numA; // For descending order
  //   });
  // };
  const theme = useTheme();
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <StaffForm
          initialValues={staff}
          onSubmit={(values) => {
            onSubmit(values);
            // onClose();
          }}
          onCancel={onClose}
          // staffData = {sortStaffDataByIDDesc(staffData)}
          staffsIds={staffsIds}
          isAddLoadingCus={ isAddLoadingCus}
          isDatatLoadingCus={isDatatLoadingCus}
          isDeleteLoading={isDeleteLoading}
          isStaffAddLoading={isStaffAddLoading}
          role={role}
          onEdit={onEdit}
          isEditing={isEditing}
        />
        {isEditing && 
          <DeleteIcon color="error" sx={{
            mt: '-70px',
            cursor: 'pointer'
          }}
          onClick={() => handleDelete(staff)}
          />
        }
      </DialogContent>
    </Dialog>
  );
};

// DeleteConfirmationDialog component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, theme, isDeleteLoading }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this staff member?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{
          color: 'grey',
          '&:hover': {
            backgroundColor: theme.palette.secondary[200],
            color: theme.palette.primary[900],
          },
        }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={{
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


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const Overview = () => {
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const { isLoading: isStaffLoading, refetch } = useGetStaffQuery();
  const staffData = useSelector(selectAllStaff);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const staffsIds = useSelector(selectStaffIds)
  const [addStaff, {isLoading: isStaffAddLoading}] = useAddStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff, {isLoading: isDeleteLoading}] = useDeleteStaffMutation();
  const role = useSelector(selectCurrentRole)
  const token = useSelector(selectCurrentToken);


  const [isAddLoadingCus, setIsAddLoadingCus]=useState(false)
  const [isDatatLoadingCus, setIsDataLoadingCus]=useState(false)

  useEffect(()=>{
    console.log(staffData)
  },[staffData])
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDataLoadingCus(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [staffData]);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsAddLoadingCus(false);
      }, 2000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [staffData]);
  



  const handleOpenDialog = () => {
    setEditingStaff(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStaff(null);
  };

  const handleSubmit = async (values) => {
    const { staffID, fullName, employmentType, jobTitle, hourlyRate } = values;
  
    try {
      if (editingStaff) {
        const updates = {};
        if (jobTitle !== editingStaff.jobTitle) {
          updates.jobTitle = jobTitle;
        }
        if (parseFloat(hourlyRate) !== parseFloat(editingStaff.hourlyRate)) {
          updates.hourlyRate = parseFloat(hourlyRate);
        }
        if (fullName !== editingStaff.fullName) {
          updates.fullName = fullName;
        }
        if (employmentType !== editingStaff.employmentType) {
          updates.employmentType = employmentType;
        }
  
        if (Object.keys(updates).length > 0) {
          setIsAddLoadingCus(true);
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({ updates }),
            redirect: "follow"
          };

          const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/${staffID}`, requestOptions);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          await response.json();
          toast.success('Staff updated successfully');
          setIsAddLoadingCus(true)
          setIsDataLoadingCus(true)
          refetch(); 
         
        } else {
          toast.info('No changes to update');
        }
      } else {
        await addStaff(values).unwrap();
        setOpenDialog(false);
        toast.success('Staff added successfully');
        setIsAddLoadingCus(true)
     
      }
      handleCloseDialog();
      console.log(values);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setOpenDialog(true);
  };

  const handleDelete = (staff) => {
    setSelectedStaff(staff);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStaff(selectedStaff.staffID).unwrap();
      toast.success('Staff deleted successfully');
      setSelectedStaff(null);
      setIsDataLoadingCus(true)
    } catch (error) {
      toast.error('An error occurred while deleting staff. Please try again.');
    }
    setOpenDeleteDialog(false);
    setOpenDialog(false);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="JTA Staff" color='#10453e' />
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
         <strong> Create New Staff </strong>
      </Button> : <LockIcon sx={{color: theme.palette.secondary[300]}}/>
}
      {staffData && !isStaffLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
        {[...staffData].reverse().map((staff, index) => (
          <SingleStaff
            key={staff.staffID}
            index={staffData.length - index} // convert zero-based index to one-based index
            {...staff}
            onEdit={() => handleEdit(staff)}
            onDelete={() => handleDelete(staff)}
            isStaffLoading={isStaffLoading}
            isStaffAddLoading={isStaffAddLoading}
            role={role}
          />
        ))}
        </Box>
      ) : (
        <>Loading...
        
        </>
      )}
      <br />
      <br />
      <br />
      <StaffDialog
        open={openDialog}
        onClose={handleCloseDialog}
        staff={editingStaff}
        onSubmit={handleSubmit}
        handleDelete={() => handleDelete(editingStaff)}
        staffData={staffData}
        staffsIds={staffsIds}
        isAddLoadingCus={isAddLoadingCus}
        isDatatLoadingCus={isDatatLoadingCus}
        isDeleteLoading={isDeleteLoading}
        isStaffAddLoading={isStaffAddLoading}
        role={role}
        onEdit={() => handleEdit(editingStaff)}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        theme={theme}
        isDeleteLoading={isDeleteLoading}
      />
      <ToastContainer />
    </Box>
  );
};

export default Overview;