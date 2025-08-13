/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AreaChartOutlined,
  BellOutlined,
  DownOutlined,
  InboxOutlined,
  PercentageOutlined,
  PictureOutlined,
  ProductOutlined,
  ReadOutlined,
  ShoppingOutlined,
  StarOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  notification,
  Spin,
  theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuthen } from "../hooks/useAuthen";
import logo_white from "../assets/images/logo_white.png";
import { useNotificationUser } from "../hooks/userNotificationUser";
import { useCreate } from "@refinedev/core";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const itemsNavigate: MenuItem[] = [
  getItem(<Link to="/admin">Tổng quan</Link>, "1", <AreaChartOutlined />),
  // getItem("Thống kê", "sub1", <PieChartOutlined />, [
  //  // getItem(<Link to="/admin/dashboard/user">Thống kê khách hàng</Link>, "11"),
  //  // getItem(
  //   //   <Link to="/admin/dashboard/product">Thống kê S.Phẩm Đ.Hàng</Link>,
  //   //   "12"
  //   // ),
  //  // getItem(<Link to="/admin/dashboard/tonkho">Thống kê tồn kho</Link>, "13"),
  //   //getItem(<Link to="/admin/dashboard/danhgia">Thống kê đánh giá</Link>, "14"),
  // ]),

  getItem(
    <Link to="/admin/banner">Quản lý banner</Link>,
    "2",
    <PictureOutlined />
  ),
  getItem(
    <Link to="/admin/category">Quản lý danh mục</Link>,
    "3",
    <UnorderedListOutlined />
  ),
  getItem(
    "Quản lý sản phẩm",
    "sub2",
    <InboxOutlined />,
    [
      getItem(<Link to="/admin/products">Danh sách sản phẩm</Link>, "4"),
      getItem(<Link to="/admin/products/trash">Thùng rác</Link>, "5"),
    ]

    // <InboxOutlined />
  ),
  getItem(
    <Link to="/admin/bienthe">Quản lý biến thể</Link>,
    "6",
    <ProductOutlined />
  ),

  getItem(
    <Link to="/admin/oders">Quản lý đơn hàng</Link>,
    "7",
    <ShoppingOutlined />
  ),

  getItem(
    <Link to="/admin/coupons">Quản lý khuyến mãi</Link>,
    "8",
    <PercentageOutlined />
  ),
  getItem(
    <Link to="/admin/users">Quản lý khách hàng</Link>,
    "9",
    <UserOutlined />
  ),
  getItem(
    <Link to="/admin/posts">Quản lý tin tức</Link>,
    "10",
    <ReadOutlined />
  ),
  getItem(
    <Link to="/admin/reviews">Quản lý đánh giá</Link>,
    "15",
    <StarOutlined />
  ),
  getItem(
    <Link to="/admin/notifications">Thông báo</Link>,
    "16",
    <StarOutlined />
  ),
];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  minWidth: "100px",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const {
    unread,
    userUnreadNotifications,
    refetchUserUnreadNotifications,
    isLoadingUserNotications,
  } = useNotificationUser();

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

  const getCurrentKey = (path: any) => {
    switch (path) {
      case "/admin":
        return "1";
      case "/admin/banner":
        return "2";
      case "/admin/category":
        return "3";
      case "/admin/products":
        return "4";
      case "/admin/products/trash":
        return "5";
      case "/admin/bienthe":
        return "6";
      case "/admin/oders":
        return "7";
      case "/admin/coupons":
        return "8";
      case "/admin/users":
        return "9";
      case "/admin/posts":
        return "10";
      case "/admin/dashboard/user":
        return "11";
      case "/admin/dashboard/product":
        return "12";
      case "/admin/dashboard/tonkho":
        return "13";
      case "/admin/dashboard/danhgia":
        return "14";
      case "/admin/reviews":
        return "15";
      case "/admin/notifications":
        return "16";
      default:
        return "";
    }
  };

  const currentKey = getCurrentKey(location.pathname);

  const { logout } = useAuthen();

  // const navi = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      logout();
    }

    // if (key === "2") {
    //   navi("/");
    //   // logout();
    // }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div className="text-base font-bold py-1">Đăng xuất</div>,
    },
    // {
    //   key: "2",
    //   label: <div className="text-base font-bold py-1">Quay về trang chủ</div>,
    // },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        style={siderStyle}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex justify-center p-4">
          <Link to={"/"}>
            <img
              className="w-[100px]"
              src={logo_white}
              // src="https://media.routine.vn/prod/media/f0c0d744-fa73-41f1-b4bd-bd352808fcec.webp"
              alt=""
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[currentKey]}
          // defaultSelectedKeys={["1"]}
          mode="inline"
          items={itemsNavigate}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div className="flex gap-2 items-center ">
            <div>
              <img
                src="https://pbs.twimg.com/media/FoUoGo3XsAMEPFr?format=jpg&name=4096x4096"
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col ">
              <p className="text-sm">Pham Cuong</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
            <Dropdown
              // menu={{
              //   items: itemsNotifications,
              //   // onClick: handleUserNotificationClick,
              // }}
              trigger={["click"]}
              placement="bottomLeft"
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
                          {/* <span dangerouslySetInnerHTML={{ _ }}>
                            Khách hàng{" "}
                            <span className="text-red-500 font-semibold">
                              Cuong Pham
                            </span>{" "}
                            đã hủy đơn{" "}
                            <span className="text-red-500 font-semibold">
                              #OD250814RA7CDF
                            </span>
                          </span> */}
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
                        onClick={() => navigate("/admin/notifications")}
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

            <Dropdown
              // overlay={customMenu}
              menu={{ items, onClick: handleMenuClick }}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <DownOutlined className="!text-gray-400 !text-xs cursor-pointer" />
                {/* <p className="text-sm font-bold">{user?.name}</p> */}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          FitMe ©{new Date().getFullYear()} Created by Dev Storm
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
