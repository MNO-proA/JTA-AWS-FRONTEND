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


// Validation schema for the staff form
const staffValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  employmentType: Yup.string().required('Employment type is required'),
  jobTitle: Yup.string().required('Job title is required'),
  hourlyRate: Yup.number().positive('Hourly rate must be positive').required('Hourly rate is required'),
});

// StaffForm component
const StaffForm = ({ initialValues, onSubmit, onCancel }) => {
  const theme = useTheme();

  const formik = useFormik({
    initialValues: initialValues || {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          select
          value={formik.values.employmentType}
          onChange={formik.handleChange}
          error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
          helperText={formik.touched.employmentType && formik.errors.employmentType}
        >
          <MenuItem value="Full-time">Full-time</MenuItem>
          <MenuItem value="Part-time">Part-time</MenuItem>
          <MenuItem value="Bank">Bank</MenuItem>
        </TextField>
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
          <Button type="submit" variant="contained" sx={{
            color: 'grey',
            '&:hover': {
              backgroundColor: theme.palette.secondary[200],
              color: theme.palette.primary[900],
            },
          }}>
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

// StaffDialog component
const StaffDialog = ({ open, onClose, staff, onSubmit, handleDelete }) => {
  const isEditing = Boolean(staff);
  const title = isEditing ? 'Edit Staff' : 'Create New Staff';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <StaffForm
          initialValues={staff}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
          onCancel={onClose}
        />
        {isEditing && 
          <DeleteIcon sx={{
            mt: '-70px',
            color: 'grey',
          }}
          onClick={handleDelete}
          />
        }
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { StaffDialog, DeleteConfirmationDialog };