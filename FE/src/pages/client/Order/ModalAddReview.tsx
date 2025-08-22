/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { Button, notification, Spin, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import ReviewProducts from "./ReviewProducts";
import { useModal } from "../../../hooks/useModal";
import { useCreate } from "@refinedev/core";

type Review = {
  id: string | number;
  product_image: string;
  product_name: string;
  color?: string;
  size?: string;
  order_id?: string | number; // Thêm order_id nếu cần
  order_detail_id?: any; // Thêm order_detail_id nếu cần
  product_item_id?: any; // Thêm product_item_id nếu cần
};

interface ReviewEachProductProps {
  review: Review;
}

const ModalAddReview = ({ review }: ReviewEachProductProps) => {
  const [rating, setRating] = useState<any>(0); // Giá trị đã chọn
  const [hover, setHover] = useState(0);

  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState("");

  const [errStar, setErrStar] = useState("");
  const [errContent, setErrContent] = useState("");
  const [errImage, setErrImage] = useState("");

  const { openModal } = useModal();

  const onHandleChangeImage = ({ fileList }: any) => {
    setFileList(fileList.slice(0, 5)); // cập nhật state
  };

  // Hàm xử lý khi người dùng nhấn nút "Đánh giá"
  const { mutate: mutateReview, isPending } = useCreate();

  const onSubmit = () => {
    setErrStar("");
    setErrContent("");
    setErrImage("");

    if (!rating) {
      setErrStar("Vui lòng chọn sao !");
    }
    if (!content) {
      setErrContent("Vui lòng nhập nội dung !");
    }
    if (fileList.length === 0) {
      setErrImage("Vui lòng thêm hình ảnh !");
    }

    if (!rating || !content || fileList.length === 0) {
      return; // Dừng nếu có lỗi
    }

    const formDataRequest = new FormData();

    formDataRequest.append("rate", rating);
    formDataRequest.append("content", content);
    formDataRequest.append("product_item_id", review?.product_item_id);
    formDataRequest.append("order_detail_id", review?.order_detail_id);

    fileList.forEach((image: any, index: any) => {
      formDataRequest.append(
        `review_images[${index}][url]`,
        image.originFileObj
      );
      // if (image.file?.originFileObj) {
      // }
    });

    mutateReview(
      {
        resource: "reviews",
        values: formDataRequest,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onError: () => {
          notification.error({
            message: "Đánh giá thất bại",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Đánh giá thành công",
          });
          openModal(<ReviewProducts orderId={review?.order_id} />);
        },
      }
    );
  };
  return (
    <div>
      <div className="w-[700px] py-5 px-6">
        <h1 className="text-2xl font-semibold mb-5">Đánh giá sản phẩm</h1>
        <div className="flex items-start gap-3 mb-5">
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
        <div className=" mb-3">
          <div className="flex gap-5">
            <p>Chất lượng sản phẩm</p>
            <div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none"
                  >
                    <GoStarFill
                      className={`w-6 h-6 fill-current transition-colors duration-150 ${
                        (hover || rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-red-500">{errStar}</p>
        </div>
        <div className="mb-5">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="!h-28 !mb-1"
            placeholder="Nội dung"
          />
          <p className="text-sm text-red-500">{errContent}</p>
        </div>
        <div className="mb-5">
          <Upload
            className="!mb-1"
            multiple
            beforeUpload={() => false}
            listType="picture-card"
            onChange={onHandleChangeImage}
            maxCount={5}
          >
            {fileList.length >= 5 ? null : (
              <Button
                type="primary"
                className="!text-xs"
                icon={<UploadOutlined />}
              >
                Thêm ảnh
              </Button>
            )}
            {/* <Button
              type="primary"
              className="!text-xs"
              icon={<UploadOutlined />}
            >
              Thêm ảnh
            </Button> */}
          </Upload>
          <p className="text-sm text-red-500">{errImage}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              openModal(<ReviewProducts orderId={review?.order_id} />);
            }}
            className="border-2 py-2 px-3 font-semibold cursor-pointer"
          >
            TRỞ LẠI
          </button>
          <button
            onClick={() => onSubmit()}
            className="text-white bg-black py-2 px-3 cursor-pointer"
          >
            ĐÁNH GIÁ
          </button>
        </div>
      </div>

      {isPending && (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      )}
    </div>
  );
};
export default ModalAddReview;
