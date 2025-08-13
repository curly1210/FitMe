/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNotificationUser } from "../../../hooks/userNotificationUser";
import { useCreate, useCustom } from "@refinedev/core";
import { notification, Pagination, Spin } from "antd";
import { useAuthen } from "../../../hooks/useAuthen";
import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số item mỗi trang
  const { unread, refetchUserUnreadNotifications } = useNotificationUser();
  const { accessToken } = useAuthen();
  const [userAllNotifications, setUserAllNotifications] = useState<any>([]);

  // const navigate = useNavigate();

  const {
    data: responseUserAllNotifications,
    isFetching: isLoadingUserAllNotications,
    refetch: refetchUserAllNotifications,
  } = useCustom({
    method: "get",
    url: "notifications",
    config: {
      query: {
        page: currentPage,
        per_page: pageSize,
      },
    },
    queryOptions: {
      enabled: !!accessToken, // Chỉ chạy khi accessToken tồn tại
      onSuccess: (data) => {
        setUserAllNotifications(data?.data?.notifications ?? []);
      },
    },
  });

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const { mutate: markAllRead } = useCreate({
    resource: "notifications/read-all",
  });

  const handleMarkAllRead = () => {
    // console.log("Đánh dấu tất cả thông báo đã đọc");
    console.log(unread);
    if (unread === 0) return; // nếu không có thông báo thì không làm gì
    // Gọi API đánh dấu tất cả thông báo đã đọc
    markAllRead(
      { values: {} },
      {
        onSuccess: () => {
          // refetchUserNotifications();
          refetchUserUnreadNotifications();
          refetchUserAllNotifications();
          notification.success({
            message: "Đánh dấu tất cả thông báo đã đọc thành công",
          });
        },
        onError: (_error) => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
      }
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Thông báo</h1>

      <p
        onClick={handleMarkAllRead}
        className="cursor-pointer hover:underline text-blue-500 text-right mb-5"
      >
        Đánh dấu tất cả đã đọc
      </p>

      {isLoadingUserAllNotications ? (
        <div className="w-full h-[200px] relative flex items-center justify-center">
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center "
            style={{ textAlign: "center" }}
            size="large"
          />
        </div>
      ) : userAllNotifications.length === 0 ? (
        <div>Không có thông báo</div>
      ) : (
        <div>
          {userAllNotifications.map((noti: any) => (
            <div key={noti?.id} className="flex justify-between mb-3 ">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{noti?.data.icon}</div>
                <p>-</p>
                <div
                  className={`ml-2 flex flex-col ${
                    noti?.read_at ? "opacity-80" : ""
                  }`}
                >
                  <span className={`${noti?.read_at ? "" : "font-semibold"}`}>
                    Đơn hàng{" "}
                    <span className="text-red-500 font-semibold">
                      #{noti.data?.order_id}
                    </span>{" "}
                    {noti.data?.message}
                  </span>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(noti?.created_at)}
                  </div>
                </div>
              </div>
              {noti?.read_at ? (
                ""
              ) : (
                <p className="text-6xl text-blue-500">&bull;</p>
              )}
            </div>
          ))}
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={responseUserAllNotifications?.data?.total || 0}
              // showSizeChanger
              onChange={handlePageChange}
              style={{ marginTop: 16, textAlign: "right" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Notification;
