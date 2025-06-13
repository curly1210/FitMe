/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import { LuTrash } from "react-icons/lu";
import { useCart } from "../../../hooks/useCart";
import { Button, Popconfirm } from "antd";

const CartItem = ({ item }: any) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const { updateToCartHandler, deleteCartItemHandler, loadingItemId } =
    useCart();

  const onHandleQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateToCartHandler?.(item.id, newQuantity);
      setQuantity(newQuantity);
      return;
    } catch (error) {
      console.log("Error updating quantity:", error);
      return;
    }
  };

  return (
    <div key={item.id} className="flex justify-between items-end mb-5">
      <div className="flex items-stretch gap-3">
        <img width={80} height={100} src={item?.image} alt="" />
        <div className="flex flex-col justify-between">
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
          <div className="flex items-stretch gap-2">
            <div className="border border-solid border-neutral-400 w-fit flex items-center">
              <Button
                disabled={loadingItemId === item.id}
                onClick={() => onHandleQuantity(quantity - 1)}
                className={`py-1 px-3  cursor-pointer !border-none !text-black`}
              >
                {/* <FaMinus className="font-light" /> */}
                <AiOutlineMinus />
              </Button>
              <span className="text-sm">{quantity}</span>

              <Button
                disabled={loadingItemId === item.id}
                onClick={() => onHandleQuantity(quantity + 1)}
                className={`py-1 px-3  cursor-pointer !border-none !text-black`}
              >
                <IoAdd />
              </Button>
            </div>
            <Popconfirm
              disabled={loadingItemId === item.id}
              title="Xóa sản phẩm"
              onConfirm={() => deleteCartItemHandler?.(item.id)}
              description="Bạn có chắc chắn muốn xóa không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                disabled={loadingItemId === item.id}
                className={` !px-2  cursor-pointer !border-none !rounded-none !bg-[#F3E8DC] !text-black !text-base`}
                // className="bg-[#F3E8DC] flex items-center px-1"
              >
                <LuTrash />
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
      <div className="font-bold">{item?.subtotal.toLocaleString()}đ</div>
    </div>
  );
};
export default CartItem;
