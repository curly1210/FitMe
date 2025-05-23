import { Navigate, Outlet } from "react-router";

const Authenticate = () => {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />;
};
export default Authenticate;
