import { UploadOutlined } from "@ant-design/icons";
import { Button, notification, Spin, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadFile } from "antd/lib";
import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import { useModal } from "../../../hooks/useModal";
import ShowReview from "./ShowReview";
import { useCreate } from "@refinedev/core";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ModalEditReview = ({
  review,
  orderId,
}: {
  review: any;
  orderId: any;
}) => {
  const [rating, setRating] = useState<any>(Number(review?.rate)); // Giá trị đã chọn
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState(review?.content || "");
  const [fileList, setFileList] = useState(review?.review_images || []);

  const [errStar, setErrStar] = useState("");
  const [errContent, setErrContent] = useState("");
  const [errImage, setErrImage] = useState("");

  const { openModal } = useModal();

  const onHandleChangeImage = (info: { fileList: UploadFile[] }) => {
    // const formattedList = info.fileList.map((file) => {
    //   return {
    //     uid: file.uid,
    //     url: file.url ?? file.originFileObj, // nếu đã có url thì lấy, nếu chưa thì lấy file local
    //   };
    // });
    // // console.log(info.fileList.length);
    // // const newFile = info.fileList[info.fileList.length - 1].originFileObj;

    // // const updateFileList = { ...fileList, url: newFile };
    // console.log(formattedList);
    setFileList(info.fileList); // cập nhật state
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

    const formattedFileList = fileList.map((file: any) => {
      return {
        url: file.url ?? file.originFileObj, // nếu đã có url thì lấy, nếu chưa thì lấy file local
      };
    });

    const formDataRequest = new FormData();

    formDataRequest.append("rate", rating);
    formDataRequest.append("content", content);

    formattedFileList.forEach((image: any, index: any) => {
      formDataRequest.append(`review_images[${index}][url]`, image.url);
    });

    mutateReview(
      {
        resource: `reviews/update/${review?.id}`,
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
          openModal(<ShowReview order_id={orderId} review_id={review?.id} />);
        },
      }
    );

    // console.log("không lỗi");
  };
  return (
    <div>
      <div>
        <div className="w-[700px] py-5 px-6">
          <h1 className="text-2xl font-semibold mb-5">
            Cập nhật đánh giá sản phẩm
          </h1>
          <div className="flex items-start gap-3 mb-5">
            <img
              src={review?.product?.image_product}
              // alt={review.product_name}
              className="w-16 h-16 object-cover"
            />
            <div className="flex flex-col ">
              <p className="font-semibold">{review?.product?.product_name}</p>
              <div className="flex text-sm text-gray-500">
                {review?.product.color} - {review?.product.size}
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
              fileList={fileList}
            >
              <Button
                type="primary"
                className="!text-xs"
                icon={<UploadOutlined />}
              >
                Thêm ảnh
              </Button>
            </Upload>
            <p className="text-sm text-red-500">{errImage}</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                // openModal(<ReviewProducts orderId={orderId} />);
                openModal(
                  <ShowReview order_id={orderId} review_id={review?.id} />
                );
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
    </div>
  );
};
export default ModalEditReview;
