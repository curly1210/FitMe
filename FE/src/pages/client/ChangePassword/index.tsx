/* eslint-disable @typescript-eslint/no-explicit-any */
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { useAuthen } from "../../../hooks/useAuthen";
import { useUpdate } from "@refinedev/core";

const ChangePassword = () => {
  const { user, logout } = useAuthen();

  const { mutate: changePassword, isLoading } = useUpdate();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const validateConfirmPassword = (getFieldValue: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("new_password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
    },
  });

  const onFinish = (values: any) => {
    changePassword(
      {
        resource: "change-password",
        id: user?.id,
        values,
      },
      {
        onSuccess: (response) => {
          notification.success({ message: response?.data?.message });
          setTimeout(() => {
            logout();
          }, 500);
        },
        onError: (error) => {
          // console.log(error?.response?.data?.message);
          notification.error({ message: error?.response?.data?.message });
        },
      }
    );
  };

  return (
    <div>
      <h1 className="font-semibold mb-8 text-3xl">Đổi mật khẩu</h1>

      <Form {...formItemLayout} onFinish={onFinish} layout="horizontal">
        <Form.Item
          label={<span>Mật khẩu</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự!",
            },
          ]}
          name="old_password"
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
          />
        </Form.Item>
        <Form.Item
          label={<span>Mật khẩu mới</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu có ít nhất 6 ký tự!",
            },
          ]}
          name="new_password"
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
          />
        </Form.Item>
        <Form.Item
          label={<span>Nhập lại mật khẩu</span>}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            ({ getFieldValue }) => validateConfirmPassword(getFieldValue),
          ]}
          name="new_password_confirmation"
          className="!mb-0"
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            prefix={<LockOutlined className="text-gray-400 mr-2" />}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            loading={isLoading}
            className=" !bg-black !text-base !py-5 !rounded-none mt-5"
            type="primary"
            htmlType="submit"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ChangePassword;
