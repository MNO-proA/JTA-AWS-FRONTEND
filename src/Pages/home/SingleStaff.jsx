/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';

import { useGetShiftsQuery, selectAllShifts } from "../../features/shifts/shiftSlice";
import { useSelector } from "react-redux";




const SingleStaff = ({
    staffID,
    fullName,
    employmentType,
    jobTitle,
    hourlyRate,
    onDelete,
    isStaffAddLoading,
    isDatatLoadingCus,
    isAddLoadingCus,
    isDeleteLoading,
    role
  }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const [accumTotal, setAccumTotal] = useState(0)
    const [accumTotalHours, setAccumTotalHours] = useState(0);
    const {isLoading: isShiftsLoading} = useGetShiftsQuery()
    const shiftsData = useSelector(selectAllShifts)

  

    function getTotalWageForStaff(shiftsData, staffID) {
        const totalWage = shiftsData.reduce((total, shift) => {
          if (shift.staffID === staffID) {
            return parseFloat(total) + parseFloat(shift.Total_Wage);
          }
          return total;
        }, 0);
    
        setAccumTotal(totalWage); // Update the accumTotal state with the calculated totalWage
      }

      function getTotalHoursForStaff(shiftsData, staffID) {
        const totalHours = shiftsData.reduce((total, shift) => {
          if (shift.staffID === staffID) {
            return parseFloat(total) + parseFloat(shift.Total_Hours);
          }
          return total;
        }, 0);
    
        setAccumTotalHours(totalHours);
      }
      
    useEffect(() => {
        getTotalWageForStaff(shiftsData, staffID);
        getTotalHoursForStaff(shiftsData, staffID);
      }, [shiftsData, staffID]);

    //   useEffect(() => {
    //     getTotalHoursForStaff(shiftsData, staffID);
    //   }, [shiftsData, staffID]);


  
    return (
      <Card
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          position: 'relative',
          paddingBottom: '3rem'
        
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
          <Typography variant="h5" component="div" sx={{ mb: "1.5rem" }}>
            <strong style={{color: theme.palette.secondary[100], fontSize: '1.3rem'}}>{fullName}</strong>
          </Typography>
          <Typography sx={{ mb: "1rem" }} color={theme.palette.secondary[100]}>
            {jobTitle}
          </Typography>
          <Typography sx={{ mb: "1rem" }} color={theme.palette.secondary[100]}>
            {employmentType}
          </Typography>

        </CardContent>
        <CardActions>
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ position: 'absolute', bottom: '1rem', right: '1rem', color: theme.palette.secondary[100] }}
          >
            <strong>SEE MORE</strong>
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
            <Typography sx={{ mb: "1.5rem" }}  >
              Accumulated Total Wage: {accumTotal.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
            </Typography>
            <Typography sx={{ mb: "1.5rem" }} >
              Acuumulated Total Hours: {accumTotalHours}
            </Typography> 
            <Typography sx={{ mb: "1.5rem" }}>
              Hourly Rate: {hourlyRate}
            </Typography> 
            {role === "ADMIN"? 
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={onDelete}
            >
           {isStaffAddLoading || isAddLoadingCus || isDatatLoadingCus || isDeleteLoading  ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Delete"
                        )}
            </Button> :
             <LockIcon sx={{color: theme.palette.secondary[300]}}/>
            }
           
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  export default SingleStaff