/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../../hooks/useCart";
import { Button, Checkbox } from "antd";
import CartItem from "./CartItem";
import emptyCart from "../../../assets/images/empty_cart.png";
import { useEffect, useState } from "react";
import { useUpdate } from "@refinedev/core";

const Carts = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { cart, refetch } = useCart();
  const navigate = useNavigate();

  const totalItems = cart?.cartItems?.length || -1;
  const allSelected = selectedIds.length === totalItems;
  const isIndeterminate = selectedIds.length > 0 && !allSelected;

  const { mutate: updateAllSelection, isPending: isLoadingUpdateAllSelection } =
    useUpdate({
      resource: "cart-items/select-all",
    });

  const handleSelectAll = (isSelected: boolean) => {
    updateAllSelection(
      { values: { is_choose: isSelected }, id: "" },
      {
        onError: () => {
          console.log("Lỗi");
        },
        onSuccess: () => {
          console.log("Thành công");
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (!hasInitialized && cart?.cartItems?.length > 0) {
      updateAllSelection(
        { values: { is_choose: true }, id: "" },
        {
          onError: () => {
            console.log("Lỗi");
          },
          onSuccess: () => {
            refetch();
            setHasInitialized(true);
            console.log("Thành công");
            setSelectedIds(cart.cartItems.map((item: any) => item.id));
          },
        }
      );
    }
  }, [cart?.cartItems, hasInitialized]);

  const handlerCheckboxUpdateAllSelection = (e: any) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      handleSelectAll(true);
      setSelectedIds(cart.cartItems.map((item: any) => item.id));
    } else {
      handleSelectAll(false);
      setSelectedIds([]);
    }
  };

  const {
    mutate: updateSelectionItem,
    // isPending: isLoadingUpdateSelectionItem,
  } = useUpdate({
    resource: "cart-items/select",
  });

  const handleSelectItem = (itemId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds((prev) => [...prev, itemId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    }
    updateSelectionItem(
      {
        id: itemId,
        values: { is_choose: isSelected },
      },
      {
        onSuccess: () => {
          refetch();
          // setSelectedIds((prev) =>
          //   isSelected ? [...prev, itemId] : prev.filter((id) => id !== itemId)
          // );
        },
        onError: () => {
          console.log("Lỗi khi cập nhật lựa chọn");
        },
      }
    );
  };

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
              <div>
                <div className="flex gap-3 mb-5">
                  <Checkbox
                    className="!rounded-none"
                    indeterminate={isIndeterminate}
                    checked={allSelected}
                    onChange={handlerCheckboxUpdateAllSelection}
                    // disabled={totalAddresses === 1}
                  />
                  <p>Chọn tất cả</p>
                </div>
                {cart?.cartItems?.map((item: any) => (
                  <div className="flex items-center gap-3 mb-5" key={item.id}>
                    <Checkbox
                      className="!rounded-none "
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) =>
                        handleSelectItem(item.id, e.target.checked)
                      }
                      // disabled={totalAddresses === 1}
                    />
                    <CartItem key={item.id} item={item} />
                  </div>
                ))}
              </div>
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
            className={`${
              cart?.totalPriceCart === 0
                ? "!bg-black !text-white !opacity-20"
                : "!bg-black !text-white"
            } !border-none !rounded-none   w-full !py-6`}
            disabled={
              cart?.cartItems?.length === 0 ||
              cart?.totalPriceCart === 0 ||
              isLoadingUpdateAllSelection
            }
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
