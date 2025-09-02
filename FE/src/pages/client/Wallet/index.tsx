/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreate, useOne } from "@refinedev/core";
import { useAuthen } from "../../../hooks/useAuthen";
import WalletBalance from "./WalletBalance";
import BankAccountInfor from "./BankAccountInfor";
import { Badge, Dropdown, notification, Skeleton, Spin } from "antd";
import WithDrawHistory from "./WithDrawHistory";
import { useNotificationUser } from "../../../hooks/userNotificationUser";
import { BellOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import logo_F from "../../../assets/images/logo_F.png";
import { useEffect } from "react";

const Wallet = () => {
  const { user, accessToken } = useAuthen();

  const {
    unread,
    userUnreadNotifications,
    refetchUserUnreadNotifications,
    isLoadingUserNotications,
    echo,
  } = useNotificationUser();

  const {
    data: walletResponse,
    isFetching,
    refetch: refetchGetWallet,
  } = useOne({
    resource: "wallet",
    id: "",
  });

  const navigate = useNavigate();

  const { mutate: markAllRead } = useCreate({
    resource: "notifications/read-all",
  });

  const handleMarkAllRead = () => {
    if (unread === 0) return; // nếu không có thông báo thì không làm gì

    // Gọi API đánh dấu tất cả thông báo đã đọc
    markAllRead(
      { values: {} },
      {
        onSuccess: () => {
          refetchUserUnreadNotifications();
          // notification.success({
          //   message: "Đánh dấu tất cả thông báo đã đọc thành công",
          // });
        },
        onError: (_error) => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
      }
    );
  };

  useEffect(() => {
    let isMounted = true;

    if (!echo) return;
    const channelName = `App.Models.User.${user?.id}`;
    const channel = echo.private(channelName);

    channel.listen(".order", (e: any) => {
      if (isMounted) {
        refetchGetWallet();
      }
    });

    return () => {
      isMounted = false; // chỉ tắt logic, không hủy listener
    };
  }, [echo, user?.id]);

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
        {isFetching ? (
          <Skeleton active />
        ) : (
          <div>
            <header className="flex justify-between items-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Lịch sử ví
              </h1>
              <Link to={"/"}>
                <img width={30} src={logo_F} alt="" />
              </Link>
              <div className="flex items-center gap-1">
                <span className="text-right text-sm font-medium text-gray-700 hidden sm:block mr-3">
                  {user?.name}
                </span>
                <img
                  src={user?.avatar}
                  alt={`Ảnh đại diện của ${user?.name}`}
                  className="w-10 h-10  rounded-full object-cover object-center border-2 border-white shadow-sm"
                />
                {accessToken && (
                  <Dropdown
                    // menu={{
                    //   items: itemsNotifications,
                    //   // onClick: handleUserNotificationClick,
                    // }}
                    trigger={["click"]}
                    placement="bottomCenter"
                    dropdownRender={(_menu) =>
                      isLoadingUserNotications ? (
                        <div className="w-[300px] h-[100px] bg-white shadow-lg  rounded relative">
                          <Spin
                            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center "
                            style={{ textAlign: "center" }}
                            size="large"
                          />
                        </div>
                      ) : (
                        <div className=" bg-white  rounded py-1 shadow-lg text-base">
                          {userUnreadNotifications.length === 0 ? (
                            <div className="flex flex-col gap-2 items-center w-[300px] mb-4">
                              <svg
                                viewBox="0 0 112 112"
                                width="80"
                                height="80"
                                // class="x14rh7hd x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                                // style="--x-color: var(--primary-icon);"
                              >
                                <rect
                                  width="18.98"
                                  height="18.98"
                                  x="34.96"
                                  y="82"
                                  fill="#1876f2"
                                  rx="9.49"
                                  transform="rotate(-15 44.445 91.471)"
                                ></rect>
                                <circle
                                  cx="43.01"
                                  cy="26.27"
                                  r="6.85"
                                  fill="#64676b"
                                ></circle>
                                <path
                                  fill="#a4a7ab"
                                  d="M75.28 43.44a26.72 26.72 0 1 0-51.62 13.83L30 81l51.62-13.87z"
                                ></path>
                                <path
                                  fill="#a4a7ab"
                                  d="M90.78 75.64 26.33 92.9l3.22-13.63 51.62-13.83 9.61 10.2z"
                                ></path>
                                <rect
                                  width="66.91"
                                  height="8.88"
                                  x="25.35"
                                  y="80.75"
                                  fill="#a4a7ab"
                                  rx="4.44"
                                  transform="rotate(-15 58.793 85.207)"
                                ></rect>
                              </svg>
                              <div className="text-[#65686C] font-bold text-xl">
                                Bạn không có thông báo nào mới
                              </div>
                            </div>
                          ) : (
                            <div className="max-h-[500px] overflow-y-auto ">
                              {userUnreadNotifications.map(
                                (noti: any, index: any) => (
                                  <div
                                    key={index}
                                    className="px-4 py-[6px] hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <span className="text-xl">
                                      {noti.data?.icon} -{" "}
                                    </span>
                                    <span
                                      // className="text-base"
                                      dangerouslySetInnerHTML={{
                                        __html: noti.data?.message,
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          <div className="flex justify-between text-sm  px-4 py-[6px] text-blue-500">
                            <span
                              onClick={handleMarkAllRead}
                              className="cursor-pointer hover:underline "
                            >
                              Đánh dấu tất cả đã đọc
                            </span>
                            <span
                              onClick={() => navigate("/account/notifications")}
                              className="cursor-pointer hover:underline "
                            >
                              Xem tất cả
                            </span>
                          </div>
                        </div>
                      )
                    }
                  >
                    <Badge count={unread} showZero>
                      <BellOutlined className="text-[20px] cursor-pointer " />
                    </Badge>
                  </Dropdown>
                )}
              </div>
            </header>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <WalletBalance
                walletResponse={walletResponse}
                balance={walletResponse?.data.balance}
                // onWithdraw={handleOpenWithdrawalModal}
              />
              <BankAccountInfor
                refetchGetWallet={refetchGetWallet}
                bankAccount={walletResponse?.data?.bank_account}
                // onManageAccount={handleOpenBankAccountModal}
              />

              <WithDrawHistory />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Wallet;
