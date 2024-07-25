/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import  { useState, useEffect } from 'react';
import { Box,  } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';
import { useGetShiftsQuery, selectAllShifts } from "../../features/shifts/shiftSlice";

import { useSelector } from "react-redux";
import { selectAllStaff, useGetStaffQuery } from "../../features/staffs/staffSlice";

const AbsentReadOnly = () => {
    const theme = useTheme();
    const {isLoading: isShiftsLoading} = useGetShiftsQuery()
    const { isLoading: isStaffLoading } = useGetStaffQuery();
  
  
    const staffsData = useSelector(selectAllStaff);
    const shiftsData = useSelector(selectAllShifts)
  
    // useEffect(()=>{
    //   console.log(shiftsData)
    // },[shiftsData])
    // useEffect(()=>{
    //   console.log(staffsData)
    // },[staffsData])


    function mapShiftAndStaffData(shiftData, staffData) {
        return shiftData.map(shift => {
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
  
  
  
  
    const columns = [
        { field: 'date', headerName: 'Date', flex: 0.3},
      { field: 'fullName', headerName: 'Staff Name', flex: 0.5},
      { field: 'absence', headerName: 'Absence', flex: 0.3},
      { field: 'absenceStatus', headerName: 'Absence Status', flex: 0.3 },
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
      </Box>
    );
}

export default AbsentReadOnly






