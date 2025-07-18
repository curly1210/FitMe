/* eslint-disable @typescript-eslint/no-explicit-any */
import { useModal } from "../../../hooks/useModal";
import ModalAddReview from "./ModalAddReview";
// import ModalAddReview from "./ModalAddReview";
import ShowReview from "./ShowReview";

type Review = {
  id: string | number;
  product_image: string;
  product_name: string;
  color?: string;
  size?: string;
  is_review?: any; // Thêm trường này để xác định đã đánh giá hay chưa
  order_id?: any; // Thêm order_id nếu cần
};

interface ReviewEachProductProps {
  review: Review;
}

const ReviewEachProduct = ({ review }: ReviewEachProductProps) => {
  // const [rating, setRating] = useState(0); // Giá trị đã chọn
  // const [hover, setHover] = useState(0);
  const { openModal } = useModal();
  return (
    <div>
      <div key={review.id}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-start gap-3">
            <img
              src={review.product_image}
              // alt={review.product_name}
              className="w-16 h-16 object-cover"
            />
            <div className="flex flex-col ">
              <p className="font-semibold">{review.product_name}</p>
              <div className="flex text-sm text-gray-500">
                {review?.color} - {review?.size}
              </div>
            </div>
          </div>
          <div>
            {review?.is_review ? (
              <button
                onClick={() => {
                  openModal(
                    <ShowReview
                      review_id={review?.is_review}
                      order_id={review?.order_id}
                    />
                  );
                }}
                className="text-white bg-black py-2 px-3 cursor-pointer"
              >
                XEM ĐÁNH GIÁ
              </button>
            ) : (
              <button
                onClick={() => {
                  openModal(<ModalAddReview review={review} />);
                  // openModal(<ShowReview />);
                }}
                className="text-white bg-black py-2 px-3 cursor-pointer"
              >
                ĐÁNH GIÁ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewEachProduct;
