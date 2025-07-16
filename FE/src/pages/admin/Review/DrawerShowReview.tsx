import { useList } from "@refinedev/core";
import { Button, Drawer, Skeleton } from "antd";
import { formatCurrencyVND } from "../../../utils/currencyUtils";
import StarRating from "../../../utils/StarRating";
import { useEffect, useState } from "react";
import { ImReply } from "react-icons/im";

interface DrawerShowReviewProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
}

const DrawerShowReview = ({
  open,
  onClose,
  productId,
}: DrawerShowReviewProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const {
    data: reviewsResponse,
    isLoading,
    // refetch,
  } = useList({
    resource: `admin/products/${productId}/comments`,
    queryOptions: {
      enabled: !!productId && open,
    },
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

  const reviews = reviewsResponse?.data || [];

  return (
    <div>
      <Drawer
        title="Đánh giá sản phẩm"
        placement="right"
        width={800}
        onClose={onClose}
        getContainer={false}
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
                // src={product.image}
                className="w-32 h-32 object-cover rounded border"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Sản phẩm mới</h2>
                <p className="text-green-600 font-bold text-lg">
                  {formatCurrencyVND(20000)}
                </p>
                <p className="text-sm text-gray-600">Tồn kho: 18</p>
              </div>
            </div>

            {/* Bình luận */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Đánh giá:</h3>
              <div className="flex gap-4 px-5 mb-8 mt-8">
                <div>
                  <img src="" className="w-8 h-8 rounded-full" alt="" />
                </div>
                <div className="flex flex-col gap-5 grow">
                  <div className="flex flex-col gap-[2px]">
                    <p>Tên người đánh giá</p>
                    <div className="flex">
                      <StarRating rating={4} />
                      {/* <StarRating rating={review.rate} /> */}
                    </div>
                    <p className="text-gray-500">2025/05/23</p>
                  </div>
                  <p className="text-justify">Đây là đánh giá</p>
                  <div className="flex gap-3">
                    <img className="block w-[80px] h-[80px] object-cover" />
                    <img className="block w-[80px] h-[80px] object-cover" />
                    {/* {review?.review_images?.map((image: any) => (
                      <img
                        key={image?.id}
                        src={image?.url}
                        className="block w-[80px] h-[80px] object-cover"
                      />
                    ))} */}
                  </div>
                  {showReplyForm ? (
                    <div className="mt-2">
                      <textarea
                        // value={reply}
                        // onChange={(e) => setReply(e.target.value)}
                        placeholder="Nhập phản hồi..."
                        className="w-full border rounded p-2 text-sm"
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          onClick={() => setShowReplyForm(false)}
                          className="text-sm text-gray-500 cursor-pointer"
                        >
                          Huỷ
                        </button>
                        <button
                          // onClick={handleReplySubmit}
                          className="bg-black text-white px-3 py-2 rounded text-sm cursor-pointer"
                          // disabled={submitting}
                        >
                          Gửi phản hồi
                          {/* {submitting ? "Đang gửi..." : "Gửi phản hồi"} */}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setShowReplyForm(true)}
                      className="flex items-center gap-1 text-gray-400 cursor-pointer"
                    >
                      <p className="text-gray-500">Phản hồi</p>
                      <ImReply />
                    </div>
                    // <button
                    //   onClick={() => setShowReplyForm(true)}
                    //   className="text-sm text-blue-600 mt-2 hover:underline"
                    // >
                    //   Phản hồi ↩
                    // </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
export default DrawerShowReview;
