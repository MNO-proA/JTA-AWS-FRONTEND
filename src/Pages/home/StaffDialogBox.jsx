/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material";
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
        </Box>
      </Box>
    </form>
  );
};

// StaffDialog component
const StaffDialog = ({ open, onClose, staff, onSubmit, handleDelete, staffData,  onEdit, staffsIds, isDatatLoadingCus,  isAddLoadingCus, isDeleteLoading, role, isStaffAddLoading }) => {
  const isEditing = Boolean(staff);
  const title = isEditing ? 'Edit Staff' : 'Create New Staff';
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
                          "Delete"
                        )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { StaffDialog, DeleteConfirmationDialog };