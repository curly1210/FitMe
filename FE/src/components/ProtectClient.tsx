/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate, Outlet } from "react-router";
import { useAuthen } from "../hooks/useAuthen";

const ProtectClient = ({ role }: { role: string }) => {
  // return <Outlet />;
  const { user, accessToken } = useAuthen();
  return accessToken ? <Outlet /> : <Navigate to={"/"} replace />;
  // return user?.role === role ? <Outlet /> : <Navigate to={"/"} replace />;
};
export default ProtectClient;
