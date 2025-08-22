/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Select, Spin, message, notification } from "antd";
import { useEffect, useState } from "react";
import AddressList from "./AddressList";
import { useCreate, useList, useCustomMutation, useOne } from "@refinedev/core";
import { useNavigate } from "react-router";
import ImageWithFallback from "../../../components/ImageFallBack";
import { useCart } from "../../../hooks/useCart";
type Coupon = {
  code: string;
  name: string;
  value: number;
  max_price_discount: number;
  type: "percentage" | "fixed" | "free_shipping";
};

const rankLabels: Record<string, string> = {
  silver: "Bạc",
  gold: "Vàng",
  diamond: "Kim cương",
};

const CheckOut = () => {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [cart, setCart] = useState<any>({});

  const paymentMethods = [
    { id: "COD", label: "Trả tiền mặt khi nhận hàng (COD)" },
    { id: "VNPAY", label: "Thanh toán qua VNPAY" },
    // Bạn có thể thêm các phương thức khác ở đây
  ];

  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [addressListDefaultMode, setAddressListDefaultMode] = useState<
    "create" | "list"
  >("list"); // nút thêm mới địa chỉ và lấy địa chỉ

  // nhập mã
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null); // Mã người dùng nhập
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [rank, setRank] = useState<any>(null);

  const [shippingPrice, setShippingPrice] = useState<number>(20000); // Phí ship

  const { mutate: createOrder, isLoading } = useCreate(); // gửi thông tin về be khi ấn thanh toán

  const { data: addressData } = useList({ resource: "addresses" });
  const { mutate: redeemCoupon } = useCustomMutation();
  const nav = useNavigate();

  const { refetch: refetchAllItems } = useCart(); // lấy đơn hàng từ cart
  // const { cart, refetch } = useCart(); // lấy đơn hàng từ cart

  const {
    data: cartResponse,
    isFetching: isLoadingCarts,
    refetch: refetchSelectedItems,
  } = useList({
    resource: "cart-items/selected-all",
    // queryOptions: {
    //   enabled: hasAuth, // ✅ chỉ gọi API khi đã có accessToken & user
    // },
  });

  const { data: memberResponse } = useOne({ resource: "get-rank", id: "" });

  console.log(memberResponse?.data);

  useEffect(() => {
    if (cartResponse?.data) {
      // console.log("cartResponse:", cartResponse);
      setCart(cartResponse.data);
    }
  }, [cartResponse]);

  // console.log("cart:", cart);

  useEffect(() => {
    if (cart?.totalPriceCart && memberResponse?.data) {
      // console.log((memberResponse?.data?.value / 100) * cart?.totalPriceCart);
      setDiscount(
        Math.floor((memberResponse?.data?.value / 100) * cart?.totalPriceCart)
      );
      setRank(memberResponse?.data?.rank);
      // console.log(memberResponse?.data?.value / 100);
    }
    // console.log("hi");
  }, [memberResponse, cart]);

  // console.log(orderItems, "cart");

  // useEffect(() => {
  //   if (cart?.cartItems && cart.cartItems.length === 0) {
  //     nav("/", { replace: true }); // Chuyển hướng về trang chủ nếu giỏ hàng trống
  //   }
  // }, [cart, nav]);

  const totalPrice = (cart?.cartItems || []).reduce(
    (sum: number, item: any) => sum + item.subtotal,
    0
  );

  const [totalAmount, setTotalAmount] = useState(
    totalPrice + shippingPrice - discount
  );

  useEffect(() => {
    setTotalAmount(totalPrice + shippingPrice - discount);
  }, [totalPrice, shippingPrice, discount]); // tính giá sau khi nhập mã

  useEffect(() => {
    if (addressData?.data && !selectedAddress) {
      const defaultAddr = addressData.data.find((a: any) => a.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    }
  }, [addressData, selectedAddress]);

  //Lấy list mã giảm giá
  const fetchCoupons = () => {
    redeemCoupon(
      {
        url: "orders/redem",
        method: "post",
        values: {
          total_price_item: totalPrice,
        },
      },
      {
        onSuccess: (response) => {
          const res = response?.data;
          if (res?.available_vouchers?.length) {
            setAvailableCoupons(res.available_vouchers);
          } else {
            setAvailableCoupons([]);
            message.info("Không có mã giảm giá phù hợp.");
          }
        },
        onError: () => {
          message.error("Không thể lấy mã giảm giá.");
        },
      }
    );
  };

  useEffect(() => {
    if (totalPrice > 0) {
      fetchCoupons(); // gọi khi giá thay đổi
    }
  }, [totalPrice]);

  // tính giảm giá theo type
  const handleApplyCoupon = () => {
    if (!selectedCoupon) {
      return message.warning("Vui lòng chọn mã giảm giá.");
    }

    const coupon = availableCoupons.find(
      (c) =>
        c.code.trim().toLowerCase() ===
        selectedCoupon?.code.trim().toLowerCase()
    );

    if (!coupon) {
      return message.error("Mã không hợp lệ hoặc đã hết hạn.");
    }

    let calculatedDiscount = 0;
    // mã theo %
    if (coupon.type === "percentage") {
      calculatedDiscount = Math.min(
        (coupon.value / 100) * totalPrice,
        coupon.max_price_discount
      );
      // mã giảm cố định
    } else if (coupon.type === "fixed") {
      calculatedDiscount = Math.min(coupon.value, coupon.min_price_order);
      // mã freeship
    } else if (coupon.type === "free_shipping") {
      calculatedDiscount = 0; // Không giảm giá tiền
      setShippingPrice(0); // giá ship =0
    }
    // Nếu đang là freeship mà giờ đổi sang mã khác => reset lại phí ship
    if (
      appliedCoupon?.type === "free_shipping" &&
      coupon.type !== "free_shipping"
    ) {
      setShippingPrice(20000); // hoặc giá ship mặc định như 40000
    }
    setAppliedCoupon(coupon);
    setDiscount(Math.floor(calculatedDiscount)); // Làm tròn nếu cần
    message.success(`Áp dụng mã ${coupon.code} thành công.`);
  };

  // console.log("selectedCoupon:", selectedCoupon);
  // console.log("availableCoupons:", availableCoupons.map(c => c.code));

  // hàm gửi thông tin sau ấn thanh toán
  const handleCheckout = () => {
    if (!selectedAddress) return;

    const values = {
      cartItems: cart?.cartItems.map((item: any) => ({
        idProduct_item: item.idProduct_item,
        quantity: item.quantity,
        idItem: item.id,
        price: item.price,
        sale_price: item.sale_price,
        sale_percent: item.sale_percent,
        image_product: item.image,
        name_product: item.name,
      })),
      payment_method: selectedMethod,
      shipping_address_id: selectedAddress.id,
      total_price_cart: totalPrice,
      shipping_price: shippingPrice,
      discount: discount,
      total_amount: totalAmount,
      coupon_code: appliedCoupon?.code || "",
    };

    // localStorage.setItem("order", JSON.stringify(values));

    if (selectedMethod === "COD") {
      createOrder(
        {
          resource: "orders/checkout",
          values,
        },
        {
          onSuccess: () => {
            // if (refetch) {
            refetchAllItems();
            refetchSelectedItems(); // Lấy lại dữ liệu giỏ hàng sau khi thanh toán thành công
            // }
            nav("success");
          },
          onError: (error) => {
            refetchAllItems();
            refetchSelectedItems(); // Lấy lại dữ liệu giỏ hàng nếu có lỗi
            console.log(error?.response?.data?.message);
            notification.error({ message: error?.response?.data?.message });
          },
        }
      );
    }

    if (selectedMethod === "VNPAY") {
      createOrder(
        {
          // resource: "vnpay/payment",
          resource: "orders/checkout",
          values,
        },
        {
          onSuccess: (response) => {
            refetchAllItems();
            refetchSelectedItems(); // Lấy lại dữ liệu giỏ hàng sau khi thanh toán thành công
            createOrder(
              {
                resource: "vnpay/payment",
                values: {
                  total_amount: values?.total_amount,
                  orders_code: response?.data?.order_code,
                },
              },
              {
                onSuccess: (response) => {
                  // console.log("url", response?.data.vnp_Url);
                  window.location.href = response.data.vnp_Url; // Chuyển hướng đến trang thanh toán VNPAY
                },
                onError: (_error) => {
                  console.log("Thanh toán thất bại");
                },
              }
            );
            // console.log("VNPAY response:", response?.data?.order_code);
            // window.location.href = response.data.vnp_Url; // Chuyển hướng đến trang thanh toán VNPAY
          },
          onError: (error) => {
            refetchAllItems();
            refetchSelectedItems(); // Lấy lại dữ liệu giỏ hàng nếu có lỗi
            console.log(error?.response?.data?.message);
            notification.error({ message: error?.response?.data?.message });
          },
        }
      );
    }
  };
  // console.log("selectedAddress", selectedAddress);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50">
        {/* Cột 1: Thông tin giao hàng */}
        <div className="space-y-4">
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <div className="flex justify-between font-semibold">
              <span>Thông tin giao hàng</span>
              {selectedAddress && (
                <button
                  className="text-black underline text-sm"
                  onClick={() => {
                    setAddressListDefaultMode("list");
                    setIsSelectingAddress(true);
                  }}
                >
                  Thay đổi
                </button>
              )}
            </div>

            <div className="mt-2 text-sm bg-orange-100 text-gray-700 space-y-1 p-2">
              {!selectedAddress ? (
                <div>
                  <p>Bạn chưa có địa chỉ giao hàng nào.</p>
                  <Button
                    onClick={() => {
                      setAddressListDefaultMode("create");
                      setIsSelectingAddress(true);
                    }}
                    className="text-blue-600 underline text-sm"
                  >
                    Thêm địa chỉ
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-bold m-0">
                      {selectedAddress.name_receive}
                    </p>
                    {selectedAddress.is_default === 1 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-200 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="m-0">{selectedAddress.phone}</p>
                  {selectedAddress.email && (
                    <p className="m-0">{selectedAddress.email}</p>
                  )}
                  <p className="font-medium m-0">
                    {selectedAddress.full_address}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cột 2: Giao hàng + Thanh toán */}
        <div className="space-y-4">
          {/* Vận chuyển */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm space-y-4">
            <p className="font-semibold">Phương thức vận chuyển</p>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={shippingPrice === 40000}
                  onChange={() => setShippingPrice(40000)}
                />
                <span>Giao Hàng tiết kiệm</span>
              </label>
              <span>40.000 VNĐ</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={shippingPrice === 20000}
                  onChange={() => setShippingPrice(20000)}
                />
                <span>ViettelPost</span>
              </label>
              <span>20.000 VNĐ</span>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex justify-between items-start">
            <div>
              <p className="font-semibold mb-3">Phương thức thanh toán</p>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-start space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
              {/* <p className="text-sm mt-2">Trả tiền mặt khi nhận hàng (COD)</p> */}
            </div>
          </div>

          {/* Mã giảm giá */}
          <div>
            <h3>Chọn mã giảm giá</h3>

            <Select
              showSearch
              allowClear
              placeholder="Chọn hoặc nhập mã giảm giá"
              style={{ width: "100%", marginBottom: 8 }}
              value={selectedCoupon?.code}
              onChange={(value) => {
                if (!value) {
                  setSelectedCoupon(null);
                  setAppliedCoupon(null);
                  setDiscount(0);
                  if (appliedCoupon?.type === "free_shipping") {
                    setShippingPrice(20000); // hoặc 40000 tùy theo mặc định bạn muốn
                  }
                  setDiscount(
                    Math.floor(
                      (memberResponse?.data?.value / 100) * cart?.totalPriceCart
                    )
                  );
                  return;
                }
                const selected = availableCoupons.find((c) => c.code === value);
                setSelectedCoupon(selected || null);
              }}
              filterOption={(input, option) =>
                (option?.value as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              optionLabelProp="value"
            >
              {availableCoupons.map((coupon) => (
                <Select.Option key={coupon.code} value={coupon.code}>
                  {coupon.type === "free_shipping"
                    ? `${coupon.code} - Free Ship`
                    : `${coupon.code} (Giảm ${
                        coupon.type === "percentage"
                          ? `${
                              coupon.value
                            }% tối đa: ${coupon.max_price_discount.toLocaleString()} VNĐ`
                          : `${coupon.value.toLocaleString()} VNĐ`
                      })`}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              onClick={handleApplyCoupon}
              disabled={!selectedCoupon}
              style={{
                backgroundColor: "black",
                color: "white",
                borderColor: "black",
              }}
            >
              Áp dụng mã
            </Button>

            {/* {appliedCoupon && (
          <p style={{ marginTop: 8 }}>
            ✅ Đã áp dụng: <strong>{appliedCoupon.code}</strong> - Giảm{" "}
            <strong>{discount?.toLocaleString()}đ</strong>
          </p>
        )} */}
          </div>
        </div>

        {/* Cột 3: Đơn hàng */}
        <div className="bg-white p-4 border border-gray-300 rounded shadow-md space-y-4 relative">
          <h2 className="font-semibold text-lg">Đơn hàng</h2>

          {isLoadingCarts ? (
            <Spin
              className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
              style={{ textAlign: "center" }}
              size="large"
            />
          ) : (
            (cart?.cartItems || []).map((item: any, index: number) => (
              <div key={index} className="flex space-x-4 items-center ">
                <ImageWithFallback src={item.image} width={64} height={64} />
                {/* <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                /> */}
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {item.name} -{" "}
                    <span className="text-xs text-gray-500">{item?.sku}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.color}, {item.size} – SL: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-semibold">
                  {(item.subtotal || 0).toLocaleString()} VNĐ
                </div>
              </div>
            ))
          )}

          {/* {(cart?.cartItems || []).map((item: any, index: number) => (
            <div key={index} className="flex space-x-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.color}, {item.size} – SL: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-semibold">
                {(item.subtotal || 0).toLocaleString()}đ
              </div>
            </div>
          ))} */}

          {appliedCoupon ? (
            <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
              🎁 Áp dụng mã: <strong>{appliedCoupon.code}</strong> –{" "}
              {appliedCoupon.type === "free_shipping"
                ? "Miễn phí vận chuyển"
                : `Giảm ${
                    appliedCoupon.type === "percentage"
                      ? `${appliedCoupon.value}%`
                      : `${appliedCoupon.value.toLocaleString()} VNĐ`
                  }`}
            </div>
          ) : rank === "silver" || rank === "gold" || rank === "diamond" ? (
            <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
              🎁 Thành viên: <strong>{rankLabels[rank].toUpperCase()}</strong> –
              Giảm {memberResponse?.data?.value}%
            </div>
          ) : null}

          <div className="text-sm text-gray-800 space-y-3">
            <div className="flex justify-between">
              <span>Tổng giá trị đơn hàng</span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>
                {appliedCoupon?.type === "free_shipping"
                  ? "Miễn phí"
                  : `${shippingPrice.toLocaleString()} VNĐ`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>
                {discount ? "-" : ""} {discount?.toLocaleString()} VNĐ
              </span>
            </div>
          </div>

          <div className="border-t pt-2 text-sm text-gray-900 space-y-3  ">
            <div className="flex justify-between font-semibold  ">
              <span className="font-normal">Thành tiền</span>
              <span>{totalAmount?.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between font-semibold  ">
              <span className="font-normal">Số điểm tích lũy</span>
              <span>{Math.floor(totalPrice / 10000)}đ</span>
            </div>
          </div>

          <Button
            disabled={
              !selectedAddress ||
              (cart?.cartItems && cart.cartItems.length === 0)
            }
            onClick={handleCheckout}
            className={`!w-full !py-6 !rounded !text-sm !bg-black !text-white !font-semibold  ${
              !selectedAddress ||
              (cart?.cartItems && cart?.cartItems?.length === 0)
                ? "!opacity-20"
                : ""
            }`}
          >
            Thanh toán
          </Button>

          <p className="text-xs text-center text-gray-600 mt-2">
            Khi tiếp tục, bạn đồng ý với các{" "}
            <span className="underline">Điều khoản & Điều kiện</span> và{" "}
            <span className="underline">Chính sách</span> của chúng tôi.
          </p>
        </div>
      </div>
      {isLoading ? (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        ""
      )}

      <Modal
        open={isSelectingAddress}
        onCancel={() => setIsSelectingAddress(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <AddressList
          defaultMode={addressListDefaultMode}
          selectedAddressId={selectedAddress?.id || null}
          onSelect={(address) => {
            setSelectedAddress(address);
            setIsSelectingAddress(false);
          }}
        />
      </Modal>
    </>
  );
};

export default CheckOut;
