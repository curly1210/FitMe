/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import ReviewProducts from "./ReviewProducts";
import { useModal } from "../../../hooks/useModal";

const RenderReviewButton = ({ order }: { order: any }) => {
  const { openModal } = useModal();

  const onHandleShowReview = (orderId: number) => {
    openModal(<ReviewProducts orderId={orderId} />);
  };

  if (!order.success_at) return null;

  const diffDays = dayjs().diff(dayjs(order.success_at), "day");

  if (diffDays <= 7) {
    if (order?.reviewed_count === order?.total_amount_items) {
      return (
        <button
          onClick={() => onHandleShowReview(order?.id)}
          className="text-white bg-black py-2 px-3 cursor-pointer"
        >
          XEM ĐÁNH GIÁ
        </button>
      );
    } else {
      return (
        <button
          onClick={() => onHandleShowReview(order?.id)}
          className="text-white bg-black py-2 px-3 cursor-pointer"
        >
          ĐÁNH GIÁ
        </button>
      );
    }
  } else {
    if (order?.reviewed_count !== 0) {
      return (
        <button
          onClick={() => onHandleShowReview(order?.id)}
          className="text-white bg-black py-2 px-3 cursor-pointer"
        >
          XEM ĐÁNH GIÁ
        </button>
      );
    } else {
      return null;
    }
  }
};
export default RenderReviewButton;
