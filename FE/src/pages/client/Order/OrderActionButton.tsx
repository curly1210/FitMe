/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdate } from "@refinedev/core";
import { Button, notification, Popconfirm } from "antd";
import ModalRequestRefundItems from "./ModalRequestRefundItems";
import { useModal } from "../../../hooks/useModal";

const OrderActionButton = ({ order, refetch }: any) => {
  const onHandleChangeStatus = (orderId: number) => {
    mutate({
      id: orderId,
      values: {},
    });
  };

  const { openModal } = useModal();

  const { mutate, isPending: isPendingUpdateStatus } = useUpdate({
    resource: "orders",
    mutationOptions: {
      onSuccess: (response) => {
        refetch();
        notification.success({
          message: `${response?.data?.message}`,
        });
      },
      onError: (error) => {
        refetch();
        notification.error({ message: `${error?.response?.data?.message}` });
      },
    },
  });
  return (
    <>
      {(order.status_name == "Chờ xác nhận" ||
        order.status_name == "Đang chuẩn bị hàng") && (
        <Popconfirm
          title="Cập nhật trạng thái"
          onConfirm={() => onHandleChangeStatus(order.id)}
          description="Bạn có chắc chắn muốn hủy đơn hàng không?"
          okText="Có"
          cancelText="Không"
        >
          <Button
            loading={isPendingUpdateStatus}
            className="!text-white !bg-black !border-2 !border-black !py-5 !px-3 !cursor-pointer"
          >
            HỦY ĐƠN
          </Button>
        </Popconfirm>
      )}

      {order.status_name == "Đã giao hàng" && (
        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              openModal(
                <ModalRequestRefundItems
                  refetch={refetch}
                  idOrder={order?.id}
                />
              )
            }
            className="!text-white !bg-black !border-2 !border-black !py-5 !px-3 !cursor-pointer"
          >
            YÊU CẦU HOÀN HÀNG
          </Button>
          <Popconfirm
            title="Cập nhật trạng thái"
            onConfirm={() => onHandleChangeStatus(order.id)}
            description="Xác nhận nhận hàng thành công?"
            okText="Có"
            cancelText="Không"
          >
            <Button
              loading={isPendingUpdateStatus}
              className="!text-white !bg-black !border-2 !border-black !py-5 !px-3 !cursor-pointer"
            >
              ĐÃ NHẬN HÀNG
            </Button>
          </Popconfirm>
        </div>
      )}
    </>
  );
};
export default OrderActionButton;
