import { Drawer, Space, Button, Input, Form, message } from "antd";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { useCreate } from "@refinedev/core";
import { useNavigate } from "react-router";

interface AddDrawerProps {
  open: boolean;
  onClose: () => void;
  type: "color" | "size" | null;
}

export default function Add({ open, onClose, type }: AddDrawerProps) {
  const nav= useNavigate()
  const [form] = Form.useForm();
  const [color, setColor] = useState("#1890ff");

  const { mutate: create } = useCreate();

  const onFinish = (values: any) => {
    const resource = type === "color" ? "colors" : "sizes";

    create(
      {
        resource,
        values: type === "color" ? { ...values, code: color } : values,
      },
      {
        onSuccess: () => {
          message.success(`Thêm ${type === "color" ? "màu" : "kích thước"} thành công`);
          
            onClose();
           
          
        },
        onError: () => {
          message.error(`Thêm ${type === "color" ? "màu" : "kích thước"} thất bại`);
        },
      }
    );
  };

  return (
    <Drawer
      title={type === "color" ? "Thêm màu sắc" : "Thêm kích thước"}
      placement="right"
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button htmlType="button"  onClick={onClose}>Huỷ</Button>
            <Button htmlType="button"  type="primary" onClick={() => form.submit()}>
              Thêm mới biến thể
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} onFinish={onFinish} layout="vertical" onSubmitCapture={(e) => e.preventDefault()}>
        {type === "color" && (
          <>
            <Form.Item label="Tên màu" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Mã màu">
              <ChromePicker color={color} onChange={(c) => setColor(c.hex)} />
            </Form.Item>
          </>
        )}

        {type === "size" && (
          <Form.Item label="Kích thước" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
