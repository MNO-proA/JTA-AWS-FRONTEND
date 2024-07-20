import { Box, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import StatBox from "../../Components/StatBox";
import Header from "../../Components/Header";
import { useTheme } from "@mui/material";
import {
  
    Button
  } from "@mui/material";
import { tokens } from "../../theme";


const Expenses = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const expenseData = [
        {
            "id": 1,
          "expenseID": "Expense-1",
          "date": "2024-06-28",
          "youngPersonWeeklyMoney": 18.76,
          "maintenance": 20.12,
          "IT": 13.45,
          "misc": 25.99,
          "pettyCash": 12.34,
          "general": 14.57
        },
        {
            "id": 2,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
        {
            "id": 3,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
        {
            "id": 4,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
        {
            "id": 5,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
        {
            "id": 6,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
        {
            "id": 7,
          "expenseID": "Expense-2",
          "date": "2024-06-29",
          "youngPersonWeeklyMoney": 11.23,
          "maintenance": 15.67,
          "IT": 19.01,
          "misc": 21.54,
          "pettyCash": 18.99,
          "general": 10.34
        },
      ]
  
    const columns = [
      { field: "expenseID", headerName: "ID", flex: 1 },

      { field: "date", headerName: "date",
        flex: 1 },
      { field: "youngPersonWeeklyMoney", headerName: "youngPersonWeeklyMoney",
        flex: 1 },
      { field: "maintenance", headerName: "maintenance",
        flex: 1 },
      { field: "IT", headerName: "IT",
        flex: 1 },
      { field: "misc", headerName: "misc" ,
        flex: 1},
      { field: "pettyCash", headerName: "pettyCash",
        flex: 1 },
      { field: "general", headerName: "general",
        flex: 1 }
   ]
    return (
        <Box m="20px" >
        {/* ======================================================================= */}
       
        {/* ======================================================================== */}
        <Header title="Expenses"  />
        <Button sx={{marginTop: '7px', color: 'grey',  '&:hover': {
                                  backgroundColor: theme.palette.secondary[200], 
                                  color: theme.palette.primary[900], 
                                }, }}  variant="contained">
                Record Expenses
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
            rows={expenseData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            checkboxSelection
          />
        </Box>
    
      </Box>
    );

}

export default Expenses