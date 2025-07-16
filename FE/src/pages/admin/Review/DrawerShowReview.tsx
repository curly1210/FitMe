/* eslint-disable @typescript-eslint/no-explicit-any */
import { useList } from "@refinedev/core";
import { Button, Drawer, Pagination, Skeleton } from "antd";
import { useEffect, useState } from "react";
import CardReview from "./CardReview";

interface DrawerShowReviewProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
  product?: any; // Optional, if you want to pass product details
}

const DrawerShowReview = ({
  open,
  onClose,
  productId,
  product,
}: DrawerShowReviewProps) => {
  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [pageSizeReviews, setPageSizeReviews] = useState(10);

  const {
    data: reviewsResponse,
    isLoading,
    refetch: refetchListReviews,
  } = useList({
    resource: `admin/reviews/get-detail/${productId}`,
    queryOptions: { enabled: !!productId && open },
    pagination: { mode: "off" },
    filters: [
      { field: "per_page", operator: "eq", value: pageSizeReviews },
      { field: "page", operator: "eq", value: currentPageReview },
    ],
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Khóa cuộn nền
    } else {
      document.body.style.overflow = "auto"; // Mở lại khi Drawer đóng
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const reviews = reviewsResponse?.data?.data || [];

  const totalReviews = reviewsResponse?.data?.meta?.total || 0;

  const handlePageReviewsChange = (page: number, pageSize?: number) => {
    setCurrentPageReview(page);
    if (pageSize) setPageSizeReviews(pageSize);
  };

  return (
    <div>
      <Drawer
        title="Đánh giá sản phẩm"
        placement="right"
        width={800}
        onClose={onClose}
        // getContainer={false}
        open={open}
        footer={
          <div className="text-right">
            <Button onClick={onClose}>Đóng</Button>
          </div>
        }
      >
        {isLoading || !reviews ? (
          <Skeleton active />
        ) : (
          <div className="space-y-5">
            {/* Thông tin sản phẩm */}
            <div className="flex gap-4 items-start">
              <img
                src={product?.product_images}
                className="w-32 h-32 object-cover rounded border"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{product?.name}</h2>

                <p className="text-sm text-gray-600">
                  Tồn kho: {product?.total_inventory}
                </p>
              </div>
            </div>

            {/* Bình luận */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Đánh giá:</h3>
              {reviews?.map((review: any) => (
                <CardReview
                  key={review?.id}
                  refetchListReviews={refetchListReviews}
                  review={review}
                />
              ))}

              <div className="flex justify-center ">
                <Pagination
                  current={currentPageReview}
                  pageSize={pageSizeReviews}
                  total={totalReviews}
                  onChange={handlePageReviewsChange}
                  style={{ marginTop: 16, textAlign: "right" }}
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
export default DrawerShowReview;
