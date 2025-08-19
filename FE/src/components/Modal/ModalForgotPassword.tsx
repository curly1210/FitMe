/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from "antd";
import login from "../../assets/images/login.png";
import { MailOutlined } from "@ant-design/icons";
import { useModal } from "../../hooks/useModal";
import { useCreate } from "@refinedev/core";
import { usePopupMessage } from "../../hooks/usePopupMessage";
import ModalLogin from "./ModalLogin";

const ModalForgotPass = () => {
  const { closeModal, openModal } = useModal();
  const { notify } = usePopupMessage();

  // Gọi API /password/forgot
  const { mutate, isLoading } = useCreate({
    resource: "password/forgot",
    mutationOptions: {
      onSuccess: (response) => {
        notify(
          "success",
          "Quên mật khẩu",
          response?.data?.message ||
            "Vui lòng kiểm tra email để đặt lại mật khẩu"
        );
        closeModal();
      },
      onError: (error: any) => {
        notify(
          "error",
          "Quên mật khẩu",
          error?.response?.data?.message || "Gửi yêu cầu thất bại"
        );
      },
    },
  });

  const onFinish = (values: any) => {
    // values = { email: "..."}
    mutate({ values });
  };

  return (
    <div className="w-4xl z-30 relative grid grid-cols-2 bg-white py-10 px-10 gap-x-[40px] items-center">
      {/* Nút đóng */}
      <button
        onClick={closeModal}
        className="absolute cursor-pointer top-5 right-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-black transition"
      >
        ×
      </button>

      {/* Ảnh minh họa */}
      <div>
        <img src={login} height={200} alt="" />
      </div>

      {/* Form */}
      <div>
        <div className="pb-6 mb-6 border-b border-b-gray-200">
          <p className="text-3xl font-semibold text-center mb-2">
            Quên mật khẩu
          </p>
          <p className="text-sm text-[#4B5563] text-center">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
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
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              className="!mb-5"
            >
              <Input
                placeholder="Nhập email"
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <p className="text-right font-semibold underline my-3 cursor-pointer">
              <span onClick={() => openModal(<ModalLogin />)}>Đăng nhập</span>
            </p>

            <Button
              loading={isLoading}
              className="w-full !bg-[#22689B] !text-base !py-5 !rounded-3xl"
              type="primary"
              htmlType="submit"
            >
              Gửi
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalForgotPass;
