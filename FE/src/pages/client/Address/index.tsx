/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useModal } from "../../../hooks/useModal";
import ModalAddress from "../../../components/Modal/ModalAddress";
import { useDelete, useList } from "@refinedev/core";
import { Empty, notification, Popconfirm, Skeleton, Spin } from "antd";
import { useState } from "react";
import emptyImage from "../../../assets/images/empty_data.png";

const Address = () => {
  const { openModal } = useModal();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: responseListAddress,
    isLoading,
    refetch,
  } = useList({
    resource: "addresses",
  });

  const { mutate, isLoading: isLoadingDeleteAddress } = useDelete();

  const deleteAddress = (addressId: any) => {
    // setDeletingId(addressId);
    mutate(
      { resource: "addresses", id: addressId },
      {
        onError: (error) => {
          notification.error({ message: error?.response?.data?.message });
          // An error occurred!
        },
        onSuccess: (response) => {
          // console.log(data);
          notification.success({ message: response?.data?.message });
          refetch();
          // Let's celebrate!
        },
        onSettled: () => {
          setDeletingId(null);
        },
      }
    );
  };

  const listAddress = responseListAddress?.data || [];

  // console.log(listAddress);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-8">Địa chỉ giao nhận</h1>
        <div className="flex flex-col gap-5 mb-8">
          {isLoading ? (
            <Skeleton
              style={{ textAlign: "center" }}
              // size="large"
            />
          ) : listAddress.length === 0 ? (
            <Empty
              description={
                <span className=" text-base ">Không có dữ liệu</span>
              }
              image={emptyImage}
            />
          ) : (
            listAddress?.map((address: any) => (
              <div
                key={address?.id}
                className="relative text-sm flex justify-between items-center p-5 border border-gray-400"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">
                      {address?.name_receive} | {address?.phone} |
                      {/* {address?.email} */}
                    </p>
                    {address?.is_default ? (
                      <span className="bg-black text-white text-xs px-2 py-1">
                        Mặc định
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>{address?.full_address}</div>
                </div>
                <div className="flex gap-4">
                  <EditOutlined
                    onClick={() =>
                      openModal(
                        <ModalAddress
                          mode="edit"
                          record={address}
                          refetch={refetch}
                        />
                      )
                    }
                    className="cursor-pointer text-xl"
                  />
                  <Popconfirm
                    title="Xóa địa chỉ"
                    onConfirm={() => deleteAddress(address?.id)}
                    description="Bạn có chắc chắn muốn xóa không?"
                    okText="Có"
                    cancelText="Không"
                  >
                    <DeleteOutlined className="cursor-pointer text-xl" />
                  </Popconfirm>
                </div>
                {isLoadingDeleteAddress && deletingId === address?.id ? (
                  <Spin
                    className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center "
                    style={{ textAlign: "center" }}
                    size="large"
                  />
                ) : (
                  ""
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center items-center ">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              openModal(<ModalAddress mode="create" refetch={refetch} />)
            }
          >
            <PlusOutlined className="text-xl" />
            <span className="font-bold">Thêm địa chỉ</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Address;
