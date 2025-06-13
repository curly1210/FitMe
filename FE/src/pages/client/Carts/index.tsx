/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../../hooks/useCart";
import { Button } from "antd";
import CartItem from "./CartItem";
import emptyCart from "../../../assets/images/empty_cart.png";

const Carts = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex gap-3 border border-gray-300 items-center py-5 px-4 mb-5">
        <Link className="text-gray-500" to={"/"}>
          Trang chủ
        </Link>

        <RightOutlined className="text-sm text-gray-500" />
        <p className="font-bold">Giỏ hàng của tôi</p>

        {/* {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="p-4  rounded">
          Gợi ý #{i + 1}
        </div>
      ))} */}
      </div>

      <div className="grid grid-cols-12 gap-x-[10px] pt-5 items-start">
        <div className="col-span-9 border border-gray-200 ">
          <h1 className="text-center text-xl font-semibold py-3 border-b border-b-gray-200">
            Giỏ hàng
          </h1>
          <div className="px-6 py-5">
            {cart?.cartItems?.length === 0 ? (
              <div className="flex flex-col items-center">
                <img src={emptyCart} width={300} alt="" />
                <p className="text-center text-gray-500 text-xl ">
                  Giỏ hàng của bạn đang trống
                </p>
              </div>
            ) : (
              cart?.cartItems?.map((item: any) => (
                <CartItem key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
        <div className="col-span-3 py-3 px-4 border border-gray-200 flex flex-col gap-5">
          <div className="flex justify-between items-center  font-semibold">
            <p>Tổng tiền</p>
            <p>{(cart?.totalPriceCart || 0).toLocaleString()}đ</p>
          </div>
          <Button
            // loading={isLoadingAddtoCart}
            size="large"
            className="!bg-black !text-white !border-none !rounded-none     w-full !py-6"
            disabled={cart?.cartItems?.length === 0}
            onClick={() => navigate("/checkout")}
          >
            Thanh toán
          </Button>
          <Link to={"/"}>
            <Button
              // loading={isLoadingAddtoCart}
              size="large"
              className="!bg-white !text-black !border !hover:border-black !rounded-none !border-[#d9d9d9]    w-full !py-6"
              // onClick={() => handleAddToCart()}
            >
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Carts;
