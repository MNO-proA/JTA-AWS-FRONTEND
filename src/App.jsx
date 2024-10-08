import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme.js";
// import PWABadge from './PWABadge.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
// import Layout from "./Pages/layout/index.jsx";
import Login from "./Pages/login/index.jsx";
import RequireAuth from "./Pages/login/RequireAuth.jsx";
import Layout from "./Pages/layout/index.jsx";
import Overview from "./Pages/home/index.jsx";
import Shifts from "./Pages/shifts/index.jsx";
import Expenses from "./Pages/expenses/index.jsx";
import AllDashboard from "./Pages/dashboard/index.jsx";
import CacheLoader from "./Pages/home/CacheLoader.js"
import AbsentReadOnly from "./Pages/Absent/index.jsx";
import Permission from "./Pages/permission/index.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route path="Overview" element={<Overview />} loader={CacheLoader} />
        <Route path="Shifts" element={<Shifts />} />
        <Route path="Expense" element={<Expenses />} />
        <Route path="Dashboard" element={<AllDashboard/>} />
        <Route path="Absence" element={<AbsentReadOnly/>} />
        <Route path="Permit-error" element={<Permission/>} />
      </Route>
       
      </Route> 
    </>
  )
);
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />;
        </ThemeProvider>
    </div>
  )
}
{/* <PWABadge /> */}
export default App
