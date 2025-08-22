/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-sparse-arrays */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from "@ant-design/icons";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useAuthen } from "../../hooks/useAuthen";
import { useOne } from "@refinedev/core";
import { Progress, Spin } from "antd";
import { formatCurrencyVND } from "../../utils/currencyUtils";
import { useNotificationUser } from "../../hooks/userNotificationUser";
import { useEffect } from "react";

const rankLabels = {
  bronze: {
    label: "2tr",
    target: 2000000,
    name: "ĐỒNG",
    color: "from-[#cd7f32] to-[#a97142]",
  },
  silver: {
    label: "5tr",
    target: 5000000,
    name: "BẠC",
    color: "from-gray-300 to-gray-500",
  },
  gold: {
    label: "10tr",
    target: 10000000,
    name: "VÀNG",
    color: "from-[#FFD700] to-[#FFC107]",
  },
  diamond: {
    label: "0",
    target: 1,
    name: "KIM CƯƠNG",
    color: "from-cyan-300 to-blue-600",
  },

  // diamond: "Kim cương",
};

const LayoutInforUser = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuthen();

  const { echo } = useNotificationUser();

  const {
    data: memberResponse,
    isLoading,
    refetch,
  } = useOne({
    resource: "get-rank",
    id: "",
  });

  useEffect(() => {
    let isMounted = true;

    if (!echo) return;
    const channelName = `App.Models.User.${user?.id}`;
    const channel = echo.private(channelName);

    channel.listen(".order", (e: any) => {
      if (isMounted) {
        refetch();
      }
    });

    return () => {
      isMounted = false; // chỉ tắt logic, không hủy listener
    };
  }, [echo, user?.id]);

  // console.log(user);

  let pageTitle = "";
  if (path.includes("address")) {
    pageTitle = "Địa chỉ";
  } else if (path.includes("product-like")) {
    pageTitle = "Sản phẩm yêu thích";
  } else if (path.includes("order")) {
    pageTitle = "Đơn hàng";
  } else if (path.includes("user-info")) {
    pageTitle = "Thông tin tài khoản";
  } else if (path.includes("change-password")) {
    pageTitle = "Đổi mật khẩu";
  } else if (path.includes("notifications")) {
    pageTitle = "Thông báo";
  }
  return (
    <div>
      <div className="flex gap-3 border border-gray-400 items-center py-5 px-4 mb-5">
        <Link to={"/"}>Trang chủ</Link>
        <RightOutlined />
        <p className="font-bold">{pageTitle}</p>
      </div>

      <div className="grid grid-cols-12 gap-x-[10px] pt-5">
        <div className="col-span-4 flex flex-col gap-7 ">
          {isLoading ? (
            <div className="relative">
              <Spin
                className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
                style={{ textAlign: "center" }}
                size="large"
              />
            </div>
          ) : (
            <div className="w-[330px] border  border-gray-400 py-3 px-3">
              <div>
                <div className="flex items-center gap-5 mb-3">
                  <img
                    src={user?.avatar}
                    className="w-[60px] h-[60px] object-cover rounded-full"
                    alt=""
                  />
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-bold">{user?.name}</p>
                    <p
                      className={`text-xs bg-gradient-to-r py-1 px-3 rounded-[5px]  ${
                        rankLabels[
                          (memberResponse?.data
                            ?.rank as keyof typeof rankLabels) ?? "bronze"
                        ].color
                      } text-white`}
                    >
                      Hạng tài khoản:{" "}
                      {
                        rankLabels[
                          (memberResponse?.data
                            ?.rank as keyof typeof rankLabels) ?? "bronze"
                        ].name
                      }
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <p className="text-sm">SĐT tích điểm</p>
                    <p className="font-bold">{user?.phone}</p>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <p className="text-sm">Số điểm đang có</p>
                    <p className="font-bold">
                      {memberResponse?.data?.point} điểm
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-300 mb-2"></div>
              <div>
                <p className="text-sm mb-2">Chi tiêu</p>
                <Progress
                  className="!mb-3"
                  size={[, 20]}
                  percent={Math.round(
                    ((memberResponse?.data?.point * 10000) /
                      rankLabels[
                        (memberResponse?.data
                          ?.rank as keyof typeof rankLabels) ?? "bronze"
                      ].target) *
                      100
                  )}
                  showInfo={true} // ẩn % mặc định
                  percentPosition={{ align: "center", type: "inner" }}
                  strokeColor="#EF4C2B" // màu đỏ (giống hình bạn)
                  trailColor="#e5e5e5" // màu nền phía sau
                />
                <div className="flex justify-between text-sm">
                  <p>
                    {formatCurrencyVND(memberResponse?.data?.point * 10000)}
                  </p>
                  <p className="font-bold">
                    {memberResponse?.data?.rank === "diamond"
                      ? ""
                      : formatCurrencyVND(
                          rankLabels[
                            (memberResponse?.data
                              ?.rank as keyof typeof rankLabels) ?? "bronze"
                          ].target
                        )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* <Link to={""}>Tài khoản</Link> */}
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/user-info"}
          >
            Tài khoản
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/order"}
          >
            Đơn hàng
          </NavLink>
          <NavLink
            to={`/account/address`}
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
          >
            Địa chỉ
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/product-like"}
          >
            Sản phẩm yêu thích
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/change-password"}
          >
            Đổi mật khẩu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/notifications"}
          >
            Thông báo
          </NavLink>
        </div>
        <div className="col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default LayoutInforUser;
