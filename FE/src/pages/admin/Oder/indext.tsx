import { CrudFilters, useList, useUpdate } from "@refinedev/core";
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Row,
  Select,
  Space,
  Table,
  DatePicker,
  notification,
  Popconfirm,
} from "antd";
import { useState } from "react";
import OrderDetailDrawer from "./oderDetail";
import Search from "antd/es/input/Search";

const { RangePicker } = DatePicker;

const STATUS_MAP = {
  "Chờ xác nhận": 1,
  "Đang chuẩn bị hàng": 2,
  "Đang giao hàng": 3,
  "Đã giao": 4,
  "Giao hàng thất bại": 5,
  "Hoàn thành": 6,
  "Đã hủy": 7,
};

const Oder = () => {
  const { mutate } = useUpdate();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [statusPay, setStatusPay] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const _start = (current - 1) * pageSize;
  const _end = current * pageSize;

  const filters: CrudFilters = [];

  if (searchName) {
    filters.push({ field: "search", operator: "eq", value: searchName });
  }
  // trạng thái đơn hàng
  if (statusFilter !== undefined) {
    filters.push({
      field: "status_order_id",
      operator: "eq",
      value: statusFilter,
    });
  }
  // lọc trạng thái thanh toán
  if (statusPay !== undefined) {
    filters.push({ field: "status_payment", operator: "eq", value: statusPay });
  }
  // lọc ngày
  if (dateRange) {
    filters.push({ field: "from", operator: "eq", value: dateRange[0] });
    filters.push({ field: "to", operator: "eq", value: dateRange[1] });
  }

  const { data, isLoading, refetch } = useList({
    resource: "admin/orders",
    filters,
    hasPagination: true,
    pagination: { current, pageSize },
    meta: { _start, _end },
  });

  const renderAdminActionButtons = (record: any) => {
    const status = record.status_order?.label;
    const orderId = record.id;
    const handleUpdateStatus = (
      newStatus: number,
      successMessage: string,
      type: "success" | "error"
    ) => {
      mutate(
        {
          resource: "admin/orders/update",
          id: orderId,
          values: { status_order_id: newStatus },
          meta: { method: "post" },
        },
        {
          onSuccess: (response: any) => {
            refetch();
            //  lấy message từ BE nếu có
            const beMessage =
              response?.data?.message ||
              `Đơn hàng chuyển sang: ${successMessage}`;

            notification[type]({
              message: beMessage,
            });
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || "Cập nhật trạng thái thất bại";
            notification.error({
              message: errorMessage,
            });
          },
        }
      );
    };

    switch (status) {
      case "Chờ xác nhận":
        return (
          <Popconfirm
           
               onConfirm={() =>
                handleUpdateStatus(
                  STATUS_MAP["Đang chuẩn bị hàng"],
                  "Đang chuẩn bị hàng",
                  "success"
                )
              }
            title="Cập nhật trạng thái"
            description="Bạn có muốn xác nhận không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
          
            >
              Xác nhận
            </Button>
          </Popconfirm>
        );
      case "Đang chuẩn bị hàng":
        return (
          <Popconfirm
              onConfirm={() =>
                handleUpdateStatus(
                  STATUS_MAP["Đang giao hàng"],
                  "Đang giao hàng",
                  "success"
                )
              }
            title="Cập nhật trạng thái"
            description="Bạn có muốn xác nhận không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
          
            >
              Đang giao hàng
            </Button>
          </Popconfirm>
        );
      case "Đang giao hàng":
        return (
          <Space>
            <Popconfirm
                onConfirm={() =>
                  handleUpdateStatus(
                    STATUS_MAP["Đã giao"],
                    "Đã giao",
                    "success"
                  )
                }
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
            
              >
                Đã giao
              </Button>
            </Popconfirm>

            <Popconfirm
               onConfirm={() =>
                  handleUpdateStatus(
                    STATUS_MAP["Giao hàng thất bại"],
                    "Giao hàng thất bại",
                    "error"
                  )
                }
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
             
              >
                Giao hàng thất bại
              </Button>
            </Popconfirm>
          </Space>
        );
      case "Giao hàng thất bại":
        return (
          <Space>
            <Popconfirm
                onConfirm={() =>
                  handleUpdateStatus(
                    STATUS_MAP["Đang giao hàng"],
                    "Đang giao lại",
                    "success"
                  )
                }
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
            
              >
                Đang giao
              </Button>
            </Popconfirm>
            <Popconfirm
               onConfirm={() =>
                  handleUpdateStatus(STATUS_MAP["Đã hủy"], "Đã hủy", "success")
                }
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
             
              >
                Hủy đơn hàng
              </Button>
            </Popconfirm>
          </Space>
        );
      default:
        return null;
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orders_code", key: "orders_code" },
    { title: "Khách hàng", dataIndex: "customer_name", key: "customer_name" },
    { title: "Thời gian mua", dataIndex: "created_at", key: "created_at" },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Trạng thái đơn",
      dataIndex: ["status_order", "label"],
      key: "status_order",
      render: (_: any, record: any) => (
        <span style={{ color: record.status_order?.color }}>
          {record.status_order?.label}
        </span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "status_payment",
      key: "status_payment",
      render: (value: any) => {
        if (value === 1 || value === "Đã thanh toán") {
          return <span style={{ color: "green" }}>Đã thanh toán</span>;
        }
        if (value === 0 || value === "Chưa thanh toán") {
          return <span style={{ color: "red" }}>Chưa thanh toán</span>;
        }
        return <span>{String(value)}</span>;
      },
    },
    {
      title: "Trạng thái",
      key: "action",
      render: (_: any, record: any) => renderAdminActionButtons(record),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => {
                  setSelectedOrderId(record.id);
                  setDrawerOpen(true);
                }}
              >
                Chi tiết
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <span style={{ cursor: "pointer", fontSize: 20 }}>⋯</span>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <div className="flex gap-3 mb-4 flex-wrap">
        <Search
          size="middle"
          className="!h-8"
          placeholder="Tìm theo mã đơn hàng và tên"
          allowClear
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 270 }}
        />

        <RangePicker
          size="middle"
          className="!h-8 [&_.ant-picker]:!h-8 [&_.ant-picker-input>input]:!h-8"
          format="YYYY-MM-DD"
          onChange={(dates, dateStrings) => {
            if (dateStrings[0] && dateStrings[1]) {
              setDateRange([dateStrings[0], dateStrings[1]]);
              setCurrent(1);
            } else {
              setDateRange(null);
            }
          }}
          style={{ width: 200 }}
        />

        <Select
          size="middle"
          className="!h-8 [&_.ant-select-selector]:!h-8"
          placeholder="Lọc theo trạng thái thanh toán"
          allowClear
          value={statusPay}
          onChange={(value) => {
            setStatusPay(value);
            setCurrent(1);
          }}
          style={{ width: 220 }}
          options={[
            { value: undefined, label: "Tất cả" },
            { value: 0, label: "Chưa thanh toán" },
            { value: 1, label: "Đã thanh toán" },
          ]}
        />

        <Select
          size="middle"
          className="!h-8 [&_.ant-select-selector]:!h-8"
          placeholder="Lọc theo trạng thái đơn hàng"
          allowClear
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setCurrent(1);
          }}
          style={{ width: 220 }}
        >
          <Select.Option value={undefined}>Tất cả</Select.Option>
          {Object.entries(STATUS_MAP).map(([label, val]) => (
            <Select.Option key={val} value={val}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        className="border-gray rounded-2xl"
        dataSource={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        rowKey={(record) => `${record.id}-${record.status_order?.id}`}
        pagination={{
          current,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
          },
        }}
      />

      <OrderDetailDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default Oder;
