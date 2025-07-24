/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import AddressList from "./AddressList";
import {
  useCreate,
  useList,
  useCustomMutation,
  useCustom,
} from "@refinedev/core";
import { useNavigate } from "react-router";
import { useCart } from "../../../hooks/useCart";
import dayjs from "dayjs";
type Coupon = {
  code: string;
  name: string;
  value: number;
  max_price_discount: number;
};
const CheckOut = () => {
  const [selectedMethod, setSelectedMethod] = useState("COD");

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

  const [shippingPrice, setShippingPrice] = useState<number>(20000); // Phí ship

  const { mutate: createOrder, isLoading } = useCreate(); // gửi thông tin về be khi ấn thanh toán

  const { data: addressData } = useList({ resource: "addresses" });
  const { mutate: redeemCoupon, isLoading: isRedeeming } = useCustomMutation();
  const nav = useNavigate();

  const { cart, refetch } = useCart(); // lấy đơn hàng từ cart
  const orderItems = cart?.cartItems || [];

  console.log(cart, "cart");

  useEffect(() => {
    if (cart?.cartItems) {
      if (cart.cartItems.length === 0) {
        nav("/"); // Chuyển hướng về trang chủ nếu giỏ hàng trống
      }
    }
  }, [cart, nav]);

  const totalPrice = orderItems.reduce(
    (sum: number, item: any) => sum + item.subtotal,
    0
  );
  const totalAmount = totalPrice + shippingPrice - discount; // tính giá sau khi nhập mã

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

    const calculatedDiscountRaw = Math.min(
      (coupon.value / 100) * totalPrice,
      coupon.max_price_discount
    );
    const calculatedDiscount = Number(
      Math.floor(calculatedDiscountRaw).toString().slice(0, 6)
    );
    setAppliedCoupon(coupon);
    setDiscount(calculatedDiscount);
    message.success(`Áp dụng mã ${coupon.code} thành công.`);
  };

  // console.log("selectedCoupon:", selectedCoupon);
  // console.log("availableCoupons:", availableCoupons.map(c => c.code));

  // hàm gửi thông tin sau ấn thanh toán
  const handleCheckout = () => {
    if (!selectedAddress) return;

    const values = {
      cartItems: orderItems.map((item: any) => ({
        idProduct_item: item.idProduct_item,
        quantity: item.quantity,
        idItem: item.id,
        price: item.price,
        sale_price: item.sale_price,
        sale_percent: item.sale_percent,
        image_product: item.image,
      })),
      payment_method: selectedMethod,
      shipping_address_id: selectedAddress.id,
      total_price_cart: totalPrice,
      shipping_price: shippingPrice,
      discount: discount,
      total_amount: totalAmount,
      coupon_code: appliedCoupon?.code || "",
    };

    localStorage.setItem("order", JSON.stringify(values));

    if (selectedMethod === "COD") {
      createOrder(
        {
          resource: "orders/checkout",
          values,
        },
        {
          onSuccess: () => {
            // if (refetch) {
            refetch(); // Lấy lại dữ liệu giỏ hàng sau khi thanh toán thành công
            // }
            nav("success");
          },
          onError: (error) => console.error("Thanh toán thất bại:cod", error),
        }
      );
    }

    if (selectedMethod === "VNPAY") {
      createOrder(
        {
          resource: "vnpay/payment",
          values,
        },
        {
          onSuccess: (response) => {
            window.location.href = response.data.vnp_Url; // Chuyển hướng đến trang thanh toán VNPAY
          },
          onError: (error) => console.error("Thanh toán thất bại:", error),
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
              <span>40.000VNĐ</span>
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
              <span>20.000VNĐ</span>
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
                  {`${coupon.code} - ${coupon.name} (Giảm ${
                    coupon.value
                  }% tối đa ${coupon.max_price_discount.toLocaleString()}đ)`}
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
        <div className="bg-white p-4 border border-gray-300 rounded shadow-md space-y-4">
          <h2 className="font-semibold text-lg">Đơn hàng</h2>

          {orderItems.map((item: any, index: number) => (
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
          ))}

          {appliedCoupon && (
            <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
              🎁 Áp dụng mã: <strong>{appliedCoupon.code}</strong> – Giảm
              {appliedCoupon.value}%
            </div>
          )}

          <div className="text-sm text-gray-800 space-y-1">
            <div className="flex justify-between">
              <span>Tổng giá trị đơn hàng</span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shippingPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>{discount?.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="border-t pt-2 text-sm text-gray-900 space-y-1  ">
            <div className="flex justify-between font-semibold  ">
              <span>Thành tiền</span>
              <span>{totalAmount?.toLocaleString()}đ</span>
            </div>
          </div>

          <button
            disabled={!selectedAddress}
            onClick={handleCheckout}
            className={`w-full py-2 rounded text-sm font-semibold cursor-pointer ${
              selectedAddress
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Thanh toán
          </button>

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
