import {
  InboxOutlined,
  PercentageOutlined,
  PictureOutlined,
  PieChartOutlined,
  ProductOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Link, Outlet } from "react-router";

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

const items: MenuItem[] = [
  getItem(<Link to="/admin">Dashboard</Link>, "1", <PieChartOutlined />),
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
  getItem(<Link to="/admin">Quản lý sản phẩm</Link>, "4", <InboxOutlined />),
  getItem(<Link to="/admin">Quản lý biến thể</Link>, "5", <ProductOutlined />),
  getItem(<Link to="/admin">Quản lý đơn hàng</Link>, "6", <ShoppingOutlined />),
  getItem(
    <Link to="/admin">Quản lý khuyến mãi</Link>,
    "7",
    <PercentageOutlined />
  ),
  getItem(<Link to="/admin">Quản lý khách hàng</Link>, "8", <UserOutlined />),
  // getItem("User", "sub1", <UserOutlined />, [
  //   getItem("Tom", "3"),
  //   getItem("Bill", "4"),
  //   getItem("Alex", "5"),
  // ]),
  // getItem("Team", "sub2", <TeamOutlined />, [
  //   getItem("Team 1", "6"),
  //   getItem("Team 2", "8"),
  // ]),
  // getItem("Files", "9", <FileOutlined />),
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
          <img
            className="w-[100px]"
            src="https://media.routine.vn/prod/media/f0c0d744-fa73-41f1-b4bd-bd352808fcec.webp"
            alt=""
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
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
