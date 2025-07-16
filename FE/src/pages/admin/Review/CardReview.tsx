/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import StarRating from "../../../utils/StarRating";
import { ImReply } from "react-icons/im";
import { useCreate, useDelete, useUpdate } from "@refinedev/core";
import { Button, notification, Popconfirm, Spin } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";

const CardReview = ({
  review,
  refetchListReviews,
}: {
  review: any;
  refetchListReviews: any;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditReplyForm, setShowEditReplyForm] = useState(false);
  const [reply, setReply] = useState("");
  const [errReply, setErrReply] = useState("");

  const [editReply, setEditReply] = useState(review?.replies[0]?.content || "");
  const [errEditReply, setEditErrReply] = useState("");

  const { mutate: createReply, isPending: isPendingCreateReply } = useCreate({
    resource: "admin/reviews/reply/create",
  });

  const { mutate: deleteReply, isPending: isPendingDeleteReply } = useDelete();

  const { mutate: updateReply, isPending: isPendingEditReply } = useUpdate();

  const handleReplySubmit = async () => {
    setErrReply("");

    if (!reply) {
      setErrReply("Vui lòng nhập phản hồi !");
      return;
    }

    createReply(
      { values: { review_id: review.id, content: reply } },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
          // console.log("Error creating reply");
        },
        onSuccess: () => {
          notification.success({
            message: "Phản hồi thành công",
          });
          setShowReplyForm(false);
          refetchListReviews();
        },
      }
    );
  };

  const handleDeleteReply = (replyId: number) => {
    deleteReply(
      { resource: "admin/reviews/reply/delete", id: replyId },
      {
        onSuccess: () => {
          notification.success({
            message: "Xóa phản hồi thành công",
          });
          refetchListReviews();
        },
        onError: () => {
          notification.error({
            message: "Xóa phản hồi thất bại",
          });
        },
      }
    );
  };

  const handleEditReplySubmit = async (replyId: number) => {
    setEditErrReply("");

    if (!editReply) {
      setEditErrReply("Vui lòng nhập phản hồi !");
      return;
    }

    updateReply();

    updateReply(
      {
        resource: "admin/reviews/reply/update",
        id: replyId,
        values: { content: editReply },
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Phản hồi thành công",
          });
          setShowEditReplyForm(false);
          refetchListReviews();
        },
      }
    );
  };

  return (
    <div className="border-b-[1px] border-gray-300 ">
      <div className="flex gap-4 px-5 mb-8 mt-8">
        <div>
          <img
            src={review?.user?.avatar}
            className="w-8 h-8 rounded-full"
            alt=""
          />
        </div>
        <div className="flex flex-col gap-5 grow">
          <div className="flex flex-col gap-[2px]">
            <p>{review?.user?.name}</p>
            <div className="flex">
              <StarRating rating={Number(review?.rate)} />
              {/* <StarRating rating={review.rate} /> */}
            </div>
            <p className="text-gray-500">{review?.updated_at}</p>
          </div>
          <p className="text-justify">{review?.content}</p>
          <div className="flex gap-3">
            {review?.review_images?.map((image: any) => (
              <img
                key={image?.id}
                src={image?.url}
                className="block w-[80px] h-[80px] object-cover"
              />
            ))}
          </div>

          {review?.replies?.length > 0 ? (
            <>
              {showEditReplyForm ? (
                <div className="mt-2">
                  <textarea
                    value={editReply}
                    onChange={(e) => setEditReply(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="w-full border rounded p-2 text-sm"
                  />
                  <p className="text-sm text-red-500">{errEditReply}</p>
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      onClick={() => setShowEditReplyForm(false)}
                      className="text-sm text-gray-500 cursor-pointer"
                    >
                      Huỷ
                    </button>
                    <Button
                      className="!bg-black !text-white !px-3 !py-2 !rounded !text-sm !cursor-pointer"
                      onClick={() =>
                        handleEditReplySubmit(review?.replies[0].id)
                      }
                      loading={isPendingEditReply}
                    >
                      Gửi phản hồi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-3 px-3 bg-gray-100">
                  <p className="mb-3 ">Phản hồi của Shop :</p>
                  <p className="text-gray-700 mb-3">
                    {review?.replies[0].content}
                  </p>
                  <div className="flex gap-3">
                    <Popconfirm
                      okText="Đồng ý"
                      cancelText="Không"
                      title="Xóa phản hồi"
                      description="Bạn có muốn xóa phản hồi này không?"
                      onConfirm={() => handleDeleteReply(review?.replies[0].id)}
                    >
                      <FaTrash className="text-lg text-red-400 cursor-pointer" />
                    </Popconfirm>
                    <FaEdit
                      onClick={() => setShowEditReplyForm(true)}
                      className="text-lg text-blue-400 cursor-pointer"
                    />
                    {/* <p className="underline cursor-pointer">Xóa</p>
                // <p className="underline cursor-pointer">Sửa</p> */}
                  </div>
                  {isPendingDeleteReply && (
                    <Spin
                      className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
                      style={{ textAlign: "center" }}
                      size="large"
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {showReplyForm ? (
                <div className="mt-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="w-full border rounded p-2 text-sm"
                  />
                  <p className="text-sm text-red-500">{errReply}</p>
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      onClick={() => setShowReplyForm(false)}
                      className="text-sm text-gray-500 cursor-pointer"
                    >
                      Huỷ
                    </button>
                    <Button
                      className="!bg-black !text-white !px-3 !py-2 !rounded !text-sm !cursor-pointer"
                      onClick={handleReplySubmit}
                      loading={isPendingCreateReply}
                    >
                      Gửi phản hồi
                    </Button>
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CardReview;
