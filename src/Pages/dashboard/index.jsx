import  { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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



  return (
    <Box m="20px">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
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
          <Card>
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
                  indexScale={{ type: 'band', round: true }}
                  colors={{ scheme: 'nivo' }}
                  axisTop={null}
                  axisRight={100}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Wages',
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 0,
                    tickRotation: 0,
                    // legend: 'Employee',
                    // legendPosition: 'middle',
                    // legendOffset: -40
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h3">{employeeData.length}</Typography>
            </CardContent>
          </Card>
          <br />
          <br />
          <br />
          <br />
          <Card >
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
          <Card>
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
                  colors={{ scheme: 'nivo' }}
                  axisTop={null}
                  axisRight={null}
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
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
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
                  colors={{ scheme: 'nivo' }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
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
                  colors={{ scheme: 'nivo' }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
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
                  colors={{ scheme: 'nivo' }}
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





















// import React, { useState } from 'react';
// import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
// import { LocalizationProvider, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// // Mock data (replace with your actual data)
// const employeeData = [
//   { name: 'Employee 1', wages: 1000, hours: 40 },
//   { name: 'Employee 2', wages: 1200, hours: 45 },
//   { name: 'Employee 3', wages: 800, hours: 35 },
// ];

// const houseData = [
//   { name: 'House A', value: 30 },
//   { name: 'House B', value: 40 },
//   { name: 'House C', value: 30 },
// ];

// const absenceData = [
//   { name: 'Present', value: 85 },
//   { name: 'Absent', value: 15 },
// ];

// const expenseData = [
//   { name: 'Category 1', value: 1000 },
//   { name: 'Category 2', value: 1500 },
//   { name: 'Category 3', value: 800 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const shortcutsItems = [
//   {
//     label: 'This Week',
//     getValue: () => {
//       const today = dayjs();
//       return [today.startOf('week'), today.endOf('week')];
//     },
//   },
//   // ... (include other shortcut items as in your example)
// ];

// const AllDashboard = () => {
//   const [dateRange, setDateRange] = useState([null, null]);

//   const handleDateRangeChange = (newDateRange) => {
//     setDateRange(newDateRange);
//     // Update your data based on the new date range here
//   };

//   return (
//     <Box m="20px">
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Wages per Employee</Typography>
//               <BarChart width={600} height={300} data={employeeData} layout="vertical">
//                 <XAxis type="number"/>
//                 <YAxis dataKey="name" type="category"/>
//                 <Tooltip />
//                 <Bar dataKey="wages" fill="#8884d8" />
//               </BarChart>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Employees</Typography>
//               <Typography variant="h3">{employeeData.length}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Hours per Employee</Typography>
//               <BarChart width={600} height={300} data={employeeData} layout="vertical">
//                 <XAxis type="number"/>
//                 <YAxis dataKey="name" type="category"/>
//                 <Tooltip />
//                 <Bar dataKey="hours" fill="#82ca9d" />
//               </BarChart>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Proportion of Houses</Typography>
//               <PieChart width={200} height={200}>
//                 <Pie data={houseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
//                   {houseData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Proportion of Absence</Typography>
//               <PieChart width={200} height={200}>
//                 <Pie data={absenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
//                   {absenceData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Expenses</Typography>
//               <BarChart width={600} height={300} data={expenseData}>
//                 <XAxis dataKey="name"/>
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#8884d8" />
//               </BarChart>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Grand Total Expense</Typography>
//               <Typography variant="h3">
//                 ${expenseData.reduce((total, expense) => total + expense.value, 0).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Date Range Picker</Typography>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <StaticDateRangePicker
//                   value={dateRange}
//                   onChange={handleDateRangeChange}
//                   slotProps={{
//                     shortcuts: { items: shortcutsItems },
//                     actionBar: { actions: [] },
//                   }}
//                   calendars={2}
//                 />
//               </LocalizationProvider>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AllDashboard;















// import { useState } from 'react';
// import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveBar } from '@nivo/bar';
// import { ResponsiveLine } from '@nivo/line';
// import { ResponsiveTreeMap } from '@nivo/treemap';
// import { 
//     Card, 
//     CardContent, 
//     CardHeader, 
  
//     Tabs,
//     Tab,
   
//     Select,
//     MenuItem,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     TextField
    
//   } from '@mui/material';
//   import { useTheme } from "@mui/material";
//   import { tokens } from "../../theme";


// const AllDashboard = () => {
//     const [selectedDepartment, setSelectedDepartment] = useState('All');
//     const [searchTerm, setSearchTerm] = useState('');
//       // Initialize the value state to 0
//     const [value, setValue] = useState(0);

//     // Handle tab change
//     const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//     // Sample data (you would typically fetch this from an API)
//     const employeeData = {
//       totalEmployees: 1470,
//       genderDistribution: [
//         { id: 'Male', value: 882, label: 'Male (60%)' },
//         { id: 'Female', value: 588, label: 'Female (40%)' },
//       ],
//       jobLevelData: [
//         { level: 'Level 1', value: 543 },
//         { level: 'Level 2', value: 534 },
//         { level: 'Level 3', value: 218 },
//         { level: 'Level 4', value: 106 },
//         { level: 'Level 5', value: 69 },
//       ],
//       promotionLayoffData: [
//         { department: 'Research & Development', promotion: 47, layoff: 23 },
//         { department: 'Sales', promotion: 74, layoff: 36 },
//         { department: 'Human Resources', promotion: 16, layoff: 7 },
//       ],
//       serviceYearsData: [
//         { id: '1 year', value: 171 },
//         { id: '2 years', value: 127 },
//         { id: '3 years', value: 128 },
//         { id: '4 years', value: 110 },
//         { id: '5 years', value: 196 },
//         { id: '7 years', value: 90 },
//         { id: '9 years', value: 82 },
//         { id: '10 years', value: 120 },
//       ],
//       distanceStatusData: [
//         { id: 'Very close', value: 940, percentage: 63.95 },
//         { id: 'Close', value: 301, percentage: 20.48 },
//         { id: 'Very far', value: 229, percentage: 15.58 },
//       ],
//       employeeSatisfactionData: [
//         { satisfaction: 'High', value: 569 },
//         { satisfaction: 'Medium', value: 442 },
//         { satisfaction: 'Low', value: 459 },
//       ],
//       departmentTreeMap: [
//         {
//           name: 'Departments',
//           children: [
//             { name: 'Research & Development', loc: 961 },
//             { name: 'Sales', loc: 446 },
//             { name: 'Human Resources', loc: 63 },
//           ],
//         },
//       ],
//       employeeDetails: [
//         { name: 'John Doe', department: 'Sales', level: 'Level 2', promotion: 0, layoff: 0 },
//         { name: 'Jane Smith', department: 'Research & Development', level: 'Level 3', promotion: 1, layoff: 0 },
//         { name: 'Bob Johnson', department: 'Human Resources', level: 'Level 1', promotion: 0, layoff: 1 },
//         // ... more employee data
//       ],
//     };
  
//     const filteredEmployees = employeeData.employeeDetails.filter(
//       (employee) =>
//         (selectedDepartment === 'All' || employee.department === selectedDepartment) &&
//         employee.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
  
//     return (
//       <div className="p-4">
//         <h1 className="text-3xl font-bold mb-4">HR Dashboard</h1>
//         <Tabs value={value} onChange={handleChange} className="w-full">
//         <Tab label="Overview" color={theme.palette.secondary[200]} />
//         <Tab label="Employees" />
//         <Tab label="Departments" />
//       </Tabs>
//       {/* -------------------------------------------------- */}
//       {value === 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <Card>
//             <CardHeader title="Total Employees" />
//             <CardContent>
//               <div className="text-4xl font-bold">{employeeData.totalEmployees}</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader title="Gender Distribution" />
//             <CardContent>
//               <div style={{ height: '200px' }}>
//                 <ResponsivePie
//                   data={employeeData.genderDistribution}
//                   margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//                   innerRadius={0.5}
//                   padAngle={0.7}
//                   cornerRadius={3}
//                   activeOuterRadiusOffset={8}
//                   colors={{ scheme: 'nivo' }}
//                   arcLinkLabelsSkipAngle={10}
//                   arcLinkLabelsTextColor="#333333"
//                   arcLinkLabelsThickness={2}
//                   arcLinkLabelsColor={{ from: 'color' }}
//                   arcLabelsSkipAngle={10}
//                   arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader title="Employees by Job Level" />
//             <CardContent>
//               <div style={{ height: '200px' }}>
//                 <ResponsiveBar
//                   data={employeeData.jobLevelData}
//                   theme={{
//                     axis: {
//                       domain: {
//                         line: {
//                           stroke: colors.grey[100],
//                         },
//                       },
//                       legend: {
//                         text: {
//                           fill: colors.grey[100],
//                         },
//                       },
//                       ticks: {
//                         line: {
//                           stroke: colors.grey[100],
//                           strokeWidth: 1,
//                         },
//                         text: {
//                           fill: colors.grey[100],
//                         },
//                       },
//                     },
//                     legends: {
//                       text: {
//                         fill: colors.grey[100],
//                       },
//                     },
//                   }}
//                   keys={['value']}
//                   indexBy="level"
//                   margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
//                   padding={0.3}
//                   colors={{ scheme: "nivo" }}
//                   axisBottom={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: 0,
//                     legend: 'Job Level',
//                     legendPosition: 'middle',
//                     legendOffset: 32,
//                   }}
//                   axisLeft={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: 0,
//                     legend: 'Count',
//                     legendPosition: 'middle',
//                     legendOffset: -40,
//                   }}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader title="Service Years Distribution" />
//             <CardContent>
//               <div style={{ height: '200px' }}>
//                 <ResponsiveLine
//                   data={[
//                     {
//                       id: 'Service Years',
//                       data: employeeData.serviceYearsData.map((d) => ({ x: d.id, y: d.value })),
//                     },
//                   ]}
//                   margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//                   xScale={{ type: 'point' }}
//                   yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
//                   axisTop={null}
//                   axisRight={null}
//                   axisBottom={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: -45,
//                     legend: 'Years',
//                     legendOffset: 36,
//                     legendPosition: 'middle',
//                   }}
//                   axisLeft={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickRotation: 0,
//                     legend: 'Count',
//                     legendOffset: -40,
//                     legendPosition: 'middle',
//                   }}
//                   pointSize={10}
//                   pointColor={{ theme: 'background' }}
//                   pointBorderWidth={2}
//                   pointBorderColor={{ from: 'serieColor' }}
//                   pointLabelYOffset={-12}
//                   useMesh={true}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader title="Employee Satisfaction" />
//             <CardContent>
//               <div style={{ height: '200px' }}>
//                 <ResponsivePie
//                   data={employeeData.employeeSatisfactionData}
//                   theme={{
//                     axis: {
//                       domain: {
//                         line: {
//                           stroke: colors.grey[100],
//                         },
//                       },
//                       legend: {
//                         text: {
//                           fill: colors.grey[100],
//                         },
//                       },
//                       ticks: {
//                         line: {
//                           stroke: colors.grey[100],
//                           strokeWidth: 1,
//                         },
//                         text: {
//                           fill: colors.grey[100],
//                         },
//                       },
//                     },
//                     legends: {
//                       text: {
//                         fill: colors.grey[100],
//                       },
//                     },
//                   }}
//                   margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//                   innerRadius={0.5}
//                   padAngle={0.7}
//                   cornerRadius={3}
//                   activeOuterRadiusOffset={8}
//                   colors={{ scheme: 'nivo' }}
//                   arcLinkLabelsSkipAngle={10}
//                   arcLinkLabelsTextColor="#333333"
//                   arcLinkLabelsThickness={2}
//                   arcLinkLabelsColor={{ from: 'color' }}
//                   arcLabelsSkipAngle={10}
//                   arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//       {/* ------------------------------------------------------ */}
//       {/* ================================================================ */}
//       {value === 1 && (
//         <Card>
//           <CardHeader title="Employee List" />
//           <CardContent>
//             <div className="flex space-x-2">
//               <Select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 displayEmpty
//                 variant="outlined"
//               >
//                 <MenuItem value="All">All Departments</MenuItem>
//                 <MenuItem value="Sales">Sales</MenuItem>
//                 <MenuItem value="Research & Development">Research & Development</MenuItem>
//                 <MenuItem value="Human Resources">Human Resources</MenuItem>
//               </Select>
//               <TextField
//                 label="Search"
//                 placeholder="Search employees..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 variant="outlined"
//               />
//             </div>
//           </CardContent>
//           <CardContent>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Department</TableCell>
//                   <TableCell>Level</TableCell>
//                   <TableCell>Due for Promotion</TableCell>
//                   <TableCell>Will be Laid Off</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredEmployees.map((employee, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{employee.name}</TableCell>
//                     <TableCell>{employee.department}</TableCell>
//                     <TableCell>{employee.level}</TableCell>
//                     <TableCell>{employee.promotion ? 'Yes' : 'No'}</TableCell>
//                     <TableCell>{employee.layoff ? 'Yes' : 'No'}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}
//        {/* =============================================================== */}
//       {value === 2 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader title='Department Distribution'/>
//           <CardContent>
//             <div style={{ height: '400px' }}>
//               <ResponsiveTreeMap
//                 data={employeeData.departmentTreeMap[0]}
//                 identity="name"
//                 value="loc"
//                 margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
//                 labelSkipSize={12}
//                 labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
//                 parentLabelPosition="left"
//                 parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
//                 borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
//               />
//             </div>
//             </CardContent>
//         </Card>
//         <Card>
//           <CardHeader title='Promotion and Layoff by Department'/>
        
//           <CardContent>
//             <div style={{ height: '400px' }}>
//               <ResponsiveBar
//                 data={employeeData.promotionLayoffData}
//                 keys={['promotion', 'layoff']}
//                 indexBy="department"
//                 groupMode="grouped"
//                 margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//                 padding={0.3}
//                 colors={{ scheme: 'nivo' }}
//                 axisBottom={{
//                   tickSize: 5,
//                   tickPadding: 5,
//                   tickRotation: 0,
//                   legend: 'Department',
//                   legendPosition: 'middle',
//                   legendOffset: 32,
//                 }}
//                 axisLeft={{
//                   tickSize: 5,
//                   tickPadding: 5,
//                   tickRotation: 0,
//                   legend: 'Count',
//                   legendPosition: 'middle',
//                   legendOffset: -40,
//                 }}
//                 legends={[
//                   {
//                     dataFrom: 'keys',
//                     anchor: 'bottom-right',
//                     direction: 'column',
//                     justify: false,
//                     translateX: 120,
//                     translateY: 0,
//                     itemsSpacing: 2,
//                     itemWidth: 100,
//                     itemHeight: 20,
//                     itemDirection: 'left-to-right',
//                     itemOpacity: 0.85,
//                     symbolSize: 20,
//                     effects: [
//                       {
//                         on: 'hover',
//                         style: {
//                           itemOpacity: 1,
//                         },
//                       },
//                     ],
//                   },
//                 ]}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       )}
//        {/* ************************************************************************ */}
        
//       </div>
//     );
//   };

// export default AllDashboard;
