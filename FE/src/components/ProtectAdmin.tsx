import { Navigate, Outlet } from "react-router";
import { useAuthen } from "../hooks/useAuthen";

const ProtectAdmin = ({ role }: { role: string }) => {
  return <Outlet />;

  const { user } = useAuthen();
  return user?.role === role ? <Outlet /> : <Navigate to={"/"} replace />;
};
export default ProtectAdmin;
