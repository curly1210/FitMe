import { Drawer, Space, Button, Input, Form, message } from "antd";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { useOne, useUpdate } from "@refinedev/core";

interface EditProps {
  open: boolean;
  onClose: () => void;
  type: "color" | "size" | null;
  id?: string | number | null;
}

export default function Edit({ open, onClose, type, id }: EditProps) {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#1890ff");

  const resource = type === "color" ? "colors" : "sizes";

  const { data, isLoading } = useOne({
    resource,
    id: id ?? "",
    queryOptions: {
      enabled: !!id && !!type,
    },
  });

  const { mutate: update } = useUpdate();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({ name: data.data.name });
      if (type === "color" && data.data.code) {
        setColor(data.data.code);
      }
    }
  }, [data, form, type]);

  const onFinish = (values: any) => {
    update(
      {
        resource,
        id: id!,
        values: type === "color" ? { ...values, code: color } : values,
      },
      {
        onSuccess: () => {
          message.success(`Sửa ${type === "color" ? "màu" : "kích thước"} thành công`);
          onClose();
        },
        onError: () => {
          message.error(`Sửa ${type === "color" ? "màu" : "kích thước"} thất bại`);
        },
      }
    );
  };

  return (
    <Drawer
      title={type === "color" ? "Sửa màu sắc" : "Sửa kích thước"}
      placement="right"
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={onClose}>Huỷ</Button>
            <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
              Sửa biến thể
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
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
