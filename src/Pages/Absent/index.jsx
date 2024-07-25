/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import  { useState, useEffect} from 'react';
import { Box,  } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useGetShiftsQuery, selectAllShifts , useDeleteShiftMutation } from "../../features/shifts/shiftSlice";
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { selectCurrentToken } from "../../features/auth/authSlice"

const AbsentReadOnly = () => {
    const theme = useTheme();
    const {isLoading: isShiftsLoading, refetch} = useGetShiftsQuery()
    const { isLoading: isStaffLoading } = useGetStaffQuery();
    // const [openDialog, setOpenDialog] = useState(false);
    // const [editingShift, setEditingShift] = useState(null);
    const [selectedShift, setSelectedShift] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDataLoadingCus, setIsDataLoadingCus] = useState(false)
    // const [isAddedDataLoadingCus, setIsAddedDataLoadingCus] = useState(false)
    const token = useSelector(selectCurrentToken)
    const [{isLoading: isDeleteLoading}] = useDeleteShiftMutation();
  
  
    const staffsData = useSelector(selectAllStaff);
    const shiftsData = useSelector(selectAllShifts)
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDataLoadingCus(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [shiftsData]);

    // useEffect(()=>{
    //   console.log(staffsData)
    // },[staffsData])


    function mapShiftAndStaffData(shiftData, staffData) {
      const shiftRefined = shiftData.filter((shift)=> shift.Absence !== "No" )
        return shiftRefined.map(shift => {
            const staff = staffData.find(staff => staff.staffID === shift.staffID);
            if (staff) {
                return {
                    shiftID: shift.shiftID,
                    date: shift.startDate,
                    fullName: staff.fullName,
                    absence: shift.Absence,
                    absenceStatus: shift.Absence_Status
                };
            } else {
                // Handle case where staffID is not found in staffData
                return {
                    shiftID: shift.shiftID,
                    fullName: "Unknown",
                    date: shift.startDate,
                    absence: shift.Absence,
                    absenceStatus: shift.Absence_Status
                };
            }
        });
    }
    const AbsenceData = mapShiftAndStaffData(shiftsData, staffsData)
  
  
    const handleDelete = (shift ) => {
      setOpenDeleteDialog(true);
      setSelectedShift(shift)
    };

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

    const handleConfirmDelete = async () => {
  
     
      try { 
        console.log(selectedShift)
        const {shiftID, date} = selectedShift
        console.log({shiftID, date})
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        
        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };
        
        fetch(`https://jta-node-api.onrender.com/shifts/${shiftID}/${date}`, requestOptions)
          .then((response) => {
             if (!response.ok) {
              // Handle HTTP errors
              throw new Error(`Error ${response.status}`);
            } else{
              response.json()
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
    }
  }
  
  
    const columns = [
        { field: 'date', headerName: 'Date', flex: 0.3},
      { field: 'fullName', headerName: 'Staff Name', flex: 0.5},
      { field: 'absence', headerName: 'Absence', flex: 0.3},
      { field: 'absenceStatus', headerName: 'Absence Status', flex: 0.3 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 60,
        renderCell: (params) => (
          isShiftsLoading || isDataLoadingCus? <span
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
        <Header title="Absence"  color= '#10453e' />
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
            rows={AbsenceData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.shiftID}
          />
        </Box>
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






