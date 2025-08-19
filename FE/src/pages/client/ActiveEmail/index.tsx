/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreate } from "@refinedev/core";
import { notification, Spin } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const ActiveEmail = () => {
  const location = useLocation();
  const navigation = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  console.log(token);

  const { mutate: mutateVefifyToken, isPending } = useCreate();

  useEffect(() => {
    if (token) {
      mutateVefifyToken(
        { resource: "activate-account", values: { token: token } },
        {
          onSuccess: (response) => {
            notification.success({
              message: "Tài khoản của bạn đã được kích hoạt",
            });
            navigation("/", { replace: true });
          },
          onError: (err) => {
            notification.error({
              message: "Liên kết không hợp lệ hoặc đã hết hạn",
            });
            navigation("/", { replace: true });
          },
        }
      );
    }
  }, [token]);

  return (
    <div>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/100">
        <Spin size="large" />
      </div>
    </div>
  );
};
export default ActiveEmail;
