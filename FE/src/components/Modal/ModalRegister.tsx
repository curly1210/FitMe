/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from "antd";
import login from "../../../public/login.png";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useModalContext } from "../../context/ModalProvider";
import { useCreate } from "@refinedev/core";
import ModalLogin from "./ModalLogin";
import { usePopup } from "../../context/PopupMessageProvider";

const ModalRegister = () => {
  const { closePopup, openPopup } = useModalContext();

  const { notify } = usePopup();

  const { mutate } = useCreate({
    resource: "register",
    mutationOptions: {
      onSuccess: (response) => {
        notify("success", "Đăng ký", response?.data?.message);
        openPopup(<ModalLogin />);
      },
      onError: (error) => {
        console.log(error);
        notify("error", "Đăng ký", error.message);
      },
    },
  });

  const onFinish = (values: any) => {
    const { confirmPassword, ...userData } = values;
    mutate({ values: userData });
    // console.log(userData);
    // console.log(confirmPassword);
  };

  const validateConfirmPassword = (getFieldValue: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
    },
  });

  return (
    <div className="w-4xl relative grid grid-cols-2 bg-white py-10 px-10 gap-x-[40px] items-center">
      <button
        onClick={closePopup}
        className="absolute cursor-pointer top-5 right-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-black transition"
      >
        ×
      </button>
      <div>
        <img src={login} height={200} alt="" />
      </div>
      <div>
        <div className=" mb-5 border-b border-b-gray-200">
          <p className="text-3xl font-semibold text-center mb-2">
            Đăng ký tài khoản
          </p>
        </div>
        <div>
          <Form onFinish={onFinish} layout="vertical">
            <div className="grid grid-cols-2 gap-x-2">
              <Form.Item
                label={
                  <span>
                    Email<span className="text-red-500 ml-1">*</span>
                  </span>
                }
                required={false}
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { required: true, message: "Vui lòng nhập email!" },
                ]}
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
                    Số điện thoại<span className="text-red-500 ml-1">*</span>
                  </span>
                }
                required={false}
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message: "Nhập đúng định dạng số điện thoại",
                  },
                ]}
                className="!mb-5"
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span>
                  Họ và tên<span className="text-red-500 ml-1">*</span>
                </span>
              }
              required={false}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên!",
                },
                {
                  min: 3,
                  message: "Tên phải có ít nhất 3 ký tự!",
                },
              ]}
              name="name"
            >
              <Input
                placeholder="Nhập họ tên"
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Mật khẩu<span className="text-red-500 ml-1">*</span>
                </span>
              }
              required={false}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
                {
                  min: 3,
                  message: "Tên phải có ít nhất 3 ký tự!",
                },
              ]}
              name="password"
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Nhập lại mật khẩu<span className="text-red-500 ml-1">*</span>
                </span>
              }
              required={false}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                ({ getFieldValue }) => validateConfirmPassword(getFieldValue),
              ]}
              name="confirmPassword"
              className="!mb-0"
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <p className="text-right font-semibold underline my-4">
              Quên mật khẩu
            </p>
            <Button
              className="w-full !bg-[#22689B] !text-base !py-5 !rounded-3xl"
              type="primary"
              htmlType="submit"
            >
              Đăng ký
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
        </div>
      </div>
    </div>
  );
};
export default ModalRegister;
