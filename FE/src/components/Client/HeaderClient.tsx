/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BellOutlined,
  EllipsisOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthen } from "../../hooks/useAuthen";
import ModalLogin from "../Modal/ModalLogin";
import { useModal } from "../../hooks/useModal";
import { Link, useNavigate } from "react-router";
import { useSearchPanel } from "../../hooks/useSearchPanel";
import { Badge, Dropdown, MenuProps, notification, Spin } from "antd";
import { useCart } from "../../hooks/useCart";

import { BsDoorOpen } from "react-icons/bs";
import logo_F from "../../assets/images/logo_F.png";
import { useNotificationUser } from "../../hooks/userNotificationUser";
import { useCreate } from "@refinedev/core";
// import logo_black from "../../assets/images/logo_black.png";

const HeaderClient = () => {
  /* Start dont-delete */

  const { openModal } = useModal();
  const { accessToken, user, logout } = useAuthen();
  const { cart } = useCart();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setIsOpenSearchPanel,
  } = useSearchPanel();
  const navigate = useNavigate();

  const {
    unread,
    userUnreadNotifications,
    refetchUserUnreadNotifications,
    isLoadingUserNotications,
  } = useNotificationUser();

  // console.log(user);

  const handleClickToCartPage = () => {
    if (!accessToken) {
      openModal(<ModalLogin />);
      return;
    }
    // Nếu đã ở trang /carts thì không push thêm vào history
    if (location.pathname === "/carts") return;

    navigate("/carts");
  };

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

  // console.log(cart);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        message: "Good morning",
        icon: "☀️",
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        message: "Good afternoon",
        icon: "🌤️",
      };
    } else {
      return {
        message: "Good evening",
        icon: "🌙",
      };
    }
  };

  const { message, icon } = getGreeting();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "2") {
      navigate("/account/address");
    }

    if (key === "3") {
      navigate("/account/order");
    }

    if (key === "4") {
      navigate("/admin");
    }

    if (key === "5") {
      logout();
    }
  };

  const handleMenuExtraClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      navigate("/post");
    }

    if (key === "2") {
      if (!accessToken) {
        openModal(<ModalLogin />);
      } else {
        navigate("/account/order");
      }
    }

    if (key === "3") {
      navigate("/contact");
      // logout();
    }
  };

  const itemsExtra: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/3596/3596091.png"
            alt=""
          />
          <div className="">Tin thời trang</div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/846/846364.png"
            alt=""
          />
          <div className="">Tra cứu đơn hàng</div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/3894/3894024.png"
            alt=""
          />
          <div className="">Liên hệ</div>
        </div>
      ),
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p className="text-base font-bold py-1">
          {message} {icon} {user?.name} !
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/3596/3596091.png"
            alt=""
          />
          <div className="flex flex-col">
            <p className="font-bold">Thông tin người dùng</p>
            <span className="text-xs">
              Tài khoản, Đơn hàng, Địa chỉ giao nhận
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/846/846364.png"
            alt=""
          />
          <div className="flex flex-col">
            <p className="font-bold">Lịch sử đơn hàng</p>
            <span className="text-xs">Tra cứu đơn hàng đã đặt</span>
          </div>
        </div>
      ),
    },
    ...(user?.role === "Admin"
      ? [
          {
            key: "4",
            label: (
              <div className="text-base flex items-center gap-4 py-1">
                <BsDoorOpen className="text-4xl" />
                <div className="flex flex-col">
                  <p className="font-bold">Truy cập trang quản trị</p>
                  <span className="text-xs">Trang quản trị</span>
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      key: "5",
      label: <div className="text-base font-bold py-1">Đăng xuất</div>,
    },
  ];

  return (
    <header className=" shrink-0 sticky top-0 z-50 bg-white  border-gray-200  px-4 mb-5">
      <div className="text-black w-7xl m-auto flex justify-between items-center py-5 px-4">
        <div className="flex gap-6 items-center">
          <SearchOutlined
            className="text-xl cursor-pointer"
            onClick={() => setIsOpenSearchPanel(true)}
          />
          <div className="list-none flex gap-3.5">
            {categories.map((category: any) => (
              <li
                key={category.id}
                className={`cursor-pointer   ${
                  selectedCategory?.id === category.id
                    ? "border-b-2 border-black font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsOpenSearchPanel(true);
                }}
              >
                {category.name}
              </li>
            ))}
            {/* <Link to="/address">
              <li>Địa chỉ</li>
            </Link>
            <li>Khuyến mãi</li> */}
          </div>
        </div>
        <div>
          <Link to={"/"}>
            <img
              width={30}
              // src={logo_black}
              src={logo_F}
              // src="https://media.routine.vn/1920x0/prod/media/a31071fa-22a1-440b-a6d2-776d07fe0419.webp"
              alt=""
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {!accessToken ? (
              <>
                <UserOutlined className="text-2xl" />
                <p
                  className="cursor-pointer"
                  onClick={() => openModal(<ModalLogin />)}
                >
                  Đăng nhập
                </p>
              </>
            ) : (
              <Dropdown
                // overlay={customMenu}
                menu={{ items, onClick: handleMenuClick }}
                placement="bottom"
                trigger={["click"]}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <UserOutlined className="text-2xl" />
                  <p className="text-sm font-bold">{user?.name}</p>
                </div>
              </Dropdown>
            )}
          </div>

          {/* <Badge count={cart?.totalItem ? cart?.totalItem : 0} showZero> */}
          <Badge
            count={!cart?.totalItem || !accessToken ? 0 : cart?.totalItem}
            showZero
          >
            <ShoppingCartOutlined
              onClick={handleClickToCartPage}
              className="text-3xl cursor-pointer"
            />
          </Badge>

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
                      userUnreadNotifications.map((noti: any, index: any) => (
                        <div
                          key={index}
                          className="px-4 py-[6px] hover:bg-gray-100 flex items-center gap-2"
                        >
                          <span className="text-xl">{noti.data?.icon} - </span>
                          <span
                            // className="text-base"
                            dangerouslySetInnerHTML={{
                              __html: noti.data?.message,
                            }}
                          />
                        </div>
                      ))
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
                <BellOutlined className="text-[28px] cursor-pointer " />
              </Badge>
            </Dropdown>
          )}

          <Dropdown
            menu={{ items: itemsExtra, onClick: handleMenuExtraClick }}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <EllipsisOutlined className="text-3xl cursor-pointer" />
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
export default HeaderClient;
