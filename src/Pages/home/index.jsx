/* eslint-disable no-unused-vars */
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
import SingleStaff from "./SingleStaff";  
import LockIcon from '@mui/icons-material/Lock';
import { StaffDialog, DeleteConfirmationDialog } from "./StaffDialogBox";

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

  // useEffect(()=>{
  //   console.log(staffData)
  // },[staffData])
  
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
      // console.log(values);
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