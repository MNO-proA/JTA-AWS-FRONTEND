import  { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material';

// Mock data (replace with your actual data)
const employeeData = [
  { id: 'Employee 1', wages: 1000, hours: 40 },
  { id: 'Employee 2', wages: 1200, hours: 45 },
  { id: 'Employee 3', wages: 800, hours: 35 },
];

const houseData = [
  { id: 'House A', value: 30 },
  { id: 'House B', value: 40 },
  { id: 'House C', value: 30 },
];

const absenceData = [
  { id: 'Present', value: 85 },
  { id: 'Absent', value: 15 },
];

const expenseData = [
  { expense: 'Category 1', value: 1000 },
  { expense: 'Category 2', value: 1500 },
  { expense: 'Category 3', value: 800 },
];

const shortcutRanges = [
    {
      label: 'This Week',
      getDates: () => {
        const today = dayjs();
        return [today.startOf('week'), today.endOf('week')];
      },
    },
    {
      label: 'Last Week',
      getDates: () => {
        const lastWeek = dayjs().subtract(1, 'week');
        return [lastWeek.startOf('week'), lastWeek.endOf('week')];
      },
    },
    {
      label: 'This Month',
      getDates: () => {
        const today = dayjs();
        return [today.startOf('month'), today.endOf('month')];
      },
    },
    {
      label: 'Last Month',
      getDates: () => {
        const lastMonth = dayjs().subtract(1, 'month');
        return [lastMonth.startOf('month'), lastMonth.endOf('month')];
      },
    },
  ];


const AllDashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    // Update your data based on the new date range here
  };

  const theme = useTheme()


  return (
    <Box m="20px">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800]}}>
            <CardContent>
              <Typography mb={2} variant="h6">Date Range Picker</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => handleDateRangeChange(newValue, endDate)}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => handleDateRangeChange(startDate, newValue)}
                  />
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {shortcutRanges.map((range) => (
                    <>
                    <Button
                      key={range.label}
                      variant="contained"
                      onClick={() => {
                        const [start, end] = range.getDates();
                        handleDateRangeChange(start, end);
                      }}
                    >
                      {range.label}
                    </Button>
                   
                    </>
                  ))}
                   <Button
                      variant="contained"
                      onClick={() => {
                        handleDateRangeChange(null);
                      }}
                    >
                      Reset
                    </Button>
                </Stack>
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card   sx={{ bgcolor: theme.palette.neutral[800]}}>
            <CardContent>
              <Typography variant="h6">Total Wages per Employee</Typography>
              <Box height={300}>
                <ResponsiveBar
                  data={employeeData}
                  keys={['wages']}
                  indexBy="id"
                  margin={{ top: 50, right: 130, bottom: 50, left: 90 }}
                  padding={0.3}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  colors="#4dc4b8"
                  indexScale={{ type: 'band', round: true }}
                  // colors={{ scheme: 'nivo' }}
                  axisTop={null}
                  axisRight={100}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Wages',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 0,
                    tickRotation: 0,
                    // legend: 'Employee',
                    // legendPosition: 'middle',
                    // legendOffset: -40
                  }}
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
                
                  // `5px 5px 5px 5px ${theme.palette.primary[900]}`
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800], boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} }>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h3">{employeeData.length}</Typography>
            </CardContent>
          </Card>
          <br />
          <br />
       
          <Card  sx={{ bgcolor: theme.palette.neutral[800], boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} }>
            <CardContent>
              <Typography variant="h6">Grand Total Wage</Typography>
              <Typography variant="h3">{employeeData.length}</Typography>
            </CardContent>
          </Card>
          <br />
          <br />
      
          <Card sx={{ bgcolor: theme.palette.neutral[800], boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`} } >
            <CardContent>
              <Typography variant="h6">Grand Total Expense</Typography>
              <Typography variant="h3">
                ${expenseData.reduce((total, expense) => total + expense.value, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        {/* </Grid> */}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800]}}>
            <CardContent>
              <Typography variant="h6">Total Hours per Employee</Typography>
              <Box height={300}>
                <ResponsiveBar
                  data={employeeData}
                  keys={['hours']}
                  indexBy="id"
                  margin={{ top: 50, right: 130, bottom: 50, left: 90 }}
                  padding={0.3}
                  layout="horizontal"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={100}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Hours',
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    // legend: 'Employee',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
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
        <Grid item xs={12} md={4}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800], boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`}}>
            <CardContent>
              <Typography variant="h6">Proportion of Houses</Typography>
              <Box height={300}>
                <ResponsivePie
                  data={houseData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={['#4dc4b8', '#b8e1dd', '#2fad9a', '#56b6a4', '#00a08b']}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor= {theme.palette.primary[100]}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
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
        <Grid item xs={12} md={4}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800], boxShadow: `0.5px 0.5px 3px 0.5px  #0c7a75`}}>
            <CardContent>
              <Typography variant="h6">Proportion of Absence</Typography>
              <Box height={300}>
                <ResponsivePie
                  data={absenceData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={['#4dc4b8', '#b8e1dd', '#2fad9a', '#56b6a4', '#00a08b']}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor= {theme.palette.primary[100]}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
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
        <Grid item xs={12} md={8}>
          <Card  sx={{ bgcolor: theme.palette.neutral[800]}}>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Box height={300}>
                <ResponsiveBar
                  data={expenseData}
                  keys={['value']}
                  indexBy="expense"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors="#4dc4b8"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Category',
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Value',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
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
      <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      
    </Box>
    
  );
};

export default AllDashboard;


