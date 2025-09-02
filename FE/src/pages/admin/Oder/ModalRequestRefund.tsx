/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreate, useOne } from "@refinedev/core";
import {
  Button,
  Image,
  Modal,
  notification,
  Popconfirm,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import ImageWithFallback from "../../../components/ImageFallBack";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { UploadFile } from "antd/lib";
import { PlusOutlined } from "@ant-design/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ModalRequestRefund = ({ return_request_id, refetchListOrder }: any) => {
  const [openModalRejectRequest, setModalOpenRejectRequest] = useState(false);
  const [openModalReturnFail, setOpenModalReturnFail] = useState(false);
  const [reasonRejectRequest, setReasonRejectRequest] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onHandleChangeImage = ({ fileList }: any) => {
    setFileList(fileList); // cập nhật state
  };

  const {
    data: responseDetailRequestRefund,
    isFetching: isLoadingRequestRefund,
    refetch,
  } = useOne({
    resource: "order/return-request",
    id: return_request_id,
    queryOptions: { enabled: !!return_request_id },
  });

  const {
    mutate: acceptedRequestRefund,
    isPending: isPendingAcceptRequestRefund,
  } = useCreate({
    resource: `admin/order/return-request/${return_request_id}/accept`,
  });

  const { mutate: mutateReturnCompleted, isPending: isPendingReturnCompleted } =
    useCreate({
      resource: `admin/order/return-request/${return_request_id}/change-status`,
    });

  const {
    mutate: mutateRejectRequestRefund,
    isPending: isPendingRejectRequestRefund,
  } = useCreate({
    resource: `admin/order/return-request/${return_request_id}/reject`,
  });

  const { mutate: mutateReturnFail, isPending: isPendingReturnFail } =
    useCreate({
      resource: `admin/order/return-request/${return_request_id}/change-status`,
    });

  const onHandleReturnCompleted = (status: any) => {
    mutateReturnCompleted(
      {
        values: { status },
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Cập nhật yêu cầu thành công",
          });
        },
        onSettled: () => {
          refetch();
          refetchListOrder();
        },
      }
    );
  };

  const onHandleAcceptRequestRefund = () => {
    acceptedRequestRefund(
      {
        values: {},
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Cập nhật yêu cầu thành công",
          });
        },
        onSettled: () => {
          refetch();
          refetchListOrder();
        },
      }
    );
  };

  const onHandleRejectRequestRefund = () => {
    if (reasonRejectRequest.length === 0) {
      notification.warning({ message: "Vui lòng nhập lý do" });
      return;
    }

    mutateRejectRequestRefund(
      {
        values: { admin_note: reasonRejectRequest },
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Cập nhật yêu cầu thành công",
          });
          setModalOpenRejectRequest(false);
        },
        onSettled: () => {
          refetch();
          refetchListOrder();
        },
      }
    );
  };

  const onHandleReturnFail = (status: any) => {
    if (reasonRejectRequest.length === 0) {
      notification.warning({ message: "Vui lòng nhập lý do" });
      return;
    }

    if (fileList.length === 0) {
      notification.warning({ message: "Vui lòng upload ảnh" });
      return;
    }

    const formData = new FormData();
    formData.append("admin_note", reasonRejectRequest);
    formData.append("status", status);
    fileList.forEach((image: any, index: any) => {
      formData.append(`media_files[]`, image.originFileObj);
    });

    mutateReturnFail(
      {
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Cập nhật yêu cầu thành công",
          });
          setOpenModalReturnFail(false);
        },
        onSettled: () => {
          refetch();
          refetchListOrder();
        },
      }
    );
  };

  const detailRequestRefund = responseDetailRequestRefund?.data || {};

  return (
    <div className="w-[700px] py-5 px-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold ">Chi tiết hoàn hàng</h1>

        {isLoadingRequestRefund ? (
          <Skeleton active />
        ) : detailRequestRefund?.status === "pending" ? (
          <div className="flex gap-2">
            <Popconfirm
              title="Cập nhật yêu cầu"
              onConfirm={() => onHandleAcceptRequestRefund()}
              description="Bạn có chắc chắn muốn đồng ý yêu cầu không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={isPendingAcceptRequestRefund}
                type="primary"
                className=" !py-5 !px-3 !cursor-pointer"
              >
                Đồng ý
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Cập nhật yêu cầu"
              onConfirm={() => setModalOpenRejectRequest(true)}
              description="Bạn có chắc chắn muốn hủy yêu cầu không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={isPendingRejectRequestRefund}
                variant="solid"
                color="danger"
                className=" !py-5 !px-3 !cursor-pointer"
              >
                Từ chối
              </Button>
            </Popconfirm>
          </div>
        ) : detailRequestRefund?.status === "returning" ? (
          <div className="flex gap-1">
            <Popconfirm
              title="Cập nhật yêu cầu"
              onConfirm={() => onHandleReturnCompleted("return_completed")}
              description="Bạn có chắc chắn muốn đồng ý hoàn hàng không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={isPendingReturnCompleted}
                type="primary"
                className=" !py-5 !px-3 !cursor-pointer"
              >
                Đồng ý
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Cập nhật yêu cầu"
              onConfirm={() => setOpenModalReturnFail(true)}
              description="Bạn có chắc chắn muốn từ chối không?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                loading={isPendingReturnFail}
                variant="solid"
                color="danger"
                className=" !py-5 !px-3 !cursor-pointer"
              >
                Từ chối
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ""
        )}
      </div>
      {isLoadingRequestRefund ? (
        <Skeleton active />
      ) : (
        <div>
          <div className="grid grid-cols-3 mb-5">
            <div>
              <div className="text-gray-500">Mã đơn hàng</div>
              <div>{detailRequestRefund.order_code}</div>
            </div>
            <div>
              <div className="text-gray-500">Trạng thái yêu cầu</div>
              {detailRequestRefund?.status === "accepted" ? (
                <Tag color="green" className="font-bold">
                  Đã duyệt
                </Tag>
              ) : detailRequestRefund?.status === "pending" ? (
                <Tag color="orange" className="font-bold">
                  Đang xử lý
                </Tag>
              ) : detailRequestRefund?.status === "rejected" ? (
                <Tag color="red" className="font-bold">
                  Từ chối
                </Tag>
              ) : detailRequestRefund?.status === "canceled" ? (
                <Tag color="red" className="font-bold">
                  Đã hủy
                </Tag>
              ) : detailRequestRefund?.status === "returning" ? (
                <Tag color="orange" className="font-bold">
                  Đang giao hoàn hàng
                </Tag>
              ) : detailRequestRefund?.status === "return_completed" ? (
                <Tag color="green" className="font-bold">
                  Hoàn hàng thành công
                </Tag>
              ) : (
                <Tag color="red" className="font-bold">
                  Hoàn hàng thất bại
                </Tag>
              )}
            </div>
            <div>
              <div className="text-gray-500">Ngày tạo</div>
              <div>{detailRequestRefund.created_at}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 mb-5">
            <div className="col-span-1">
              <div>
                <div className="text-gray-500">Lý do hoàn hàng</div>
                <div>{detailRequestRefund?.reason}</div>
              </div>
            </div>
            <div className="col-span-1">
              <div>
                <div className="text-gray-500">Ảnh sản phẩm</div>
                <div className="flex items-center gap-1">
                  {detailRequestRefund?.client_media_files?.image?.map(
                    (image: string, idx: number) => (
                      <Image
                        key={idx}
                        className="!border-none  !h-[50px] !rounded-none !w-[50px]  !object-cover !object-center"
                        src={image}
                        alt="Ảnh preview"
                        preview
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {detailRequestRefund?.shipping_label_image && (
              <div className="col-span-1">
                <div>
                  <div className="text-gray-500">Ảnh vận đơn</div>
                  <div>
                    <Image
                      className="!border-none  !h-[50px] !rounded-none !w-[50px]  !object-cover !object-center"
                      src={detailRequestRefund?.shipping_label_image}
                      alt="Ảnh preview"
                      preview
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 mb-5">
            {detailRequestRefund?.admin_note && (
              <div className="col-span-1">
                <div className="text-gray-500">Lý do </div>
                <div>{detailRequestRefund?.reason}</div>
              </div>
            )}

            {detailRequestRefund?.admin_media_files?.image.length > 0 && (
              <div className="col-span-2">
                <div className="text-gray-500">
                  Ảnh minh chứng từ chối hoàn hàng
                </div>
                <div className="flex items-center gap-1">
                  {detailRequestRefund?.admin_media_files?.image?.map(
                    (image: string, idx: number) => (
                      <Image
                        key={idx}
                        className="!border-none  !h-[50px] !rounded-none !w-[50px]  !object-cover !object-center"
                        src={image}
                        alt="Ảnh preview"
                        preview
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-300 px-5 py-3 mb-5">
            <p className="font-semibold mb-5">Sản phẩm hoàn hàng</p>
            <div className="flex flex-col gap-2">
              {detailRequestRefund?.items.map((item: any) => (
                <div key={item?.id} className="flex items-stretch">
                  <ImageWithFallback src={item?.image} width={60} height={60} />
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">
                      {item.name_product}{" "}
                      <span className="font-normal  text-xs">
                        - {item?.color}/{item?.size}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Số lượng hoàn: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Modal
            open={openModalRejectRequest}
            okText="Xác nhận"
            cancelText="Hủy"
            onOk={onHandleRejectRequestRefund}
            onCancel={() => {
              setModalOpenRejectRequest(false);
            }}
            title="Lý do từ chối"
            confirmLoading={isPendingRejectRequestRefund}
          >
            <TextArea
              onChange={(e) => setReasonRejectRequest(e.target.value)}
            ></TextArea>
          </Modal>

          <Modal
            open={openModalReturnFail}
            okText="Xác nhận"
            cancelText="Hủy"
            onOk={() => onHandleReturnFail("return_failed")}
            onCancel={() => {
              setOpenModalReturnFail(false);
            }}
            title="Lý do từ chối"
            confirmLoading={isPendingReturnFail}
          >
            <TextArea
              className="!mb-3"
              onChange={(e) => setReasonRejectRequest(e.target.value)}
            ></TextArea>

            <Upload
              maxCount={5}
              className="!mb-3"
              // multiple
              onChange={onHandleChangeImage}
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false} // không upload ngay, giữ file trong state
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Modal>
        </div>
      )}
    </div>
  );
};
export default ModalRequestRefund;
