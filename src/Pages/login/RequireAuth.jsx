import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectCurrentToken } from "../features/auth/authSlice"

const RequireAuth = () => {
    const token = true

return token ? (
    <>
    <Outlet />
    </>
    ) : (
    <Navigate to="/" />

);
};

export default RequireAuth;
