import { Navigate, Outlet } from "react-router";
import { useAuthen } from "../hooks/useAuthen";
import { ReactNode } from "react";

interface ProtectRoleProps {
  role: string;
  children?: ReactNode;
}

const ProtectRole = ({ role, children }: ProtectRoleProps) => {
  const { user, accessToken } = useAuthen();

  // 1. Chưa đăng nhập => về trang chủ
  if (!accessToken) {
    return <>{children || <Outlet />}</>;
  }

  // Nếu đăng nhập và role khớp => cho vào
  if (user?.role === role) {
    return <>{children || <Outlet />}</>;
  } else {
    return <Navigate to="/admin" replace />;
  }

  // Nếu đăng nhập và là admin => chuyển sang admin
  // if (user?.role === "admin") {
  //   return <Navigate to="/admin" replace />;
  // }
};
export default ProtectRole;
