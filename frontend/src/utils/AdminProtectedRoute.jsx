import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userTokenValidity from "./UserTokenValidity";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const AdminProtectedRoute = () => {
  const { token, user } = useSelector((state) => state?.auth);
  const isValidToken = userTokenValidity();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      toast.success("You're logged out!");
    } else if (!isValidToken) {
      dispatch(logoutUser());
      toast.error("Session Expired!");
    } else if (user.role !== "admin") {
      toast.error("You are not authorized to use this feature!");
    }
  }, [isValidToken]);

  if (!isValidToken) {
    return <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={`/`} replace />;
  }

  return <Outlet />;
};
export default AdminProtectedRoute;
