/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwapRightOutlined } from "@ant-design/icons";
import { useCreate, useCustom } from "@refinedev/core";

import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  notification,
  Pagination,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import RenderReviewButton from "./RenderReviewButton";
import OrderActionButton from "./OrderActionButton";
import { useNotificationUser } from "../../../hooks/userNotificationUser";
import { useAuthen } from "../../../hooks/useAuthen";
dayjs.locale("vi");

const { Search } = Input;

const Order = () => {
  const [idOrderStatus, setIdOrderStatus] = useState(0);
  const [searchText, setSearchText] = useState<any>(undefined);
  const [orders, setOrders] = useState<any>([]); // danh sách đơn hàng

  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số item mỗi trang

  const [fromDate, setFromDate] = useState<dayjs.Dayjs | undefined>(undefined);
  const [toDate, setToDate] = useState<dayjs.Dayjs | undefined>(undefined);

  const { mutate: createPaymentOnline } = useCreate(); // gửi thông tin về be khi ấn thanh toán

  const { echo } = useNotificationUser();

  const { user } = useAuthen();

  const onHandlePaymentOnline = (orders_code: any, total_amount: any) => {
    createPaymentOnline(
      {
        resource: "vnpay/payment",
        values: {
          total_amount: total_amount,
          orders_code: orders_code,
        },
      },
      {
        onSuccess: (response) => {
          // console.log("url", response?.data.vnp_Url);
          window.location.href = response.data.vnp_Url; // Chuyển hướng đến trang thanh toán VNPAY
        },
        onError: (_error) => {
          notification.error({
            message: "Có lỗi xảy ra khi thanh toán",
          });
          // console.log("Thanh toán thất bại");
        },
      }
    );
  };

  const {
    data: ordersResponse,
    isLoading,
    refetch,
  } = useCustom({
    method: "get",
    url: "orders",
    config: {
      query: {
        page: currentPage,
        per_page: pageSize,
        status_order_id: idOrderStatus,
        search: searchText,
        date_from: fromDate?.format("YYYY-MM-DD"),
        date_to: toDate?.format("YYYY-MM-DD"),
      },
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (!echo) return;
    const channelName = `App.Models.User.${user?.id}`;
    const channel = echo.private(channelName);

    channel.listen(".order", (e: any) => {
      if (isMounted) {
        refetch();
      }
    });

    return () => {
      isMounted = false; // chỉ tắt logic, không hủy listener
    };
  }, [echo, user?.id]);

  useEffect(() => {
    if (ordersResponse?.data) {
      // console.log("in ra order 2", orders);
      setOrders(ordersResponse?.data?.data || []);
    }
  }, [ordersResponse]);

  // console.log("in ra order", orders);

  // console.log("ngay bat dau:", fromDate);

  const total = ordersResponse?.data?.total ?? 0;

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleSearchText = (value: any) => {
    setSearchText(value || undefined);
  };

  // const { mutate, isPending: isPendingUpdateStatus } = useUpdate({
  //   resource: "orders",
  //   mutationOptions: {
  //     onSuccess: (response) => {
  //       refetch();
  //       notification.success({
  //         message: `${response?.data?.message}`,
  //       });
  //     },
  //     onError: (error) => {
  //       refetch();
  //       notification.error({ message: `${error?.response?.data?.message}` });
  //     },
  //   },
  // });

  // const onHandleChangeStatus = (orderId: number) => {
  //   mutate({
  //     id: orderId,
  //     values: {},
  //   });
  // };

  return (
    <div className="list-order-client">
      <div className="">
        <h1 className="font-semibold mb-8 text-3xl">Đơn hàng</h1>
        <div className="flex items-center gap-3 mb-5 border-b-1 border-gray-300 pb-3">
          <p
            onClick={() => setIdOrderStatus(0)}
            className={`pr-3 py-1 cursor-pointer border-b-2  ${
              !idOrderStatus
                ? " font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Tất cả
          </p>
          <p
            onClick={() => setIdOrderStatus(1)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 1
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Chờ xác nhận
          </p>
          <p
            onClick={() => setIdOrderStatus(2)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 2
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Chuẩn bị hàng
          </p>
          <p
            onClick={() => setIdOrderStatus(3)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 3
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Đang giao hàng
          </p>
          <p
            onClick={() => setIdOrderStatus(4)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 4
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Đã giao hàng
          </p>
          <p
            onClick={() => setIdOrderStatus(6)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 6
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Hoàn thành
          </p>
          <p
            onClick={() => setIdOrderStatus(7)}
            className={`pr-3 py-1 cursor-pointer border-b-2 ${
              idOrderStatus === 7
                ? "font-semibold border-black"
                : "border-transparent"
            } `}
          >
            Đã hủy
          </p>
        </div>

        <div className="grid grid-cols-12 mb-4 gap-x-3">
          <div className="col-span-4">
            <Search
              placeholder="Tìm kiếm mã đơn hàng"
              onChange={(e: any) => handleSearchText(e.target.value)}
              // style={{ width: 300 }}
              allowClear
            />
          </div>

          <div className="flex gap-2 col-span-8 !w-full">
            <ConfigProvider locale={viVN}>
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Từ ngày"
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                allowClear
                className="!w-full"
              />
            </ConfigProvider>

            <SwapRightOutlined className="text-2xl !text-gray-500" />

            <ConfigProvider locale={viVN}>
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Đến ngày"
                value={toDate}
                onChange={(date) => setToDate(date)}
                className="!w-full"
                allowClear
              />
            </ConfigProvider>
          </div>
        </div>

        {isLoading ? (
          <Spin
            className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {orders?.map((order: any) => (
              <div
                key={order.id}
                className="py-3 px-4 text-sm border border-gray-300 flex flex-col gap-4"
              >
                <div className="flex items-center gap-20">
                  <p className="font-semibold">
                    Mã đơn hàng:{" "}
                    <span className="font-normal">#{order?.orders_code}</span>
                  </p>
                  <p>
                    Ngày đặt: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    {order.total_amount_items} sản phẩm (
                    {order?.total_amount.toLocaleString()} đ)
                  </p>
                </div>
                <div>Giao đến: {order?.receiving_address}</div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{order?.status_name}</p>

                  <div className="flex justify-end gap-3">
                    <Link to={`/order/${order?.orders_code}`}>
                      {/* <button className="!border-2 !py-2 !px-3 !font-semibold !cursor-pointer">
                        XEM CHI TIẾT
                      </button> */}
                      <Button className="!border-2 !py-5 !px-3 !font-semibold !text-black !border-black !cursor-pointer">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    <RenderReviewButton order={order} />

                    {order.status_name == "Chờ xác nhận" &&
                      order?.payment_method == "vnpay" &&
                      order?.status_payment == 0 && (
                        <Button
                          onClick={() =>
                            onHandlePaymentOnline(
                              order?.orders_code,
                              order?.total_amount
                            )
                          }
                          // loading={isPendingUpdateStatus}
                          className="!text-white !bg-black !border-black !py-5 !px-3 !cursor-pointer"
                        >
                          THANH TOÁN LẠI
                        </Button>
                      )}

                    <OrderActionButton order={order} refetch={refetch} />

                    {/* {order.status_name == "Đã giao hàng" && (
                      <Popconfirm
                        title="Cập nhật trạng thái"
                        onConfirm={() => onHandleChangeStatus(order.id)}
                        description="Xác nhận nhận hàng thành công?"
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button
                          loading={isPendingUpdateStatus}
                          className="!text-white !bg-black !border-black !py-5 !px-3 !cursor-pointer"
                        >
                          ĐÃ NHẬN HÀNG
                        </Button>
                      </Popconfirm>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                // showSizeChanger
                onChange={handlePageChange}
                style={{ marginTop: 16, textAlign: "right" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Order;
