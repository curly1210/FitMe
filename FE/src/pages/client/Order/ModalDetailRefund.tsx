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
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ModalDetailRefund = ({ return_request_id, refetchDetailOrder }: any) => {
  const {
    data: productDetailRequestRefund,
    isLoading: isLoadingRequestRefund,
    refetch,
  } = useOne({
    resource: "order/return-request",
    id: return_request_id,
    queryOptions: { enabled: !!return_request_id },
  });

  const [openModalShippingImage, setOpenModalShippingImage] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const

  // const {} = useModal();

  // console.log(productDetailRequestRefund  );

  const {
    mutate: cancelRequestRefund,
    isPending: isPendingCancelRequestRefund,
  } = useCreate({
    resource: `order/return-request/cancel/${return_request_id}`,
  });

  const onHandleCancelRequestRefund = () => {
    cancelRequestRefund(
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
            message: "Hủy yêu cầu thành công",
          });
        },
        onSettled: () => {
          refetch();
        },
      }
    );
  };

  const onHandleChangeImage = ({ fileList }: any) => {
    setFileList(fileList); // cập nhật state
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      return notification.warning({
        message: "Vui lòng chọn ảnh trước khi upload",
      });
    }

    const formData = new FormData();

    if (fileList[0].originFileObj) {
      formData.append("shipping_label_image", fileList[0].originFileObj);
      console.log(fileList[0].originFileObj);
    } else {
      notification.error({
        message: "Không thể lấy file ảnh để upload",
      });
      return;
    }

    addImageShippingLabel(
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
            message: "Gửi yêu cầu thành công",
          });
          setOpenModalShippingImage(false);
          // openModal(<ReviewProducts orderId={review?.order_id} />);
        },
        onSettled: () => {
          refetch();
          refetchDetailOrder();
        },
      }
    );
  };

  const {
    mutate: addImageShippingLabel,
    isPending: isPendingAddImageShippingLabel,
  } = useCreate({
    resource: `order/return-request/update-shipping-label-image/${return_request_id}`,
  });

  const detailRequestRefund = productDetailRequestRefund?.data || {};

  return (
    <div className="w-[700px] py-5 px-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold ">Chi tiết hoàn hàng</h1>

        {isLoadingRequestRefund ? (
          <Skeleton active />
        ) : detailRequestRefund?.status === "pending" ? (
          <Popconfirm
            title="Cập nhật yêu cầu"
            onConfirm={() => onHandleCancelRequestRefund()}
            description="Bạn có chắc chắn muốn hủy yêu cầu không?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              loading={isPendingCancelRequestRefund}
              className="!text-white !bg-black !rounded-none !border-2 !border-black !py-5 !px-3 !cursor-pointer"
            >
              HỦY YÊU CẦU
            </Button>
          </Popconfirm>
        ) : detailRequestRefund?.status === "accepted" ? (
          <Button
            onClick={() => setOpenModalShippingImage(true)}
            loading={isPendingAddImageShippingLabel}
            className="!text-white !bg-black !rounded-none !border-2 !border-black !py-5 !px-3 !cursor-pointer"
          >
            GỬI VẬN ĐƠN
          </Button>
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
              <div>
                <div className="text-gray-500">Lý do</div>
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
        </div>
      )}

      <Modal
        open={openModalShippingImage}
        okText="Xác nhận"
        cancelText="Hủy"
        onOk={handleUpload}
        onCancel={() => {
          setOpenModalShippingImage(false);
        }}
        title="Upload ảnh vận đơn"
        confirmLoading={isPendingAddImageShippingLabel}
      >
        <Upload
          maxCount={1}
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
  );
};
export default ModalDetailRefund;
