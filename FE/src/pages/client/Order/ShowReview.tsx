/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOne } from "@refinedev/core";
import StarRating from "../../../utils/StarRating";
import { Spin } from "antd";
import { useModal } from "../../../hooks/useModal";
import ReviewProducts from "./ReviewProducts";
import ModalEditReview from "./ModalEditReview";
import ImageWithFallback from "../../../components/ImageFallBack";

const ShowReview = ({
  review_id,
  order_id,
}: {
  review_id: any;
  order_id: any;
}) => {
  const { openModal } = useModal();

  const {
    data: reviewResponse,
    isLoading: isLoadingReview,
    // refetch: refetchReviews,
  } = useOne({
    resource: "reviews/edit",
    id: review_id,
    queryOptions: {
      enabled: !!review_id, // Không gọi API khi chưa có review_id
    },
  });
  const review = reviewResponse?.data;

  // console.log(review);

  return (
    <div>
      <div className="w-[700px] py-5 px-6">
        <h1 className="text-2xl font-semibold mb-5">Đánh giá sản phẩm</h1>
        {isLoadingReview ? (
          <Spin
            className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <div>
            <div className="flex items-start gap-3 mb-5">
              <ImageWithFallback
                src={review?.product?.image_product}
                width={64}
                height={64}
              />

              <div className="flex flex-col ">
                <p className="font-semibold">{review?.product?.product_name}</p>
                <div className="flex text-sm text-gray-500">
                  {review?.product?.color} - {review?.product?.size}
                </div>
              </div>
              {!review?.is_update && review?.product?.product_item_id && (
                <button
                  onClick={() =>
                    openModal(
                      <ModalEditReview review={review} orderId={order_id} />
                    )
                  }
                  className="px-2 border border-red-500 text-red-500 cursor-pointer"
                >
                  Sửa
                </button>
              )}
              {/* <button
                onClick={() =>
                  openModal(
                    <ModalEditReview review={review} orderId={order_id} />
                  )
                }
                className="px-2 border border-red-500 text-red-500 cursor-pointer"
              >
                Sửa
              </button> */}
            </div>
            <div className="flex gap-4 px-5 my-8">
              <div>
                {/* <ImageWithFallback src={review?.user?.avatar} /> */}
                <img
                  src={review?.user?.avatar}
                  className="w-8 h-8 rounded-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-[2px]">
                  <p>{review?.user?.name}</p>
                  <div className="flex">
                    <StarRating rating={review?.rate} />
                  </div>
                  <p className="text-gray-500">{review?.updated_at}</p>
                </div>
                <p className="text-justify">{review?.content}</p>
                <div className="flex gap-3">
                  {review?.review_images?.map((image: any, index: any) => (
                    // <ImageWithFallback
                    //   key={image?.id}
                    //   src={image?.url}
                    //   width={80}
                    //   height={80}
                    // />
                    <img
                      // key={image?.id}
                      key={index}
                      src={image?.url}
                      className="block w-[80px] h-[80px] object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  openModal(<ReviewProducts orderId={order_id} />);
                }}
                className="border-2 py-2 px-3 font-semibold cursor-pointer "
              >
                TRỞ LẠI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShowReview;
