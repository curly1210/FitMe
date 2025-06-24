/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useModal } from "../../../hooks/useModal";
import ModalAddress from "../../../components/Modal/ModalAddress";
import { useDelete, useList } from "@refinedev/core";
import { Empty, notification, Popconfirm, Skeleton, Spin } from "antd";
import { useState } from "react";
import emptyImage from "../../../assets/images/empty_data.png";

const ProductLike = () => {
  const { openModal } = useModal();
  // const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: wishlistData, refetch, isLoading } = useList({ resource: "wishlist" });
  const listAddress = wishlistData?.data?.data || [];

  const { mutate, isLoading: loadingUnlike } = useDelete();

  const unLike = (addressId: any) => {
    mutate(
      { resource: "wishlist", id: addressId },
      {
        onError: (error) => {
          notification.error({ message: error?.response?.data?.message });
          // An error occurred!
        },
        onSuccess: (response) => {
          notification.success({ message: response?.data?.message });
          refetch();
        },
        // onSettled: () => {
        //   setDeletingId(null);
        // },
      }
    );
  };

  return (
    <>
      <div className="flex gap-3 border border-gray-400 items-center py-5 px-4 mb-5">
        <Link to={"/"}>Trang chủ</Link>
        <RightOutlined />
        <Link className="font-bold" to={"/address"}>
          Sản phẩm yêu thích
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-x-[10px] pt-5">
        <div className="col-span-4 flex flex-col gap-7">
          <Link to={""}>Tài khoản</Link>
          <Link to={"/order"}>Đơn hàng</Link>
          <Link to={"/address"}>Địa chỉ</Link>
          <p className="font-bold cursor-pointer">Sản phẩm yêu thích</p>
          <Link to={""}>Đổi mật khẩu</Link>
        </div>
        <div className="col-span-8">
          <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm yêu thích</h1>
          <div className="flex flex-col gap-5 mb-8">
            {isLoading ? (
              <Skeleton
                style={{ textAlign: "center" }}
                // size="large"
              />
            ) : listAddress.length === 0 ? (
              <Empty description={<span className=" text-base ">Không có dữ liệu</span>} image={emptyImage} />
            ) : (
              listAddress?.map((address: any) => {
               const sale_price = Math.min(...address?.product.product_items.map((item) => item.sale_price))
                const img = address?.product.product_images[0];

                return (
                  <div
                    key={address?.product?.id}
                    className="relative text-sm flex justify-between items-center p-5 border border-gray-400"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                      <Link
  to={`/products/${address?.product?.slug}`}
  className="font-bold text-blue-600 hover:underline"
>
  {address?.product?.name}
</Link>
                      </div>
                      <div>Giá: {sale_price.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10">
                        <img src={img.url} alt="ảnh" className="w-full object-contain object-center " />
                      </div>
                      <Popconfirm
                        title="Xóa sản phẩm yêu thíchi"
                        onConfirm={() => unLike(address?.product?.id)}
                        description="Bạn có chắc chắn muốn xóa không?"
                        okText="Có"
                        cancelText="Không"
                      >
                        <DeleteOutlined className="cursor-pointer text-xl" />
                      </Popconfirm>
                    </div>
                    {/* {loadingUnlike && deletingId === address?.id ? (
                    <Spin
                      className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center "
                      style={{ textAlign: "center" }}
                      size="large"
                    />
                  ) : (
                    ""
                  )} */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductLike;
