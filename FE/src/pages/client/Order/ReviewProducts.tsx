/* eslint-disable @typescript-eslint/no-explicit-any */
import { useList } from "@refinedev/core";
import { Spin } from "antd";
import ReviewEachProduct from "./ReviewEachProduct";
import dayjs from "dayjs";

// interface ReviewProductProps {
//   review: {
//     id: string | number;
//     product_image: string;
//     product_name: string;
//     color?: string;
//     size?: string;
//     // Add other fields as needed
//   };
// }

const ReviewProducts = ({ orderId }: any) => {
  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
    // refetch: refetchReviews,
  } = useList({
    resource: "getProductsNeedReview",
    filters: orderId
      ? [
          {
            field: "order_id",
            operator: "eq",
            value: orderId,
          },
        ]
      : [],
    queryOptions: {
      enabled: !!orderId, // Không gọi API khi chưa có orderId
    },
  });

  return (
    <div className="w-[700px] py-5 px-6">
      <h1 className="text-2xl font-semibold mb-5">Đánh giá sản phẩm</h1>
      {isLoadingReviews && orderId ? (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        <div className="flex flex-col gap-5">
          {reviewsResponse?.data?.map((review: any) =>
            review?.is_review ? (
              <ReviewEachProduct key={review?.id} review={review} />
            ) : (
              review?.success_at &&
              dayjs().diff(dayjs(review?.success_at), "day") <= 7 && (
                <ReviewEachProduct key={review?.id} review={review} />
              )
            )
          )}
        </div>
      )}
    </div>
  );
};
export default ReviewProducts;
