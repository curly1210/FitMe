/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, notification } from "antd";
import login from "../../assets/images/login.png";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import ModalRegister from "./ModalRegister";
import { useModal } from "../../hooks/useModal";
import { useCreate } from "@refinedev/core";
import { useAuthen } from "../../hooks/useAuthen";
import { useLocation, useNavigate } from "react-router";
import { usePopupMessage } from "../../hooks/usePopupMessage";
import ModalForgotPass from "./ModalForgotPassword";
import { useState } from "react";

const ModalLogin = () => {
  const [showResend, setShowResend] = useState(false);
  const [emailForResend, setEmailForResend] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();
  const { notify } = usePopupMessage();
  const { setAccessToken, setUser, channelAuth } = useAuthen();
  // const navigate = useNavigate();
  const navi = useNavigate();
  const location = useLocation();

  const { mutate: mutateResendEmail, isPending: isLoadingResendEmail } =
    useCreate({
      resource: "resend-verification-email",
      values: { email: emailForResend },
      mutationOptions: {
        onSuccess: (response) => {
          setShowResend(false);
          notification.success({
            message:
              "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.",
          });
        },
        onError: (error) => {
          notification.success({
            message: "Có lỗi xảy ra",
          });
        },
      },
    });

  const { mutate: mutateLogin, isPending: isLoadingLogin } = useCreate({
    resource: "login",
    mutationOptions: {
      onSuccess: (response) => {
        // console.log(response?.data?.data?.user?.name);
        channelAuth.postMessage({
          type: "login",
          payload: {
            user: response?.data?.data?.user,
            accessToken: response?.data?.data?.access_token,
          },
        });
        setUser(response?.data?.data?.user);
        setAccessToken(response?.data?.data?.access_token);
        notify("success", "Đăng nhập", "Thành công");
        localStorage.setItem("persist", JSON.stringify(true));
        // if (response?.data?.data?.user?.role === "Admin") {
        //   navi("/admin");
        //   closeModal();
        //   return;
        // }
        // console.log(response?.data?.data?.user);
        navi(location.pathname);
        closeModal();
        // openPopup(<ModalLogin />);
      },
      onError: (error) => {
        if (error?.status === 400) {
          setShowResend(true);
          setEmailForResend(error?.response?.data?.errors["email"] || null);
        }
        notify("error", "Đăng nhập", error?.response?.data?.message);
      },
    },
  });

  const onFinish = (values: any) => {
    // const { confirmPassword, ...userData } = values;
    mutateLogin({ values: values });
    // console.log(userData);
    // console.log(confirmPassword);
  };

  return (
    // <Spin spinning={isLoading}>
    <div className="w-4xl z-30 relative grid grid-cols-2 bg-white py-10 px-10 gap-x-[40px] items-center">
      <button
        onClick={closeModal}
        className="absolute cursor-pointer top-5 right-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-black transition"
      >
        ×
      </button>
      <div>
        <img src={login} height={200} alt="" />
      </div>
      <div>
        <div className="pb-6 mb-6 border-b border-b-gray-200">
          <p className="text-3xl font-semibold text-center mb-2">Đăng nhập</p>
          <p className="text-sm text-[#4B5563] text-center">
            Chào mừng tới FitMe
          </p>
        </div>
        <div className="relative">
          <Form className="!mb-4" onFinish={onFinish} layout="vertical">
            <Form.Item
              label={
                <span>
                  Email<span className="text-red-500 ml-1">*</span>
                </span>
              }
              required={false}
              name="email"
              rules={[{ required: true }]}
              className="!mb-5"
            >
              <Input
                placeholder="Nhập email"
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Mật khẩu<span className="text-red-500 ml-1">*</span>
                </span>
              }
              required={false}
              rules={[{ required: true }]}
              name="password"
              className="!mb-0"
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>
            <div className="flex justify-between items-center">
              <div>
                {showResend && (
                  <div className=" ">
                    <Button
                      loading={isLoadingResendEmail}
                      type="link"
                      className="text-blue-600 underline !p-0"
                      onClick={() => mutateResendEmail()}
                    >
                      Gửi lại email xác thực
                    </Button>
                  </div>
                )}
              </div>
              <p className=" font-semibold underline my-4 cursor-pointer">
                <span onClick={() => openModal(<ModalForgotPass />)}>
                  Quên mật khẩu
                </span>
              </p>
            </div>
            <Button
              loading={isLoadingLogin}
              className="w-full !bg-[#22689B] !text-base !py-5 !rounded-3xl"
              type="primary"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form>

          <p className="text-sm text-gray-700 text-center">
            Bạn chưa có tài khoản?{" "}
            <span
              onClick={() => openModal(<ModalRegister />)}
              className="text-black underline cursor-pointer hover:text-blue-800"
            >
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
    // </Spin>
  );
};
export default ModalLogin;
