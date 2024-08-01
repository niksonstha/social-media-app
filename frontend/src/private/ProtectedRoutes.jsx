import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateUser = () => {
    const cookie = Cookies.get("uid");

    if (!cookie) {
      navigate("/login");
    }
  };
  useEffect(() => {
    validateUser();
  }, [validateUser]);
  return <Outlet />;
};

export default ProtectedRoute;
