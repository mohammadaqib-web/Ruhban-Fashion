import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userTokenValidity from "../utils/UserTokenValidity";

const PublicRoute = () => {
  const isValidToken = userTokenValidity();
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const redirectPath = new URLSearchParams(location.search).get("redirect");

    if (redirectPath) setRedirectTo(redirectPath);
    else setRedirectTo("/");
  }, [location, navigate]);

  if (isValidToken && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
