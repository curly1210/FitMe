import React from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useCreate } from "@refinedev/core";

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const { mutate, isLoading } = useCreate();

  const handleSubmit = (values: any) => {
    mutate(
      {
        resource: "contact",
        values: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          title: values.title,
          content: values.content,
          is_read: false,
        },
      },
      {
        onSuccess: () => {
          message.success("Gửi liên hệ thành công!");
          form.resetFields();
        },
        onError: () => {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        },
      }
    );
  };

  return (
    <Spin spinning={isLoading} size="large">
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          {/* Tiêu đề */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi sớm nhất có
            thể.
          </p>

          {/* Form liên hệ */}
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input size="large" placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input size="large" placeholder="example@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { pattern: /^[0-9]+$/, message: "Số điện thoại chỉ chứa số" },
              ]}
            >
              <Input size="large" placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input size="large" placeholder="Nhập tiêu đề liên hệ..." />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={4} placeholder="Nhập nội dung liên hệ..." />
            </Form.Item>

            {/* Nút gửi */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full rounded-lg"
              >
                Gửi liên hệ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Contact;