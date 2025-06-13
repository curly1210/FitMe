import React from "react";
import {
  Button,
  Drawer,
  Input,
  InputNumber,
  DatePicker,
  notification,
  Form,
  // Switch, // ❌ Nếu bạn cần hiển thị lại thì bỏ comment
} from "antd";
import { useCreate } from "@refinedev/core";

interface AddCouponProps {
  visible: boolean;
  onClose: () => void;
}

const AddCoupon: React.FC<AddCouponProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: createCoupon } = useCreate();

  const handleAdd = (values: any) => {
    createCoupon(
      {
        resource: "admin/coupons",
        values: {
          name: values.name,
          code: values.code,
          value: values.value,
          time_start: values.time_start?.format("YYYY-MM-DD"),
          time_end: values.time_end?.format("YYYY-MM-DD") || null,
          min_price_order: values.min_price_order,
          max_price_discount: values.max_price_discount,
          limit_use: values.limit_use,
          is_active: 1, // ✅ Mặc định là đang hoạt động
        },
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Thêm mới thành công",
            description: `Chương trình khuyến mãi "${values.name}" đã được thêm thành công.`,
          });
          form.resetFields();
          onClose();
        },
        onError: (error: any) => {
          const response = error?.response?.data;

          if (response?.errors) {
            const fieldErrors = Object.entries(response.errors).map(
              ([field, messages]) => ({
                name: field,
                errors: Array.isArray(messages) ? messages : [messages],
              })
            );
            form.setFields(fieldErrors);
          }

          notification.error({
            message: "Lỗi khi thêm chương trình khuyến mãi",
            description: response?.message || "Dữ liệu không hợp lệ!",
          });
        },
      }
    );
  };

  return (
    <Drawer
      title="Thêm chương trình khuyến mãi"
      width={400}
      onClose={onClose}
      open={visible}
      destroyOnClose
    >
      <Form form={form} onFinish={handleAdd} layout="vertical">
        <Form.Item
          label="Tên chương trình"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên chương trình!" }]}
        >
          <Input placeholder="Nhập tên chương trình" />
        </Form.Item>

        <Form.Item
          label="Mã khuyến mãi"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
        >
          <Input placeholder="Nhập mã khuyến mãi" />
        </Form.Item>

        <Form.Item
          label="Giá trị (%)"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập giá trị khuyến mãi!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={100}
            placeholder="Nhập giá trị (%)"
          />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="time_start"
          rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>

        <Form.Item label="Thời gian kết thúc" name="time_end">
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày kết thúc (có thể bỏ trống)"
          />
        </Form.Item>

        <Form.Item
          label="Giá tối thiểu áp mã (VND)"
          name="min_price_order"
          rules={[{ required: true, message: "Vui lòng nhập số tiền tối thiểu!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập số tiền tối thiểu (VND)"
          />
        </Form.Item>

        <Form.Item
          label="Giảm giá tối đa (VND)"
          name="max_price_discount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền tối đa!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập số tiền tối đa (VND)"
          />
        </Form.Item>

        <Form.Item
          label="Số lần sử dụng"
          name="limit_use"
          rules={[{ required: true, message: "Vui lòng nhập số lần sử dụng!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập số lần sử dụng"
          />
        </Form.Item>

        {/* 
        <Form.Item label="Trạng thái" name="is_active" valuePropName="checked">
          <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Tạm ngừng" />
        </Form.Item>
        */}

        <div className="mt-4">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Đóng
          </Button>
          <Button type="primary" htmlType="submit">
            Thêm chương trình khuyến mãi
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddCoupon;
