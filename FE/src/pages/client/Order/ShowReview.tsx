import StarRating from "../../../utils/StarRating";

const ShowReview = () => {
  return (
    <div>
      <div className="w-[700px] py-5 px-6">
        <h1 className="text-2xl font-semibold mb-5">Đánh giá sản phẩm</h1>
        <div className="flex items-start gap-3 mb-5">
          <img
            // src={review.product_image}
            // alt={review.product_name}
            className="w-16 h-16 object-cover"
          />
          <div className="flex flex-col ">
            <p className="font-semibold">quan ao</p>
            <div className="flex text-sm text-gray-500">
              Đen - L{/* {review?.color} - {review?.size} */}
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex gap-4 px-5 mb-8 mt-8">
            <div>
              <img src="" className="w-8 h-8 rounded-full" alt="" />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-[2px]">
                <p>tên người dùng</p>
                <div className="flex">
                  <StarRating rating={3} />
                  {/* <StarRating rating={review.rate} /> */}
                </div>
                <p className="text-gray-500">Ngày review</p>
              </div>
              <p className="text-justify">Nội dung content</p>
              <div className="flex gap-3">
                <img
                  // src={image?.url}
                  className="block w-[80px] h-[80px] object-cover"
                />
                <img
                  // src={image?.url}
                  className="block w-[80px] h-[80px] object-cover"
                />
                {/* {review?.review_images?.map((image: any) => (
                    <img
                      key={image?.id}
                      src={image?.url}
                      className="block w-[80px] h-[80px] object-cover"
                    />
                  ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowReview;
