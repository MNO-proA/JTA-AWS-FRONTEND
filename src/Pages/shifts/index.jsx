import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import {
  
    Button
  } from "@mui/material";



const Shifts = () => {

  const  shiftData = [
        {
            "id": 1,
          "staffID": "Staff-1",
          "startDate": "2024-06-27",
          "endDate": "2024-06-27",
          "house": "House B",
          "shift": "Shift 1",
          "shiftStart": "08:23",
          "shiftEnd": "13:17",
          "overtime": 3.45,
          "totalHours": 6.78,
          "totalWage": 89.01,
          "absence": "No",
          "absenceStatus": "Null"
        },
        {
            "id": 2,
          "staffID": "Staff-2",
          "startDate": "2024-06-27",
          "endDate": "2024-06-27",
          "house": "House A",
          "shift": "Shift 2",
          "shiftStart": "12:45",
          "shiftEnd": "18:15",
          "overtime": 1.23,
          "totalHours": 9.87,
          "totalWage": 120.98,
          "absence": "No",
          "absenceStatus": "Null"
        },
        {
            "id": 3,
          "staffID": "Staff-3",
          "startDate": "2024-06-27",
          "endDate": "2024-06-27",
          "house": "House C",
          "shift": "Shift 3",
          "shiftStart": "10:30",
          "shiftEnd": "14:45",
          "overtime": 0.98,
          "totalHours": 8.76,
          "totalWage": 105.43,
          "absence": "No",
          "absenceStatus": "Null"
        },
        {
            "id": 4,
          "staffID": "Staff-4",
          "startDate": "",
          "endDate": "",
          "house": "",
          "shift": "",
          "shiftStart": "",
          "shiftEnd": "",
          "overtime": 0,
          "totalHours": 0,
          "totalWage": 0,
          "absence": "Yes",
          "absenceStatus": "Sick Leave"
        },
            {
                "id": 5,
              "staffID": "Staff-1",
              "startDate": "2024-06-28",
              "endDate": "2024-06-28",
              "house": "House B",
              "shift": "Shift 1",
              "shiftStart": "08:23",
              "shiftEnd": "13:17",
              "overtime": 3.45,
              "totalHours": 6.78,
              "totalWage": 89.01,
              "absence": "No",
              "absenceStatus": "Null"
            }
        
    ]
 
    const theme = useTheme();
  
  
    const columns = [
      { field: "staffID", headerName: "ID", flex: 0.5 },

      { field: "startDate", headerName: "startDate",
        flex: 1 },
      { field: "endDate", headerName: "endDate",
        flex: 1 },
    //   { field: "shiftStart", headerName: "shiftStart",
    //     flex: 1 },
    //   { field: "shiftEnd", headerName: "shiftEnd",
    //     flex: 1 },
      { field: "overtime", headerName: "overtime" ,
        flex: 0.5},
      { field: "totalHours", headerName: "totalHours",
        flex: 0.5 },
      { field: "totalWage", headerName: "totalWage",
        flex: 0.5 },
      { field: "absence", headerName: "absence",
        flex: 0.5 },
      { field: "absenceStatus", headerName: "absenceStatus",
        flex: 1 },
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
    //   {
    //     field: "phone",
    //     headerName: "Phone Number",
    //     flex: 1,
    //   },
    //   {
    //     field: "email",
    //     headerName: "Email",
    //     flex: 1,
    //   },
    //   {
    //     field: "address",
    //     headerName: "Address",
    //     flex: 1,
    //   },
    //   {
    //     field: "city",
    //     headerName: "City",
    //     flex: 1,
    //   },
    //   {
    //     field: "zipCode",
    //     headerName: "Zip Code",
    //     flex: 1,
    //   },
    ];
  
    return (
        <Box m="20px">
        <Header title="SHIFTS"  />
        <Button sx={{marginTop: '10px', color: 'grey', '&:hover': {
                                  backgroundColor: theme.palette.secondary[200], 
                                  color: theme.palette.primary[900], 
                                },}}  variant="contained">
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
            rows={shiftData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    );

}

export default Shifts