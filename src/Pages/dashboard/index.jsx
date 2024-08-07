/* eslint-disable no-unused-vars */

import  { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material';
import { useGetShiftsQuery, selectAllShifts } from '../../features/shifts/shiftSlice';
import { useGetExpensesQuery, selectAllExpenses } from '../../features/expenses/expenseSlice';
import { selectAllStaff, selectStaffsTotal, useGetStaffQuery } from "../../features/staffs/staffSlice";
import { useSelector } from 'react-redux';
import useDashboardData from './hook/Dataprocessing';
import GeneratePDFButton from './CaptureDashboardButton';
import DownloadCSVButton from './DownloadCSVButton';



const AllDashboard = () => {
  const {isLoading: isStaffLoading} = useGetStaffQuery()
  const {isLoading: isShiftsLoading} = useGetShiftsQuery()
  const {isLoading: isExpenseLoading} = useGetExpensesQuery()

  const staffsData = useSelector(selectAllStaff)
  const shiftsData = useSelector(selectAllShifts)
  const expensesData = useSelector(selectAllExpenses)
  const staffsTotal = useSelector(selectStaffsTotal)

  // useEffect(()=>{
  //   console.log(staffsData)
  // }, [staffsData])
  // useEffect(()=>{
  //   console.log(shiftsData)
  // }, [shiftsData])
  // useEffect(()=>{
  //   console.log(expensesData)
  // }, [expensesData])




  const {
    wageData,
    hoursData,
    absenceData,
    expenseData,
    shiftProportions,
    grandTotalWage,
    grandTotalExpense,
    staffList,
    startDate,
    endDate,
    absenceStatusFrequency,
    handleDateRangeChange,
    handleShortcutRange
  } = useDashboardData(shiftsData, expensesData, staffsData);


  // Sort wageData in ascending order by totalWage
  const sortedWageData = wageData.sort((a, b) => a.totalWage - b.totalWage);
  // Sort hoursData in ascending order by totalHours
  const sortedHoursData = hoursData.sort((a, b) => a.totalHours - b.totalHours);
  // Sort absenceData in ascending order by 'yes'
  const sortedAbsenceData = absenceData.sort((a, b) => a.yes - b.yes)
  // Sort expenseData in ascending order by 'total'
  const sortedExpenseData = expenseData.sort((a, b) => a.total - b.total);
  const sortedAbsenceStatusData = absenceStatusFrequency.sort((a, b) => a.frequency - b.frequency);
// useEffect(()=>{
//   console.log(sortedAbsenceStatusData)
// }, [sortedAbsenceStatusData])

  const theme = useTheme()

  return (
    <Box m="20px">
      <div className='d-flex gap-4 mb-3'>
      <GeneratePDFButton />
      <DownloadCSVButton
       staffData={staffsData}
       shiftData={shiftsData}
       expenseData={expensesData} />
      </div>
      
        <div id="dashboard-content">    
          <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{   bgcolor: theme.palette.background.default }} className="date-range-picker">
              <CardContent>
                {/* <Typography mb={2} variant="h6">Date Range Picker</Typography> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => handleDateRangeChange(newValue, endDate)}
                      sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on small screens
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => handleDateRangeChange(startDate, newValue)}
                      sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on small screens
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={2} >
                    {['This Week', 'Last Week', 'This Month', 'Last Month', 'Reset'].map((range) => (
                      <Button
                        key={range}
                        variant="contained"
                        onClick={() => handleShortcutRange(range)}
                        sx={{ margin: '70px' }}// Add margin-bottom for better spacing on small screens
                      >
                      
                      <strong style={{color: theme.palette.secondary[100]}} >{range} </strong>
                      </Button>
                    ))}
                  </Stack>
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>
               {/* ++++++++++++++++++++++++++++ TOTAL HOURS BAR  +++++++++++++++++++++++++++ */}
               <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.background.default}} className="chart-container">
            <CardContent>
              <Typography variant="h6">Total Hours per Staff</Typography>
              <Box height={500} sx={{mt: '20px'}}>
                <ResponsiveBar
                  data={sortedHoursData}
                  keys={['totalHours']}
                  indexBy="fullName"
                  margin={{ top: 10, right: 250, bottom: 10, left: 20 }}
                  padding={0.1}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={{
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: 0,
                    // legend: 'Employee',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  axisBottom={null}
                  innerPadding={4}
                  axisLeft={null}
                  tooltip={({ data }) => (
                    <div style={{backgroundColor: theme.palette.primary[100], color: theme.palette.primary[900], padding: '8px' }}>
                      <strong>{data.fullName}</strong><br />
                      {/* Staff ID: {data.staffID}<br /> */}
                      Total Hours: {data.totalHours}
                    </div>
                  )}
                  label={d => (d.value > 0 ? `${d.value}` : '')} // Show label only when value is greater than 0
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.primary[100], // Font color for axis ticks
                        },
                      },
                      legend: {
                        text: {
                          fill: theme.palette.primary[100],// Font color for axis legends
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for chart legends
                      },
                    },
                    labels: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for bar labels
                      },
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.primary[100], // Background color for tooltip
                        color: theme.palette.primary[900], // Font color for tooltip
                        fontSize: '14px', // Font size for tooltip
                      },
                    },
                    
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
       
        {/* ++++++++++++++++++++++++++++ CARD TOTALS  +++++++++++++++++++++++++++ */}
        <Grid item xs={12} md={4}>
          <Card  sx={{ bgcolor: theme.palette.background.default, boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} }>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h3">{staffsTotal}</Typography>
            </CardContent>
          </Card>
          <br />
          <br />
       
          <Card  sx={{ bgcolor: theme.palette.background.default, boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} }>
            <CardContent>
              <Typography variant="h6">Grand Total Wage</Typography>
              <Typography variant="h3">{grandTotalWage.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Typography>
            </CardContent>
          </Card>
          <br />
          <br />
      
          <Card sx={{ bgcolor: theme.palette.background.default, boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} } >
            <CardContent>
              <Typography variant="h6">Grand Total Expense</Typography>
              <Typography variant="h3">{grandTotalExpense.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Typography>
            </CardContent>
          </Card>
        {/* </Grid> */}
        </Grid>
  
         {/* ++++++++++++++++++++++++++++ TOTAL WAGE BAR +++++++++++++++++++++++++++ */}
         <Grid item xs={12} md={12}>
          <Card   sx={{   bgcolor: theme.palette.background.default  }} className="chart-container">
            <CardContent>
              <Typography variant="h6">Total Wages per Employee</Typography>
              <Box height={500} sx={{mt: '20px'}}>
              <ResponsiveBar
                  data={sortedWageData}
                  keys={['totalWage']}
                  indexBy="fullName"
                  margin={{ top: 10, right: 250, bottom: 10, left: 20 }}
                  sx={{height: '900px'}}
                  padding={0.1}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  colors="#4dc4b8"
                  indexScale={{ type: 'band', round: true }}
                  // colors={{ scheme: 'nivo' }}
                  axisTop={null}
                  axisRight={{
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: 0,
                    // legend: 'Employee',
                    // legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  innerPadding={4}
                  axisBottom={null}
                  axisLeft={null}
                  tooltip={({ data }) => (
                    <div style={{backgroundColor: theme.palette.primary[100], color: theme.palette.primary[900], padding: '8px' }}>
                      <strong>{data.fullName}</strong><br />
                      {/* Staff ID: {data.staffID}<br /> */}
                      Total Wage: {data.totalWage.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                    </div>
                  )}
                  label={d => (d.value > 0 ? `${d.value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}` : '')} // Show label only when value is greater than 0
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.primary[100], // Font color for axis ticks
                        },
                      },
                      legend: {
                        text: {
                          fill: theme.palette.primary[100],// Font color for axis legends
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for chart legends
                      },
                    },
                    labels: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for bar labels
                      },
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.secondary[100], // Background color for tooltip
                        color: theme.palette.primary[900], // Font color for tooltip
                        fontSize: '14px', // Font size for tooltip
                      },
                    },
                   
                  }}
                
                  // 5px 5px 5px 5px ${theme.palette.primary[900]}
                /> 
              </Box>
            </CardContent>
          </Card>
        </Grid>
         {/* ++++++++++++++++++++++++++++ ABSENCE BAR +++++++++++++++++++++++++++ */}
         <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.background.default}} className="chart-container">
            <CardContent>
              <Typography variant="h6">Total Absence</Typography>
              <Box height={500} sx={{mt: '20px'}}>
                 <ResponsiveBar
                 data={sortedAbsenceData }
                 keys={['yes']}
                 indexBy="fullName"
                 margin={{ top: 10, right: 250, bottom: 10, left: 20 }}
                 padding={0.1}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={{
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: 0,
                    // legend: 'Value',
                    // legendPosition: 'middle',
                    // legendOffset: -40
                  }}
                  axisBottom={null}
                  innerPadding={4}
                  axisLeft={null}
                  tooltip={({  data }) => (
                    <div style={{backgroundColor: theme.palette.primary[100], color: theme.palette.primary[900], padding: '8px' }}>
                    <strong>{data.fullName}</strong><br />
                    {/* Staff ID: {data.staffID}<br /> */}
                    Absences: {data.yes}
                    {/* Absensce_Status */}
                    </div>
                  )}
                  label={d => (d.value > 0 ? `${d.value}` : '')} // Show label only when value is greater than 0
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.primary[100],
                        },
                      },
                      legend: {
                        text: {
                          fill: theme.palette.primary[100],
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: theme.palette.primary[100],
                      },
                    },
                    labels: {
                      text: {
                        fill: theme.palette.primary[100],
                      },
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.primary[100],
                        color: theme.palette.primary[900],
                        fontSize: '14px',
                      },
                    },
                  }}
                />



              </Box>
            </CardContent>
          </Card>
        </Grid>
         {/* ++++++++++++++++++++++++++++ ABSENCE STATUS BAR +++++++++++++++++++++++++++ */}
        <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.background.default}} className="chart-container">
            <CardContent>
              <Typography variant="h6">Distribution of Absence Status</Typography>
              <Box height={500} sx={{mt: '20px'}}>
                 <ResponsiveBar
                 data={sortedAbsenceStatusData}
                 keys={['frequency']}
                 indexBy="status"
                 margin={{ top: 10, right: 90, bottom: 10, left: 70 }}
                 padding={0.1}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={null}
                  innerPadding={4}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: 0,
                    // legend: 'Value',
                    // legendPosition: 'middle',
                    // legendOffset: -40
                  }}
                  tooltip={({  data }) => (
                    <div style={{backgroundColor: theme.palette.primary[100], color: theme.palette.primary[900], padding: '8px' }}>
                    Is staff Absent? : {data.status}<br />
                    Frequency of status : {data.frequency}
                    </div>
                  )}
                  label={d => (d.value > 0 ? `${d.value}` : '')} // Show label only when value is greater than 0
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.primary[100],
                        },
                      },
                      legend: {
                        text: {
                          fill: theme.palette.primary[100],
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: theme.palette.primary[100],
                      },
                    },
                    labels: {
                      text: {
                        fill: theme.palette.primary[100],
                      },
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.primary[100],
                        color: theme.palette.primary[900],
                        fontSize: '14px',
                      },
                    },
                  }}
                />



              </Box>
            </CardContent>
          </Card>
        </Grid>
         {/* ++++++++++++++++++++++++++++ DAY/NIGHT PIE +++++++++++++++++++++++++++ */}
        <Grid item xs={12} md={4} sx={{ mt: {
                  xs: 0, // No margin-top on extra-small and small screens
                  md: '146px', // Apply margin-top on medium and larger screens
                }}}>
          <Card   sx={{
                    bgcolor: theme.palette.background.default,
                    boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`,
                    mt: {
                      xs: 0, // No margin-top on extra-small and small screens
                      md: '-750px', // Apply margin-top on medium and larger screens
                    },
                  }} className="chart-container">
            <CardContent>
              <Typography variant="h6">Shifts</Typography>
              <Box height={300}>
                <ResponsivePie
                  data={[
                    { id: 'Day', value: shiftProportions.day.toFixed(1) },
                    { id: 'Night', value: shiftProportions.night.toFixed(1) }
                  ]}
                  margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
                  // innerRadius={0.5}
                  // padAngle={0.7}
                  // cornerRadius={10}
                  // activeOuterRadiusOffset={8}
                  colors={['#4dc4b8', '#b8e1dd', '#2fad9a', '#56b6a4', '#00a08b']}
                  enableArcLinkLabels={false} // Disable arc link labels
                  // arcLinkLabelsSkipAngle={0.2}
                  // arcLinkLabelsTextColor= {theme.palette.primary[100]}
                  // arcLinkLabelsThickness={0.5}
                  // arcLinkLabelsColor={{ from: 'color' }}
                  // arcLabelsSkipAngle={0.2}
                  // arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  
                  theme={{
                    axis: {
                   
                    },
                   
                    tooltip: {
                      container: {
                        background: theme.palette.primary[100], // Background color for tooltip
                        color: theme.palette.primary[900], // Font color for tooltip
                        fontSize: '14px', // Font size for tooltip
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
         {/* ++++++++++++++++++++++++++++ TOTAL EXPENSE BAR +++++++++++++++++++++++++++ */}
        <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.background.default}} className="chart-container">
            <CardContent>
              <Typography variant="h6" sx={{marginLeft: "120px"}}>Total Expenses</Typography>
              <Box height={500} sx={{mt: '20px'}}>
                <ResponsiveBar
                  data={sortedExpenseData}
                  keys={['total']}
                  indexBy="category"
                  margin={{ top: 10, right: 250, bottom: 10, left: 20 }}
                  padding={0.3}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={{
                    tickSize: 3,
                    tickPadding: 5,
                    tickRotation: 0,
                    // legend: 'Value',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  axisBottom={null}
                  axisLeft={null}
                  tooltip={({ data }) => (
                    <div style={{backgroundColor: theme.palette.primary[100], color: theme.palette.primary[900], padding: '8px' }}>
                      <strong>{data.category}</strong><br />
                      {/* Staff ID: {data.staffID}<br /> */}
                      Total: {data.total.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                    </div>
                  )}
                  label={d => (d.value > 0 ? `${d.value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}` : '')} // Show label only when value is greater than 0
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fill: theme.palette.primary[100], // Font color for axis ticks
                        },
                      },
                      legend: {
                        text: {
                          fill: theme.palette.primary[100],// Font color for axis legends
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for chart legends
                      },
                    },
                    labels: {
                      text: {
                        fill: theme.palette.primary[100], // Font color for bar labels
                      },
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.primary[100], // Background color for tooltip
                        color: theme.palette.primary[900], // Font color for tooltip
                        fontSize: '14px', // Font size for tooltip
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
    </Box>
    
  );
};

export default AllDashboard;




