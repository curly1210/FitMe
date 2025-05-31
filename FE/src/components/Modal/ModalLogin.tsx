/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from "antd";
import login from "../../../public/login.png";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import ModalRegister from "./ModalRegister";
import { useModal } from "../../hooks/useModal";
import { useCreate } from "@refinedev/core";
import { useAuthen } from "../../hooks/useAuthen";
import { useNavigate } from "react-router";
import { usePopupMessage } from "../../hooks/usePopupMessage";

const ModalLogin = () => {
  const { openModal, closeModal } = useModal();
  const { notify } = usePopupMessage();
  const { setAccessToken, setUser } = useAuthen();
  // const navigate = useNavigate();
  const navi = useNavigate();

  const { mutate, isLoading } = useCreate({
    resource: "login",
    mutationOptions: {
      onSuccess: (response) => {
        // console.log(response?.data?.data?.user?.name);
        setUser(response?.data?.data?.user);
        setAccessToken(response?.data?.data?.access_token);
        notify("success", "Đăng nhập", "Thành công");
        localStorage.setItem("persist", JSON.stringify(true));
        navi("/");
        closeModal();
        // openPopup(<ModalLogin />);
      },
      onError: (error) => {
        console.log(error);
        notify("error", "Đăng nhập", error.message);
      },
    },
  });

  const onFinish = (values: any) => {
    // const { confirmPassword, ...userData } = values;
    mutate({ values: values });
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
          <Form onFinish={onFinish} layout="vertical">
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

            <p className="text-right font-semibold underline my-4">
              Quên mật khẩu
            </p>
            <Button
              loading={isLoading}
              className="w-full !bg-[#22689B] !text-base !py-5 !rounded-3xl"
              type="primary"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form>
          <div className="flex items-center justify-center w-full my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex items-center mb-3 justify-center gap-2 border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700 font-medium">
              Đăng nhập với Google
            </span>
          </div>
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
