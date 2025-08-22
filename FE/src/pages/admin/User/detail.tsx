/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOne } from "@refinedev/core";
import {
  Button,
  Drawer,
  Input,
  DatePicker,
  Table,
  Form,
  Spin,
  Tag,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { formatCurrencyVND } from "../../../utils/currencyUtils";

interface Order {
  orders_code: string;
  total_amount: number;
  payment_method: string;
  status_payment: number;
  recipient_name: string;
  recipient_phone: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  is_ban: number;
  gender?: string;
  orders?: Order[];
  member_points: any;
}

interface DetailProps {
  open: boolean;
  onClose: () => void;
  record: User | null;
}

const rankLabels = {
  bronze: {
    name: "ĐỒNG",
    color: "from-[#cd7f32] to-[#a97142]",
  },
  silver: {
    name: "BẠC",
    color: "from-gray-300 to-gray-500",
  },
  gold: {
    name: "VÀNG",
    color: "from-[#FFD700] to-[#FFC107]",
  },
  diamond: {
    name: "KIM CƯƠNG",
    color: "from-cyan-300 to-blue-600",
  },

  // diamond: "Kim cương",
};

export default function Detail({ open, onClose, record }: DetailProps) {
  const [form] = Form.useForm();
  // lấy thông tin và đơn hàng
  const { data, isLoading } = useOne<User>({
    resource: "admin/users",
    id: record?.id || "",
    queryOptions: {
      enabled: !!record?.id,
    },
  });

  const user = data?.data;
  const orders = user?.orders || [];
  // chuyển dữ liệu ngày sinh
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });
    }
  }, [user, form]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orders_code",
      key: "orders_code",
    },
    {
      title: "Người nhận",
      dataIndex: "recipient_name",
      key: "recipient_name",
    },
    {
      title: "SĐT người nhận",
      dataIndex: "recipient_phone",
      key: "recipient_phone",
    },

    {
      title: "Phương thức",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "status_payment",
      key: "status_payment",
      render: (val: number) =>
        val === 0 ? (
          <span style={{ color: "red" }}>Chưa thanh toán</span>
        ) : (
          <span style={{ color: "green" }}>Đã thanh toán</span>
        ),
    },

    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value: number) =>
        value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
  ];

  return (
    <Drawer
      title="Chi tiết người dùng"
      placement="right"
      width={1000}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {isLoading ? (
        <Spin />
      ) : (
        user && (
          <>
            {/* Thông tin chung */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-semibold ">Thông tin chung</h2>
                <p
                  className={`text-xs bg-gradient-to-r py-1 px-3 rounded-[5px]  ${
                    rankLabels[
                      (user?.member_points?.rank as keyof typeof rankLabels) ??
                        "bronze"
                    ].color
                  } text-white`}
                >
                  Hạng tài khoản:{" "}
                  {
                    rankLabels[
                      (user?.member_points?.rank as keyof typeof rankLabels) ??
                        "bronze"
                    ].name
                  }
                </p>
              </div>
              <Form layout="vertical" form={form}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label="Tên người dùng" name="name">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" name="birthday">
                    <DatePicker className="w-full" disabled />
                  </Form.Item>
                  <Form.Item label="Trạng thái hoạt động" name="is_ban">
                    <span
                      className="font-semibold"
                      style={{ color: user.is_ban === 0 ? "green" : "red" }}
                    >
                      {user.is_ban === 0 ? "Hoạt động" : "Khóa"}
                    </span>
                  </Form.Item>
                  <Form.Item label="Chi tiêu" name="is_ban">
                    <Tag color="red" className="!text-xl font-bold">
                      {formatCurrencyVND(user?.member_points?.point * 10000)}
                    </Tag>
                    {/* <span
                      style={{ color: user.is_ban === 0 ? "green" : "red" }}
                    >
                      {user.is_ban === 0 ? "Hoạt động" : "Khóa"}
                    </span> */}
                  </Form.Item>
                </div>
              </Form>
            </div>

            {/* Đơn hàng */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Đơn hàng của khách</h2>
              </div>
              <Table
                columns={columns}
                dataSource={orders}
                pagination={false}
                rowKey="orders_code"
              />
            </div>

            {/* Footer */}
            <div className="text-right">
              <Button onClick={onClose} className="mr-2">
                Đóng
              </Button>
            </div>
          </>
        )
      )}
    </Drawer>
  );
}
