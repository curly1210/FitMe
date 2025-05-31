/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Space, Button, Input, Form, message, Spin } from "antd";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { useCreate } from "@refinedev/core";

interface AddDrawerProps {
  open: boolean;
  onClose: () => void;
  type: "colo" | "sizee" | null;
}

export default function Add({ open, onClose, type }: AddDrawerProps) {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#1890ff");

  const { mutate: create, isLoading } = useCreate();

  const onFinish = (values: any) => {
    const resource =
      type === "colo" ? "admin/variations/color" : "admin/variations/size";

    create(
      {
        resource,
        values: type === "colo" ? { ...values, code: color } : values,
      },
      {
        onSuccess: () => {
          message.success(
            `Thêm ${type === "colo" ? "màu" : "kích thước"} thành công`
          );

          onClose();
        },
        onError: () => {
          message.error(
            `Thêm ${type === "colo" ? "màu" : "kích thước"} thất bại`
          );
        },
      }
    );
  };

  return (
    <Drawer
      title={type === "colo" ? "Thêm màu sắc" : "Thêm kích thước"}
      placement="right"
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button htmlType="button" onClick={onClose}>
              Huỷ
            </Button>
            <Button
              htmlType="button"
              type="primary"
              onClick={() => form.submit()}
            >
              Thêm mới biến thể
            </Button>
          </Space>
        </div>
      }
    >
      {isLoading ? (
        <Spin
          className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        ""
      )}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        onSubmitCapture={(e) => e.preventDefault()}
      >
        {type === "colo" && (
          <>
            <Form.Item
              label="Tên màu"
              name="name"
              rules={[{ required: true, message: "Tên không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mã màu">
              <ChromePicker color={color} onChange={(c) => setColor(c.hex)} />
            </Form.Item>
          </>
        )}

        {type === "sizee" && (
          <Form.Item
            label="Kích thước"
            name="name"
            rules={[
              { required: true, message: "Kích thước không được để trống" },
            ]}
          >
            <Input />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
