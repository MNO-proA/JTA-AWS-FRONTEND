
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HRDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data (you would typically fetch this from an API)
  const employeeData = {
    totalEmployees: 1470,
    genderDistribution: [
      { id: 'Male', value: 882, label: 'Male (60%)' },
      { id: 'Female', value: 588, label: 'Female (40%)' },
    ],
    jobLevelData: [
      { level: 'Level 1', value: 543 },
      { level: 'Level 2', value: 534 },
      { level: 'Level 3', value: 218 },
      { level: 'Level 4', value: 106 },
      { level: 'Level 5', value: 69 },
    ],
    promotionLayoffData: [
      { department: 'Research & Development', promotion: 47, layoff: 23 },
      { department: 'Sales', promotion: 74, layoff: 36 },
      { department: 'Human Resources', promotion: 16, layoff: 7 },
    ],
    serviceYearsData: [
      { id: '1 year', value: 171 },
      { id: '2 years', value: 127 },
      { id: '3 years', value: 128 },
      { id: '4 years', value: 110 },
      { id: '5 years', value: 196 },
      { id: '7 years', value: 90 },
      { id: '9 years', value: 82 },
      { id: '10 years', value: 120 },
    ],
    distanceStatusData: [
      { id: 'Very close', value: 940, percentage: 63.95 },
      { id: 'Close', value: 301, percentage: 20.48 },
      { id: 'Very far', value: 229, percentage: 15.58 },
    ],
    employeeSatisfactionData: [
      { satisfaction: 'High', value: 569 },
      { satisfaction: 'Medium', value: 442 },
      { satisfaction: 'Low', value: 459 },
    ],
    departmentTreeMap: [
      {
        name: 'Departments',
        children: [
          { name: 'Research & Development', loc: 961 },
          { name: 'Sales', loc: 446 },
          { name: 'Human Resources', loc: 63 },
        ],
      },
    ],
    employeeDetails: [
      { name: 'John Doe', department: 'Sales', level: 'Level 2', promotion: 0, layoff: 0 },
      { name: 'Jane Smith', department: 'Research & Development', level: 'Level 3', promotion: 1, layoff: 0 },
      { name: 'Bob Johnson', department: 'Human Resources', level: 'Level 1', promotion: 0, layoff: 1 },
      // ... more employee data
    ],
  };

  const filteredEmployees = employeeData.employeeDetails.filter(
    (employee) =>
      (selectedDepartment === 'All' || employee.department === selectedDepartment) &&
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">HR Dashboard</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{employeeData.totalEmployees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px' }}>
                  <ResponsivePie
                    data={employeeData.genderDistribution}
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
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Employees by Job Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px' }}>
                  <ResponsiveBar
                    data={employeeData.jobLevelData}
                    keys={['value']}
                    indexBy="level"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Job Level',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Count',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Service Years Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px' }}>
                  <ResponsiveLine
                    data={[
                      {
                        id: 'Service Years',
                        data: employeeData.serviceYearsData.map((d) => ({ x: d.id, y: d.value })),
                      },
                    ]}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: 'Years',
                      legendOffset: 36,
                      legendPosition: 'middle',
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Count',
                      legendOffset: -40,
                      legendPosition: 'middle',
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Employee Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '200px' }}>
                  <ResponsivePie
                    data={employeeData.employeeSatisfactionData}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
              <div className="flex space-x-2">
                <Select onValueChange={(value) => setSelectedDepartment(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Research & Development">Research & Development</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Due for Promotion</TableHead>
                    <TableHead>Will be Laid Off</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.level}</TableCell>
                      <TableCell>{employee.promotion ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{employee.layoff ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '400px' }}>
                  <ResponsiveTreeMap
                    data={employeeData.departmentTreeMap[0]}
                    identity="name"
                    value="loc"
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    labelSkipSize={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
                    parentLabelPosition="left"
                    parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Promotion and Layoff by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '400px' }}>
                  <ResponsiveBar
                    data={employeeData.promotionLayoffData}
                    keys={['promotion', 'layoff']}
                    indexBy="department"
                    groupMode="grouped"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Department',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Count',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};