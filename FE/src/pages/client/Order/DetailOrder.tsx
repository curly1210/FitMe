/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from "@ant-design/icons";
import { useOne } from "@refinedev/core";
import { Spin, Steps, Tag } from "antd";
import { Link, useParams } from "react-router";
import { formatDate } from "../../../utils/dateUtils";
import { formatCurrencyVND } from "../../../utils/currencyUtils";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiDollar } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
import { BsBoxSeam } from "react-icons/bs";
import { MdClose } from "react-icons/md";

const DetailOrder = () => {
  const { id } = useParams();

  const { data: orderResponse, isLoading } = useOne({
    resource: "orders",
    id: id,
  });

  const order: any = orderResponse?.data || [];

  console.log(order);

  // const description = "This is a description.";

  // const items: {
  //   title: string;
  //   status: "wait" | "process" | "finish" | "error" | undefined;
  //   icon: JSX.Element;
  // }[] = [
  //   {
  //     title: "Chờ xác nhận",
  //     status: "finish",
  //     icon: <BsBoxSeam className="!text-3xl" />,
  //   },
  //   {
  //     title: "Chuẩn bị hàng",
  //     status: order?.status_order_id > 1 ? "finish" : "wait",
  //     icon: <BiDollar className="!text-3xl" />,
  //   },
  //   {
  //     title: "Đang giao hàng",
  //     status: order?.status_order_id > 2 ? "finish" : "wait",
  //     icon: <LiaShippingFastSolid className="!text-3xl" />,
  //   },
  //   {
  //     title: "Thành công",
  //     status: order?.status_order_id == 6 ? "finish" : "wait",
  //     icon: <FaCheck className="!text-3xl" />,
  //   },
  // ];

  return (
    <div>
      <div className="flex gap-3 border border-gray-400 items-center py-5 px-4 mb-5">
        <Link to={"/"}>Trang chủ</Link>
        <RightOutlined />
        <Link to={"/order"}>Đơn hàng</Link>
        <RightOutlined />
        <p className="font-bold">Chi tiết đơn hàng</p>
      </div>

      {isLoading ? (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        <div>
          <h2 className="font-bold text-[27px] mb-4">
            Đơn hàng #{order?.order_code}
          </h2>

          <p className="font-bold mb-11">
            Giao hàng dự kiến: {formatDate(order?.created_at)} -{" "}
            {formatDate(order?.created_at, 3)}
          </p>

          <div className="grid grid-cols-3 gap-x-4 mb-5">
            <div className="border border-gray-300 px-5 py-3">
              <p className="font-bold mb-3">Thông tin giao hàng</p>
              <div>
                <p>{order?.recipient_name}</p>
                <p>{order?.recipient_phone}</p>
                <p>{order?.receiving_address}</p>
              </div>
            </div>
            <div className="border border-gray-300 px-5 py-3">
              <p className="font-bold mb-3">Phương thức thanh toán</p>
              <div>
                {order?.payment_method === "cod" ? (
                  <div className="mb-1">
                    <p>Trả tiền mặt khi thanh toán (COD)</p>
                    <p>
                      Quý khách vui lòng thanh toán{" "}
                      {formatCurrencyVND(order?.total_amount)} khi nhận hàng
                    </p>
                  </div>
                ) : (
                  <div className="mb-1">
                    <p>Thanh toán online (VN-PAY)</p>
                  </div>
                )}
                <p>
                  {order?.status_payment ? (
                    <Tag className="!font-bold" color="success">
                      Đã thanh toán
                    </Tag>
                  ) : (
                    <Tag className="!font-bold" color="warning">
                      Chưa thanh toán
                    </Tag>
                  )}
                </p>
              </div>
            </div>
            <div className="border border-gray-300 px-5 py-3">
              <p className="font-bold mb-3">Thông tin vận chuyển</p>
              <p>Chưa có thông tin vận chuyển</p>
            </div>
          </div>

          <div className="mb-5">
            {order?.status_order_id === 7 ? (
              <Steps
                labelPlacement="vertical"
                current={1}
                items={[
                  {
                    title: "Chờ xác nhận",
                    status: "finish",
                    icon: <BsBoxSeam className="!text-3xl" />,
                  },
                  {
                    title: "Đã hủy",
                    status: "finish",
                    icon: <MdClose className="!text-3xl" />,
                  },
                ]}
              />
            ) : (
              <Steps
                labelPlacement="vertical"
                current={1}
                items={[
                  {
                    title: "Chờ xác nhận",
                    status: "finish",
                    icon: <BsBoxSeam className="!text-3xl" />,
                  },
                  {
                    title: "Chuẩn bị hàng",
                    status: order?.status_order_id > 1 ? "finish" : "wait",
                    icon: <BiDollar className="!text-3xl" />,
                  },
                  {
                    title: "Đang giao hàng",
                    status: order?.status_order_id > 2 ? "finish" : "wait",
                    icon: <LiaShippingFastSolid className="!text-3xl" />,
                  },
                  {
                    title: "Thành công",
                    status: order?.status_order_id == 6 ? "finish" : "wait",
                    icon: <FaCheck className="!text-3xl" />,
                  },
                ]}
              />
            )}

            {/* <Steps current={1} labelPlacement="vertical" items={items} /> */}
          </div>

          <div className="border border-gray-300 px-5 py-3 mb-5">
            <p className="font-semibold mb-5">Thông tin giỏ hàng</p>
            <div>
              {order?.orderItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-end mb-5"
                >
                  <div className="flex items-stretch gap-3">
                    <img
                      width={60}
                      height={100}
                      className="block"
                      src={item?.image}
                      alt=""
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">
                        {item?.name} - {item?.sku}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-400">
                          {item?.color}/{item?.size}
                        </p>
                        <p className="font-bold">
                          {item?.sale_percent > 0 ? (
                            <span className="line-through font-normal text-sm mr-2">
                              {item?.price.toLocaleString()}đ
                            </span>
                          ) : (
                            ""
                          )}
                          {item?.sale_price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold">
                    {item?.subtotal.toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="border border-gray-300 px-5 py-3 w-72 space-y-3">
              <div className="flex justify-between">
                <p>Tạm tính:</p>
                <p className="font-bold">
                  {formatCurrencyVND(order?.total_price_item)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Giảm giá:</p>
                <p className="font-bold">
                  {order?.discount ? "-" : ""}
                  {formatCurrencyVND(order?.discount)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Phí vận chuyển:</p>
                <p className="font-bold">
                  {formatCurrencyVND(order?.shipping_price)}
                </p>
              </div>
              <hr className="text-gray-300" />
              <div className="flex justify-between">
                <p>Tổng tiền:</p>
                <p className="font-bold">
                  {formatCurrencyVND(order?.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DetailOrder;
