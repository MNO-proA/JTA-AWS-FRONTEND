import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

const useDateRangePicker = () => {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  const handleShortcutRange = useCallback((range) => {
    const today = dayjs();
    const ranges = {
      'This Week': [today.startOf('week'), today.endOf('week')],
      'Last Week': [today.subtract(1, 'week').startOf('week'), today.subtract(1, 'week').endOf('week')],
      'This Month': [today.startOf('month'), today.endOf('month')],
      'Last Month': [today.subtract(1, 'month').startOf('month'), today.subtract(1, 'month').endOf('month')],
      'Reset': [null, null]
    };
    handleDateRangeChange(...(ranges[range] || [null, null]));
  }, [handleDateRangeChange]);

  return { ...dateRange, handleDateRangeChange, handleShortcutRange };
};

const processShiftData = (shifts, startDate, endDate, staffData) => {
  const isWithinRange = (date) => (
    (!startDate || date.isAfter(startDate) || date.isSame(startDate, 'day')) &&
    (!endDate || date.isBefore(endDate) || date.isSame(endDate, 'day'))
  );

  return shifts.reduce((acc, shift) => {
    const shiftDate = dayjs(shift.startDate);
    if (!isWithinRange(shiftDate)) return acc;

    const staffID = shift.staffID;
    if (!acc.staffTotals[staffID]) {
      acc.staffTotals[staffID] = {
        totalWage: 0,
        totalHours: 0,
        absenceYes: 0,
        absenceNo: 0,
        dayShifts: 0,
        nightShifts: 0,
        fullName: staffData.find(s => s.staffID === staffID)?.fullName || 'Unknown'
      };
    }

    acc.staffTotals[staffID].totalWage += parseFloat(shift?.Total_Wage ?? 0);
    acc.staffTotals[staffID].totalHours += parseFloat(shift?.Total_Hours ?? 0);
    acc.staffTotals[staffID].absenceYes += (shift?.Absence?.toLowerCase() === 'yes' ? 1 : 0);
    acc.staffTotals[staffID].absenceNo += (shift?.Absence?.toLowerCase() === 'no' ? 1 : 0);
    acc.staffTotals[staffID].dayShifts += (shift?.Shift?.toLowerCase() === 'day' ? 1 : 0);
    acc.staffTotals[staffID].nightShifts += (shift?.Shift?.toLowerCase() === 'night' ? 1 : 0);

    // Count absence status frequency
    const absenceStatus = shift?.Absence_Status ?? 'Present';
    acc.absenceStatusFrequency[absenceStatus] = (acc.absenceStatusFrequency[absenceStatus] || 0) + 1;

    return acc;
  }, { staffTotals: {}, absenceStatusFrequency: {} });
};

const processExpenseData = (expenses, startDate, endDate) => {
  const isWithinRange = (date) => (
    (!startDate || date.isAfter(startDate) || date.isSame(startDate, 'day')) &&
    (!endDate || date.isBefore(endDate) || date.isSame(endDate, 'day'))
  );

  return expenses.reduce((acc, expense) => {
    const expenseDate = dayjs(expense.date);
    if (!isWithinRange(expenseDate)) return acc;

    Object.entries(expense).forEach(([key, value]) => {
      if (key !== 'date' && key !== 'expenseID') {
        acc[key] = (acc[key] || 0) + parseFloat(value ?? 0);
      }
    });

    return acc;
  }, {});
};

const useDashboardData = (shifts, expenses, staffData) => {
  const { startDate, endDate, handleDateRangeChange, handleShortcutRange } = useDateRangePicker();
  const [dashboardData, setDashboardData] = useState({
    wageData: [],
    hoursData: [],
    absenceData: [],
    expenseData: [],
    shiftProportions: { day: 0, night: 0 },
    grandTotalWage: 0,
    grandTotalExpense: 0,
    staffList: [],
    absenceStatusFrequency: []
  });

  useEffect(() => {
    const { staffTotals, absenceStatusFrequency } = processShiftData(shifts, startDate, endDate, staffData);
    const expenseTotals = processExpenseData(expenses, startDate, endDate);

    const wageChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
      staffID,
      fullName: data.fullName,
      totalWage: parseFloat(data.totalWage.toFixed(2))
    }));

    const hoursChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
      staffID,
      fullName: data.fullName,
      totalHours: parseFloat(data.totalHours.toFixed(2))
    }));

    const absenceChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
      staffID,
      fullName: data.fullName,
      yes: data.absenceYes,
      no: data.absenceNo
    }));

    const expenseChartData = Object.entries(expenseTotals).map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2))
    }));

    const totalShifts = Object.values(staffTotals).reduce((sum, data) => sum + data.dayShifts + data.nightShifts, 0);
    const dayShiftProportion = totalShifts > 0 ? 
      (Object.values(staffTotals).reduce((sum, data) => sum + data.dayShifts, 0) / totalShifts) * 100 : 0;

    const grandTotalWage = Object.values(staffTotals).reduce((sum, data) => sum + data.totalWage, 0);
    const grandTotalExpense = Object.values(expenseTotals).reduce((sum, total) => sum + total, 0);

    const staffList = staffData
      .sort((a, b) => a.staffID.localeCompare(b.staffID))
      .map(staff => ({ staffID: staff.staffID, fullName: staff.fullName }));

    // Transform absenceStatusFrequency into an array of objects
    const absenceStatusData = Object.entries(absenceStatusFrequency).map(([status, frequency]) => ({
      status,
      frequency
    }));

    setDashboardData({
      wageData: wageChartData,
      hoursData: hoursChartData,
      absenceData: absenceChartData,
      expenseData: expenseChartData,
      shiftProportions: { day: dayShiftProportion, night: 100 - dayShiftProportion },
      grandTotalWage: parseFloat(grandTotalWage.toFixed(2)),
      grandTotalExpense: parseFloat(grandTotalExpense.toFixed(2)),
      staffList,
      absenceStatusFrequency: absenceStatusData
    });
  }, [shifts, expenses, staffData, startDate, endDate]);

  return { ...dashboardData, startDate, endDate, handleDateRangeChange, handleShortcutRange };
};

export default useDashboardData;





























// import { useState, useEffect, useCallback } from 'react';
// import dayjs from 'dayjs';


// const useDateRangePicker = () => {
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
  
//     const handleDateRangeChange = useCallback((start, end) => {
//       setStartDate(start);
//       setEndDate(end);
//     }, []);
  
//     const handleShortcutRange = useCallback((range) => {
//         const today = dayjs();
//         switch (range) {
//           case 'This Week':
//             handleDateRangeChange(today.startOf('week'), today.endOf('week'));
//             break;
//           case 'Last Week': {
//             const lastWeek = today.subtract(1, 'week');
//             handleDateRangeChange(lastWeek.startOf('week'), lastWeek.endOf('week'));
//             break;
//           }
//           case 'This Month':
//             handleDateRangeChange(today.startOf('month'), today.endOf('month'));
//             break;
//           case 'Last Month': {
//             const lastMonth = today.subtract(1, 'month');
//             handleDateRangeChange(lastMonth.startOf('month'), lastMonth.endOf('month'));
//             break;
//           }
//           case 'Reset':
//             handleDateRangeChange(null, null);
//             break;
//           default:
//             break;
//         }
//       }, [handleDateRangeChange]);
      
  
//     return {
//       startDate,
//       endDate,
//       handleDateRangeChange,
//       handleShortcutRange
//     };
//   };

// // Function to process shift data
// const processShiftData = (shifts, startDate, endDate, staffData) => {
//   const filteredShifts = shifts.filter(shift => {
//     const shiftDate = dayjs(shift.startDate);
//     return (!startDate || shiftDate.isAfter(startDate) || shiftDate.isSame(startDate, 'day')) &&
//            (!endDate || shiftDate.isBefore(endDate) || shiftDate.isSame(endDate, 'day'));
//   });

//   const staffTotals = {};
//   filteredShifts.forEach(shift => {
//     if (!staffTotals[shift.staffID]) {
//       staffTotals[shift.staffID] = { 
//         totalWage: 0, 
//         totalHours: 0, 
//         absenceYes: 0, 
//         absenceNo: 0,
//         dayShifts: 0,
//         nightShifts: 0
//       };
//     }
//     staffTotals[shift.staffID].totalWage += shift.Total_Wage;
//     staffTotals[shift.staffID].totalHours += shift.Total_Hours;
//     staffTotals[shift.staffID].absenceYes += shift.Absence.toLowerCase() === "yes" ? 1 : 0;
//     staffTotals[shift.staffID].absenceNo += shift.Absence.toLowerCase() === "no" ? 1 : 0;
//     staffTotals[shift.staffID].dayShifts += shift.Shift.toLowerCase() === "day" ? 1 : 0;
//     staffTotals[shift.staffID].nightShifts += shift.Shift.toLowerCase() === "night" ? 1 : 0;
//   });

//   // Add full names to staffTotals
//   Object.keys(staffTotals).forEach(staffID => {
//     const staff = staffData.find(s => s.staffID === staffID);
//     if (staff) {
//       staffTotals[staffID].fullName = staff.fullName;
//     }
//   });

//   return staffTotals;
// };

// // Function to process expense data
// const processExpenseData = (expenses, startDate, endDate) => {
//   const filteredExpenses = expenses.filter(expense => {
//     const expenseDate = dayjs(expense.date);
//     return (!startDate || expenseDate.isAfter(startDate) || expenseDate.isSame(startDate, 'day')) &&
//            (!endDate || expenseDate.isBefore(endDate) || expenseDate.isSame(endDate, 'day'));
//   });

//   const expenseTotals = {};
//   filteredExpenses.forEach(expense => {
//     Object.keys(expense).forEach(key => {
//       if (key !== 'date' && key !== 'expenseID') {
//         if (!expenseTotals[key]) expenseTotals[key] = 0;
//         expenseTotals[key] += expense[key];
//       }
//     });
//   });

//   return expenseTotals;
// };

// // Updated useDashboardData hook
// const useDashboardData = (shifts, expenses, staffData) => {
//     const {
//       startDate,
//       endDate,
//       handleDateRangeChange,
//       handleShortcutRange
//     } = useDateRangePicker();
  
//     const [wageData, setWageData] = useState([]);
//     const [hoursData, setHoursData] = useState([]);
//     const [absenceData, setAbsenceData] = useState([]);
//     const [expenseData, setExpenseData] = useState([]);
//     const [shiftProportions, setShiftProportions] = useState({ day: 0, night: 0 });
//     const [grandTotalWage, setGrandTotalWage] = useState(0);
//     const [grandTotalExpense, setGrandTotalExpense] = useState(0);
//     const [staffList, setStaffList] = useState([]);

//     useEffect(() => {
//         const staffTotals = processShiftData(shifts, startDate, endDate, staffData);
//         const expenseTotals = processExpenseData(expenses, startDate, endDate);

//     // Prepare data for charts
//     const wageChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
//       staffID,
//       fullName: data.fullName,
//       totalWage: data.totalWage.toFixed(1)
//     }));

//     const hoursChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
//       staffID,
//       fullName: data.fullName,
//       totalHours: data.totalHours.toFixed(1)
//     }));

//     const absenceChartData = Object.entries(staffTotals).map(([staffID, data]) => ({
//       staffID,
//       fullName: data.fullName,
//       yes: data.absenceYes,
//       no: data.absenceNo
//     }));

//     const expenseChartData = Object.entries(expenseTotals).map(([category, total]) => ({
//       category,
//       total
//     }));

//     // Calculate shift proportions
//     const totalDayShifts = Object.values(staffTotals).reduce((sum, data) => sum + data.dayShifts, 0);
//     const totalNightShifts = Object.values(staffTotals).reduce((sum, data) => sum + data.nightShifts, 0);
//     const totalShifts = totalDayShifts + totalNightShifts;

//     // Calculate grand totals
//     const totalWage = Object.values(staffTotals).reduce((sum, data) => sum + data.totalWage, 0);
//     const totalExpense = Object.values(expenseTotals).reduce((sum, total) => sum + total, 0);

//     // Sort staff data by staffID in ascending order
//     const sortedStaffData = staffData.sort((a, b) => {
//       if (a.staffID < b.staffID) {
//         return -1;
//       }
//       if (a.staffID > b.staffID) {
//         return 1;
//       }
//       return 0;
//     });

//     // Prepare staff list
//     const staffListData = sortedStaffData.map(staff => ({
//       staffID: staff.staffID,
//       fullName: staff.fullName
//     }));

//     // Update state
//     setWageData(wageChartData);
//     setHoursData(hoursChartData);
//     setAbsenceData(absenceChartData);
//     setExpenseData(expenseChartData);
//     setShiftProportions({
//       day: totalShifts > 0 ? (totalDayShifts / totalShifts) * 100 : 0,
//       night: totalShifts > 0 ? (totalNightShifts / totalShifts) * 100 : 0
//     });
//     setGrandTotalWage(totalWage);
//     setGrandTotalExpense(totalExpense);
//     setStaffList(staffListData);
// }, [shifts, expenses, staffData, startDate, endDate]);


// return {
//     wageData,
//     hoursData,
//     absenceData,
//     expenseData,
//     shiftProportions,
//     grandTotalWage,
//     grandTotalExpense,
//     staffList,
//     startDate,
//     endDate,
//     handleDateRangeChange,
//     handleShortcutRange
//   };
// };

// export default useDashboardData;









// import { useState, useEffect, useCallback } from 'react';
// import dayjs from 'dayjs';

// // ... (previous code from useDashboardData remains the same)

// const useDateRangePicker = () => {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const handleDateRangeChange = useCallback((start, end) => {
//     setStartDate(start);
//     setEndDate(end);
//   }, []);

//   const handleShortcutRange = useCallback((range) => {
//     const today = dayjs();
//     switch (range) {
//       case 'This Week':
//         handleDateRangeChange(today.startOf('week'), today.endOf('week'));
//         break;
//       case 'Last Week':
//         const lastWeek = today.subtract(1, 'week');
//         handleDateRangeChange(lastWeek.startOf('week'), lastWeek.endOf('week'));
//         break;
//       case 'This Month':
//         handleDateRangeChange(today.startOf('month'), today.endOf('month'));
//         break;
//       case 'Last Month':
//         const lastMonth = today.subtract(1, 'month');
//         handleDateRangeChange(lastMonth.startOf('month'), lastMonth.endOf('month'));
//         break;
//       case 'Reset':
//         handleDateRangeChange(null, null);
//         break;
//       default:
//         break;
//     }
//   }, [handleDateRangeChange]);

//   return {
//     startDate,
//     endDate,
//     handleDateRangeChange,
//     handleShortcutRange
//   };
// };

// // Updated useDashboardData hook
// const useDashboardData = (shifts, expenses, staffData) => {
//   const {
//     startDate,
//     endDate,
//     handleDateRangeChange,
//     handleShortcutRange
//   } = useDateRangePicker();

//   const [wageData, setWageData] = useState([]);
//   const [hoursData, setHoursData] = useState([]);
//   const [absenceData, setAbsenceData] = useState([]);
//   const [expenseData, setExpenseData] = useState([]);
//   const [shiftProportions, setShiftProportions] = useState({ day: 0, night: 0 });
//   const [grandTotalWage, setGrandTotalWage] = useState(0);
//   const [grandTotalExpense, setGrandTotalExpense] = useState(0);
//   const [staffList, setStaffList] = useState([]);

//   useEffect(() => {
//     const staffTotals = processShiftData(shifts, startDate, endDate, staffData);
//     const expenseTotals = processExpenseData(expenses, startDate, endDate);

//     // ... (rest of the data processing code remains the same)

//   }, [shifts, expenses, staffData, startDate, endDate]);

//   return {
//     wageData,
//     hoursData,
//     absenceData,
//     expenseData,
//     shiftProportions,
//     grandTotalWage,
//     grandTotalExpense,
//     staffList,
//     startDate,
//     endDate,
//     handleDateRangeChange,
//     handleShortcutRange
//   };
// };

// export default useDashboardData;