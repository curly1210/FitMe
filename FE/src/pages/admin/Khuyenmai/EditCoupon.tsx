import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  notification,
} from 'antd';
import { useUpdate } from '@refinedev/core';
import dayjs from 'dayjs';

interface EditCouponProps {
  visible: boolean;
  onClose: () => void;
  couponData: any;
  onSuccessEdit?: () => void;
}

const EditCoupon: React.FC<EditCouponProps> = ({
  visible,
  onClose,
  couponData,
  onSuccessEdit,
}) => {
  const [form] = Form.useForm();
  const { mutate: updateCoupon } = useUpdate();

  useEffect(() => {
    if (couponData) {
      form.setFieldsValue({
        name: couponData.name,
        code: couponData.code,
        value: couponData.value,
        time_start: dayjs(couponData.time_start),
        time_end: dayjs(couponData.time_end),
        min_price_order: couponData.min_price_order,
        max_price_discount: couponData.max_price_discount,
        limit_use: couponData.limit_use,
        is_active: !!couponData.is_active,
      });
    }
  }, [couponData, form]);

  const handleEdit = (values: any) => {
    updateCoupon(
      {
        resource: 'admin/coupons',
        id: couponData.id,
        values: {
          ...values,
          time_start: values.time_start.format('YYYY-MM-DD HH:mm:ss'),
          time_end: values.time_end.format('YYYY-MM-DD HH:mm:ss'),
          is_active: values.is_active ? 1 : 0,
        },
      },
      {
        onSuccess: () => {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Chương trình khuyến mãi đã được cập nhật.',
          });
          onClose();
          onSuccessEdit?.();
        },
        onError: (error: any) => {
          const res = error?.response?.data;

          if (res?.errors) {
            const fieldErrors = Object.entries(res.errors).map(
              ([field, messages]) => ({
                name: field,
                errors: Array.isArray(messages) ? messages : [messages],
              })
            );
            form.setFields(fieldErrors);
          }

          notification.error({
            message: 'Cập nhật thất bại',
            description: res?.message || 'Dữ liệu không hợp lệ!',
          });
        },
      }
    );
  };

  return (
    <Drawer
      title="Chỉnh sửa chương trình khuyến mãi"
      width={400}
      onClose={onClose}
      open={visible}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Đóng
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onFinish={handleEdit}
        layout="vertical"
        initialValues={{ is_active: true }}
      >
        <Form.Item
          label="Tên chương trình"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã khuyến mãi"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi!' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Giá trị (%)"
          name="value"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị khuyến mãi!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={100} disabled />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="time_start"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD"
            disabled
          />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="time_end"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="Số tiền tối thiểu (VND)"
          name="min_price_order"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền tối thiểu!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} disabled />
        </Form.Item>

        <Form.Item
          label="Số tiền tối đa (VND)"
          name="max_price_discount"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền tối đa!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} disabled />
        </Form.Item>

        <Form.Item
          label="Số lần sử dụng"
          name="limit_use"
          rules={[{ required: true, message: 'Vui lòng nhập số lần sử dụng!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditCoupon;
