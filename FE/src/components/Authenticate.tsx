import { Navigate, Outlet } from "react-router";

const Authenticate = () => {
  const isAuthenticated = false;
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />;
};
export default Authenticate;
