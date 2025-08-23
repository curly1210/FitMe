/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CrudFilters,
  useCreate,
  useList,
  useUpdate,
  useCustom,
} from "@refinedev/core";
import {
  Button,
  Select,
  Space,
  Table,
  DatePicker,
  notification,
  Popconfirm,
  Spin,
  Modal,
  Input,
  Form,
  message,
} from "antd";
import { useEffect, useState } from "react";
import OrderDetailDrawer from "./oderDetail";
import Search from "antd/es/input/Search";
import UploadProofForm from "./ProofImageForm";
import { useNotificationUser } from "../../../hooks/userNotificationUser";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

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
  const { mutate: create } = useCreate();
  const { mutate } = useUpdate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [statusPay, setStatusPay] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  //upload ảnh
  const [uploadOpen, setUploadOpen] = useState(false);

  // form lý do thất bại
  const [failReasonOpen, setFailReasonOpen] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [failOrderId, setFailOrderId] = useState<string | null>(null);
  const [isSubmittingFail, setIsSubmittingFail] = useState(false);

  const [loadingOrderId, setLoadingOrderId] = useState<any>(null);
  const { echo } = useNotificationUser();

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

  const { data, isLoading, refetch } = useCustom({
    method: "get",
    url: "admin/orders",
    config: {
      query: {
        page: current,
        per_page: pageSize,
        search: searchName,
        status_order_id: statusFilter,
        status_payment: statusPay,
        from: dateRange ? dateRange[0] : undefined,
        to: dateRange ? dateRange[1] : undefined,
      },
    },
  });

  // const handlePageChange = (page: number, pageSize?: number) => {
  //   setCurrentPage(page);
  //   if (pageSize) setPageSize(pageSize);
  // };

  // const { data, isLoading, refetch } = useList({
  //   resource: "admin/orders",
  //   filters,
  //   hasPagination: true,
  //   pagination: { current, pageSize },
  //   meta: { _start, _end },
  // });

  useEffect(() => {
    let isMounted = true;

    if (!echo) return;
    const channelName = `admin.notifications`;
    const channel = echo.private(channelName);

    channel.listen(".order", (e: any) => {
      if (isMounted) {
        refetch();
      }
    });

    return () => {
      isMounted = false; // chỉ tắt logic, không hủy listener
    };
  }, [echo]);

  const { mutate: mutateRefund, isLoading: isLoadingRefund } = useCreate();

  const onHandleRefund = (order_code: any) => {
    setLoadingOrderId(selectedOrderId);
    mutateRefund(
      {
        resource: "vnpay/refund",
        values: { order_code },
      },
      {
        onSuccess: (_response: any) => {
          refetch();
          notification.success({
            message: "Hoàn tiền thành công",
          });
        },
        onError: (_error: any) => {
          notification.error({
            message: "Hoàn tiền thất bại",
          });
        },
        onSettled: () => {
          setLoadingOrderId(null); // tắt loading
        },
      }
    );
  };

  const handleUpdateStatus = (
    newStatus: number,
    successMessage: string,
    type: "success" | "error" = "success"
  ) => {
    if (!selectedOrderId) return;
    setLoadingOrderId(selectedOrderId);
    mutate(
      {
        resource: "admin/orders/update",
        id: selectedOrderId,
        values: { status_order_id: newStatus },
        meta: { method: "post" },
      },
      {
        onSuccess: (response: any) => {
          refetch();
          notification[type]({
            message: "Cập nhật trạng thái thành công",
          });
        },
        onError: (error: any) => {
          refetch();
          notification.error({
            message: "Cập nhật trạng thái thất bại",
          });
        },
        onSettled: () => {
          setLoadingOrderId(null); // tắt loading
        },
      }
    );
  };

  // gửi lý do chuyển đội trạng thái tiếp theo
  const handleShippingFailSubmit = () => {
    if (!failOrderId || !failReason) return;

    create(
      {
        resource: `admin/orders/shippingfail/${failOrderId}`,
        values: { reason: failReason },
      },
      {
        onSuccess: () => {
          message.success("Cập nhật đơn hàng thất bại thành công");

          // Cập nhật trạng thái tiếp theo
          setSelectedOrderId(failOrderId);
          handleUpdateStatus(
            STATUS_MAP["Giao hàng thất bại"],
            "Giao hàng thất bại"
          );

          // Reset state
          setFailReasonOpen(false);
          setFailReason("");
          setFailOrderId(null);

          // Refetch lại danh sách
          refetch();
        },
        onError: () => {
          message.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
      }
    );
  };

  const renderAdminActionButtons = (record: any) => {
    // const statusPayment = record?.status_payment === 2 ? "Chờ hoàn tiền" : "";
    // console.log(statusPayment);

    // console.log(record);
    // console.log("sdsds");
    const status =
      record?.status_payment === 2
        ? "Chờ hoàn tiền"
        : record.status_order?.label;

    const orderId = record.id;

    switch (status) {
      case "Chờ xác nhận":
        return (
          <Popconfirm
            onConfirm={() => {
              // setSelectedOrderId(orderId);
              handleUpdateStatus(
                STATUS_MAP["Đang chuẩn bị hàng"],
                "Đang chuẩn bị hàng",
                "success"
              );
            }}
            title="Cập nhật trạng thái"
            description="Bạn có muốn xác nhận không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              loading={loadingOrderId === orderId}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrderId(orderId);
              }}
              type="primary"
            >
              Xác nhận
            </Button>
          </Popconfirm>
        );
      case "Đang chuẩn bị hàng":
        return (
          <Popconfirm
            onConfirm={() => {
              // setSelectedOrderId(orderId);
              handleUpdateStatus(
                STATUS_MAP["Đang giao hàng"],
                "Đang giao hàng",
                "success"
              );
            }}
            title="Cập nhật trạng thái"
            description="Bạn có muốn xác nhận không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              loading={loadingOrderId === orderId}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrderId(orderId);
              }}
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
              title="Xác nhận đã giao hàng"
              description="Bạn có chắc chắn muốn xác nhận đơn đã giao không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                // setSelectedOrderId(orderId);
                setUploadOpen(true); // Mở form upload ảnh sau khi xác nhận
              }}
            >
              <Button
                loading={loadingOrderId === orderId}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrderId(orderId);
                }}
                type="primary"
              >
                Đã giao
              </Button>
            </Popconfirm>

            <Button
              loading={loadingOrderId === orderId}
              onClick={(e) => {
                {
                  e.stopPropagation();
                  setSelectedOrderId(orderId);
                }
                setFailOrderId(orderId);
                setFailReasonOpen(true); // mở modal lý do thất bại
              }}
              danger
            >
              Giao hàng thất bại
            </Button>
          </Space>
        );
      case "Giao hàng thất bại":
        return (
          <Space>
            <Popconfirm
              onConfirm={() => {
                // setSelectedOrderId(orderId);
                handleUpdateStatus(
                  STATUS_MAP["Đang giao hàng"],
                  "Đang giao lại",
                  "success"
                );
              }}
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={loadingOrderId === orderId}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrderId(orderId);
                }}
                type="primary"
                disabled={record.shipping_failled === 2}
              >
                Đang giao
              </Button>
            </Popconfirm>
            <Popconfirm
              onConfirm={() => {
                // setSelectedOrderId(orderId);
                handleUpdateStatus(STATUS_MAP["Đã hủy"], "Đã hủy", "success");
              }}
              title="Cập nhật trạng thái"
              description="Bạn có muốn xác nhận không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={loadingOrderId === orderId}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrderId(orderId);
                }}
                danger
              >
                Hủy đơn hàng
              </Button>
            </Popconfirm>
          </Space>
        );
      case "Chờ hoàn tiền":
        return (
          <Popconfirm
            onConfirm={() => onHandleRefund(record?.orders_code)}
            title="Cập nhật trạng thái"
            description="Bạn có muốn xác nhận hoàn tiền không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              loading={loadingOrderId === orderId}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrderId(orderId);
              }}
              type="primary"
            >
              Hoàn tiền
            </Button>
          </Popconfirm>
        );
      default:
        return null;
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orders_code", key: "orders_code" },
    {
      title: "Tên tài khoản",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Email tài khoản",
      dataIndex: "customer_email",
      key: "customer_email",
    },
    {
      title: "Sđt tài khoản",
      dataIndex: "customer_phone",
      key: "customer_phone",
    },
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
        if (value === 3 || value === "Đã hoàn tiền")
          return <span style={{ color: "green" }}>Đã hoàn tiền</span>;
        if (value === 2 || value === "Chờ hoàn tiền")
          return <span style={{ color: "orange" }}>Chờ hoàn tiền</span>;
        if (value === 1 || value === "Đã thanh toán")
          return <span style={{ color: "green" }}>Đã thanh toán</span>;
        if (value === 0 || value === "Chưa thanh toán")
          return <span style={{ color: "red" }}>Chưa thanh toán</span>;
        return <span>{String(value)}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => renderAdminActionButtons(record),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Quản lý đơn hàng</h1>
      {/* --- filters --- */}
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
          onChange={(_dates, dateStrings) => {
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

      {/* --- table --- */}
      <Table
        className="border-gray rounded-2xl"
        dataSource={data?.data?.data ?? []}
        columns={columns}
        loading={isLoading}
        rowKey={(record: any) => `${record.id}-${record.status_order?.id}`}
        pagination={{
          current,
          pageSize,
          total: data?.data?.meta?.total ?? 0,
          // showSizeChanger: true,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
          },
        }}
        onRow={(record) => ({
          onClick: (event) => {
            const isInsidePopover = (event.target as HTMLElement).closest(
              ".ant-popover"
            );
            const isButton = (event.target as HTMLElement).closest("button");
            if (isInsidePopover || isButton) return;
            setSelectedOrderId(record.id);
            setDrawerOpen(true);
          },
          style: { cursor: "pointer" },
        })}
      />

      {/* --- drawers --- */}
      <OrderDetailDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />

      {selectedOrderId && (
        <UploadProofForm
          open={uploadOpen}
          orderId={selectedOrderId}
          onClose={() => setUploadOpen(false)}
          onSuccess={() => {
            if (selectedOrderId)
              handleUpdateStatus(STATUS_MAP["Đã giao"], "Đã giao", "success");
            setUploadOpen(false);
            refetch();
          }}
        />
      )}

      {/* --- form lý do thất bại --- */}
      <Modal
        title="Nhập lý do giao hàng thất bại"
        open={failReasonOpen}
        onCancel={() => setFailReasonOpen(false)}
        onOk={handleShippingFailSubmit}
        confirmLoading={isSubmittingFail}
      >
        <Form layout="vertical">
          <Form.Item label="Lý do" required>
            <TextArea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do thất bại..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* {isLoadingRefund && (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      )} */}
    </>
  );
};

export default Oder;
