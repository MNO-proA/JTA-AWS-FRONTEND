/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../Components/Header";
// import { useGetProductsQuery } from "state/api";



const SingleStaff = ({
    staffID,
    fullName,
    employmentType,
    jobTitle,
    hourlyRate
  }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
  
    return (
      <Card
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[200]}
            gutterBottom
          >
            { staffID}
          </Typography>
          <Typography variant="h5" component="div">
            {fullName}
          </Typography>
          <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[100]}>
            {jobTitle}
          </Typography>
          <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[100]}>
            {employmentType}
          </Typography>
          
  
          {/* <Typography variant="body2">{description}</Typography> */}
        </CardContent>
        <CardActions>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{marginRight: '1rem'}}
          >
            See More
          </Button>
          <Button
            variant="danger"
            size="small"
        
          
          >
            Delete
          </Button>
        </CardActions>
        <Collapse
          in={isExpanded}
          timeout="auto"
          unmountOnExit
          sx={{
            color: theme.palette.neutral[300],
          }}
        >
          <CardContent>
            <Typography color={theme.palette.secondary[100]}>id: {staffID}</Typography>
            {/* <Typography>Supply Left: {supply}</Typography>
            <Typography>
              Yearly Sales This Year: {stat.yearlySalesTotal}
            </Typography>
            <Typography>
              Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
            </Typography> */}
          </CardContent>
        </Collapse>
      </Card>
    );
  };





const Overview = () => {
    // const { data, isLoading } = useGetProductsQuery();
    const isNonMobile = useMediaQuery("(min-width: 1000px)");
    const [isLoading, SetIsLoading] = useState()
    const theme = useTheme();
    const data = [
        {
          "staffID": "Staff-1",
          "fullName": "Staff Member 1",
          "employmentType": "Full-time",
          "jobTitle": "Caregiver",
          "hourlyRate": 22.987654321
        },
        {
          "staffID": "Staff-2",
          "fullName": "Staff Member 2",
          "employmentType": "Part-time",
          "jobTitle": "Nurse",
          "hourlyRate": 12.3456789
        },
        {
          "staffID": "Staff-3",
          "fullName": "Staff Member 3",
          "employmentType": "Full-time",
          "jobTitle": "Administrator",
          "hourlyRate": 18.7654321
        },
        {
          "staffID": "Staff-4",
          "fullName": "Staff Member 4",
          "employmentType": "Part-time",
          "jobTitle": "Caregiver",
          "hourlyRate": 20.123456789
        },
        {
          "staffID": "Staff-5",
          "fullName": "Staff Member 5",
          "employmentType": "Full-time",
          "jobTitle": "Nurse",
          "hourlyRate": 29.87654321
        },
        {
          "staffID": "Staff-6",
          "fullName": "Staff Member 6",
          "employmentType": "Part-time",
          "jobTitle": "Caregiver",
          "hourlyRate": 14.567890123
        },
        {
          "staffID": "Staff-7",
          "fullName": "Staff Member 7",
          "employmentType": "Full-time",
          "jobTitle": "Administrator",
          "hourlyRate": 27.654321
        },
        {
          "staffID": "Staff-8",
          "fullName": "Staff Member 8",
          "employmentType": "Part-time",
          "jobTitle": "Nurse",
          "hourlyRate": 19.87654321
        }
      ]
  
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="STAFFS" color= '#10453e' />
        <Button sx={{marginTop: '10px', color: '#10453e', '&:hover': {
                                  backgroundColor: theme.palette.secondary[200], 
                                  color: theme.palette.primary[900], 
                                },}}   variant="contained">
                Create New Staff
              </Button>
        {data || !isLoading ? (
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
            {data.map(
              ({
                _id,
                staffID,
                fullName,
                employmentType,
                jobTitle,
                hourlyRate
              }) => (
                <SingleStaff 
                  key={_id}
                  _id={_id}
                  staffID={staffID}
                  fullName={fullName}
                  employmentType={employmentType}
                  jobTitle={jobTitle}
                  hourlyRate={hourlyRate}
                />
              )
            )}
          </Box>
        ) : (
          <>Loading...</>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Box>
    );
}

export default Overview