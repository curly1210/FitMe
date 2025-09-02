/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { useCreate, useOne } from "@refinedev/core";
import {
  Button,
  Drawer,
  Image,
  Modal,
  notification,
  Popconfirm,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

const DetailTransaction = ({
  open,
  onClose,
  transactionId,
  refetchListTransaction,
}: any) => {
  const [fileList, setFileList] = useState<any>([]);
  const [openModalAccept, setOpenModalAccept] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);
  const [failReason, setFailReason] = useState("");

  const {
    data,
    isFetching: isFetchingTransaction,
    refetch: reFetchTransaction,
  } = useOne({
    resource: "admin/wallet/widraw-request",
    id: transactionId || "",
    queryOptions: {
      enabled: open,
    },
  });

  const { mutate: mutateAccept, isPending: isPendingAccept } = useCreate({
    resource: "admin/wallet/widraw-request/accept",
  });

  const { mutate: mutateReject, isPending: isPendingReject } = useCreate({
    resource: "admin/wallet/widraw-request/reject",
  });

  const onHandleChangeImage = ({ fileList }: any) => {
    setFileList(fileList); // cập nhật state
  };

  const onHandleAccept = () => {
    // if (!orderId) {
    //   return notification.error({ message: "Order ID không hợp lệ" });
    // }
    if (fileList.length === 0) {
      return notification.warning({
        message: "Vui lòng chọn ảnh trước khi upload",
      });
    }

    const formData = new FormData();

    formData.append("bill_image", fileList[0].originFileObj);
    if (data?.data?.id !== undefined && data?.data?.id !== null) {
      formData.append("walletTransaction_id", String(data.data.id));
    }
    formData.append("wallet_id", data?.data?.user?.walet_id);

    mutateAccept(
      {
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Cập nhật thành công" });
          refetchListTransaction();
          setOpenModalAccept(false);
          setFileList([]);
        },
        onError: () => {
          notification.error({ message: "Cập nhật thất bại" });
        },
        onSettled: () => reFetchTransaction(),
      }
    );
  };

  const onHandleReject = () => {
    if (failReason.length === 0) {
      return notification.warning({
        message: "Vui lòng nhập lý do từ chối",
      });
    }

    mutateReject(
      {
        values: {
          reject_reason: failReason,
          walletTransaction_id: data?.data.id,
          wallet_id: data?.data?.user?.walet_id,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Cập nhật thành công" });
          refetchListTransaction();
          setOpenModalReject(false);
          setFailReason("");
        },
        onError: () => {
          notification.error({ message: "Cập nhật thất bại" });
        },
        onSettled: () => reFetchTransaction(),
      }
    );
  };

  return (
    <Drawer
      title="Chi tiết giao dịch"
      placement="right"
      width={800}
      onClose={onClose}
      open={open}
    >
      <div className="flex justify-between mb-7">
        <div className="text-base font-semibold ">Thông tin giao dịch</div>
        {isFetchingTransaction
          ? ""
          : data?.data?.type === "withdraw" &&
            data?.data?.status === "pending" && (
              <div className="flex gap-2">
                <Popconfirm
                  onConfirm={() => {
                    setOpenModalAccept(true);
                  }}
                  title="Cập nhật giao dịch"
                  description="Bạn có muốn chấp thuận không?"
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="primary">Chấp nhập</Button>
                </Popconfirm>

                <Popconfirm
                  onConfirm={() => {
                    setOpenModalReject(true);
                  }}
                  title="Cập nhật giao dịch"
                  description="Bạn có muốn từ chốt không?"
                  okText="Có"
                  cancelText="Không"
                >
                  <Button color="danger" variant="solid">
                    Từ chối
                  </Button>
                </Popconfirm>
              </div>
            )}
      </div>

      {isFetchingTransaction ? (
        <Skeleton active />
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-y-8 mb-7">
            <div>
              <p className="text-gray-500">Tên khách hàng</p>
              <p>{data?.data?.user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Số điện thoại</p>
              <p>{data?.data?.user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Trạng thái</p>
              <p>
                {data?.data?.status === "accept" ? (
                  <Tag color="green" className="font-bold">
                    Đã duyệt
                  </Tag>
                ) : data?.data?.status === "pending" ? (
                  <Tag color="orange" className="font-bold">
                    Chờ xử lý
                  </Tag>
                ) : (
                  <Tag color="red" className="font-bold">
                    Từ chối
                  </Tag>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Ngày tạo</p>
              <p>{data?.data?.created_at}</p>
            </div>
            <div>
              <p className="text-gray-500">Số tiền</p>
              <span
                className={`font-bold text-lg ${
                  data?.data.type === "refund"
                    ? "text-green-600"
                    : "text-red-600"
                } `}
              >
                {data?.data?.type === "refund" ? "+" : "-"}{" "}
                {data?.data?.amount.toLocaleString().replace(/,/g, ".")} ₫
              </span>
            </div>
            <div>
              <p className="text-gray-500">Loại giao dịch</p>
              <p>
                {data?.data?.type === "withdraw" ? (
                  <Tag color="green" className="font-bold ">
                    Rút tiền
                  </Tag>
                ) : (
                  <Tag color="blue" className="font-bold ">
                    Hoàn tiền
                  </Tag>
                )}
              </p>
            </div>
          </div>

          {data?.data?.bill_url && (
            <div className="mb-5">
              <p className="text-gray-500">Ảnh chuyển khoản</p>
              <Image
                className="!border-none  !h-[120px] !rounded-none !w-[120px]  !object-cover !object-center"
                src={data?.data?.bill_url}
                alt="Ảnh preview"
                preview
              />
            </div>
          )}
          {data?.data?.reject_reason && (
            <div className="mb-5">
              <p className="text-gray-500">Lý do từ chối</p>
              <p>- {data?.data?.reject_reason}</p>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Thông tin thanh toán
            </h3>
            {data?.data?.user?.bank_account ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tên chủ tài khoản:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.user?.bank_account.account_holder}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tên ngân hàng:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.user?.bank_account.bank_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Số tài khoản:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.user?.bank_account.account_number}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 border border-gray-300  rounded-lg flex flex-col  items-center justify-center gap-4">
                {/* <BanknotesIcon className="w-12 h-12 text-gray-400" /> */}
                <div>
                  <p className="text-gray-500">
                    Không có thông tin tài khoản ngân hàng.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Modal
            title="Upload ảnh chuyển khoản"
            open={openModalAccept}
            onCancel={() => {
              setOpenModalAccept(false);
              setFileList([]);
            }}
            onOk={onHandleAccept}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={isPendingAccept}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              listType="picture-card"
              fileList={fileList}
              onChange={onHandleChangeImage}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Chọn ảnh
              </Button>
            </Upload>
          </Modal>

          <Modal
            title="Lý do từ chối"
            open={openModalReject}
            onCancel={() => {
              setOpenModalReject(false);
              setFailReason("");
            }}
            onOk={onHandleReject}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={isPendingReject}
          >
            <TextArea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do thất bại..."
            />
          </Modal>
        </div>
      )}
    </Drawer>
  );
};
export default DetailTransaction;
