import { Drawer, Spin, Table } from "antd";
import { useOne } from "@refinedev/core";
import React from "react";
import Oder from "./indext";

interface OrderDetail {
  image_product: string;
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  sale_price: number;
  sale_percent: number;
  subtotal: number;
}

interface Status{
 id: string;
 label:string;
 color:string;
}

interface OrderData {
  order_code: string;
  receiving_name: string;
  status: Status;
  created_at: string;
  receiving_address: string;
  recipient_phone: string;
  payment_method: string;
  customer_email: string;
  payment_status: string;
  total_price_item: number;
  shipping_price: number;
  discount: number;
  total_amount: number;
  order_details: OrderDetail[];
  note?: string;
}

interface OrderDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
}

export default function OrderDetailDrawer({
  open,
  onClose,
  orderId,
}: OrderDetailDrawerProps) {
  const { data, isLoading } = useOne<OrderData>({
    resource: "admin/orders",
    id: orderId || "",
    queryOptions: {
      enabled: !!orderId,
    },
  });

  const order = data?.data;
const paymentStatus = Number(order?.payment_status ?? 0);

const statusText: Record<number, string> = {
  0: "Chưa thanh toán",
  1: "Đã thanh toán",
  2: "Chờ hoàn tiền",
  3: "Đã hoàn tiền",
};

const statusColor =
  paymentStatus === 1 || paymentStatus === 3 ? "text-green-500" : "text-red-500";


  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Dãy chuyền",
      dataIndex: "product_name",
      key: "product_name",
      render: (_: any, record: OrderDetail) => (
        <div className="flex items-center gap-2">
          <img
            src={record.image_product}
            alt={record.product_name}
            className="w-10 h-10 object-cover rounded-md border"
          />
          <div className="text-sm">
            <div className="font-medium truncate w-[120px]">
              {record.product_name}
            </div>
            <div className="text-xs text-gray-500">
              {record.color}, {record.size}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  return (
    <Drawer
      title="Chi tiết đơn hàng"
      placement="right"
      width={800}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {isLoading || !order ? (
        <Spin />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Thông tin */}

       {/* Thông tin đơn hàng */}
        <div className="text-base font-semibold mb-2">Thông tin người nhận</div>
        <div className="grid grid-cols-4 gap-x-6 gap-y-4 text-sm  pb-4 mb-6">
        <div>
            <div className="text-gray-500">Mã đơn hàng</div>
            <div>{order.order_code}</div>
        </div>
        <div>
            <div className="text-gray-500">Khách hàng</div>
            <div>{order.receiving_name}</div>
        </div>
        <div>
            <div className="text-gray-500">Trạng thái</div>
            <div className=" font-medium" style={{color: order.status.color}}>{order.status.label}</div>
        </div>
        <div>
            <div className="text-gray-500">Ngày đặt hàng</div>
            <div>{order.created_at}</div>
        </div>
        <div className="col-span-2">
            <div className="text-gray-500">Địa chỉ nhận hàng</div>
            <div>{order.receiving_address}</div>
        </div>
        <div>
            <div className="text-gray-500">Số điện thoại</div>
            <div>{order.recipient_phone}</div>
        </div>
        <div>
            <div className="text-gray-500">Email</div>
            <div>{order.customer_email || "—"}</div>
        </div>
     
        <div>
            <div className="text-gray-500">Phương thức thanh toán</div>
            <div>{order.payment_method}</div>
        </div>
        <div>
      <div className="text-gray-500">Trạng thái thanh toán</div>
<div className={`font-medium ${statusColor}`}>
  {statusText[paymentStatus]}
</div>
        </div>
        </div>

            <div>
              <div className="text-gray-500">Phương thức thanh toán</div>
              <div>{order.payment_method}</div>
            </div>
            <div>
              <div className="text-gray-500">Trạng thái thanh toán</div>
              <div className=" font-medium">{order.payment_status}</div>
            </div>
          </div>

          {/* Dưới: sản phẩm & tổng tiền */}
          <div className="text-base font-semibold mb-2">
            Chi tiết thanh toán
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Bảng sản phẩm (2/3) */}
            <div className="col-span-2">
              <Table
                columns={columns}
                dataSource={order.order_details}
                rowKey={(_, index) => (index ?? 0).toString()}
                pagination={false}
                size="small"
              />
            </div>

            {/* Tổng kết (1/3) */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 h-52">
              <div className="text-base font-semibold mb-3">Tổng kết</div>
              <div className="flex justify-between mb-2 text-sm ">
                <span>Tổng tiền hàng</span>
                <span>
                  {order.total_price_item.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Phí vận chuyển</span>
                <span>{order.shipping_price.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Khuyến mãi</span>
                <span>- {order.discount.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>VAT</span>
                <span>10.000 VND</span>
              </div>
              <div className="flex justify-between mt-4 font-semibold text-base">
                <span>Tổng</span>
                <span>{order.total_amount.toLocaleString("vi-VN")} VND</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
