import { useOne } from "@refinedev/core";
import {
  Button,
  Drawer,
  Input,
  DatePicker,
  Select,
  Table,
  Form,
  Spin,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

const { Option } = Select;

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
}

interface DetailProps {
  open: boolean;
  onClose: () => void;
  record: User | null;
}

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
      width={720}
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
              <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
              <Form layout="vertical" form={form}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label="Tên người dùng" name="name">
                    <Input  />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input  />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input  />
                  </Form.Item>
                  <Form.Item label="Ngày sinh" name="birthday">
                    <DatePicker className="w-full"  />
                  </Form.Item>
                  <Form.Item label="Trạng thái hoạt động" name="is_ban">
                     <span style={{ color: user.is_ban === 0 ? "green" : "red" }}>
                      {user.is_ban === 0 ? "Hoạt động" : "Khóa"}
                      </span>
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
