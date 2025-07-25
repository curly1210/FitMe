import { useCustom } from "@refinedev/core";
import { Card, Col, Row, Space, Spin } from "antd";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarCircleOutlined,
  BarsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  FileDoneOutlined,
  DeliveredProcedureOutlined,
  ExceptionOutlined,
  StopOutlined,
} from "@ant-design/icons";
import ChartLastDays from "./charDay";
import ChartByMonth from "./charMonth";
import ChartByYear from "./charYear";
import "./chaSetup";
import TopProducts from "./topProduct";
import { OrderLocationMap } from "../thongKeSanPhamDonHang/mapDonHang";
import { useState } from "react";
import dayjs from "dayjs";
import { Title } from "chart.js";
import OrderList from "./donHangGanDay";

type Props = {
  from: string;
  to: string;
  status_order_id?: number;
};

interface OverviewResponse {
  total_orders: number;
  total_selling_products: number;
  total_customers: number;
  total_sold: number | string;
  orders_by_status: {
    [key: string]: number;
  };
}

const Dashboard = () => {
  const now = dayjs();

  const [month, setMonth] = useState(now.month() + 1);
  const [year, setYear] = useState(now.year());
  const [dateRange, setDateRange] = useState<[string, string]>([
    now.subtract(30, "day").format("YYYY-MM-DD"),
    now.format("YYYY-MM-DD"),
  ]);
  const [statusOrderId, setStatusOrderId] = useState<number | undefined>();

  const { data, isLoading } = useCustom<OverviewResponse>({
    url: "admin/statistics/overview",
    method: "get",
  });

  const overview = data?.data || {
    total_orders: 0,
    total_selling_products: 0,
    total_customers: 0,
    total_sold: 0,
    orders_by_status: {},
  };
  // tổng quan chung
  const summaryCards = [
    {
      title: "Tổng doanh thu (VNĐ)",
      value: Number(overview.total_sold).toLocaleString(),
      icon: (
        <DollarCircleOutlined
          style={{ color: "green", fontSize: 24, marginRight: 8 }}
        />
      ),
    },
    {
      title: "Tổng đơn hàng",
      value: overview.total_orders,
      icon: (
        <ShoppingCartOutlined
          style={{ color: "#1890ff", fontSize: 24, marginRight: 8 }}
        />
      ),
    },
    {
      title: "Sản phẩm đang bán",
      value: overview.total_selling_products,
      icon: (
        <ShoppingOutlined
          style={{ color: "red", fontSize: 24, marginRight: 8 }}
        />
      ),
    },
    {
      title: "Khách hàng đã đăng ký",
      value: overview.total_customers,
      icon: (
        <UserOutlined
          style={{ color: "orange", fontSize: 24, marginRight: 8 }}
        />
      ),
    },
  ];
  // đơn hàng theo trạng thái
  const statusMap: Record<string, { label: string; icon: JSX.Element }> = {
    "1": {
      label: "Chờ xác nhận",
      icon: <ReloadOutlined style={{ marginRight: 6, color: "#faad14" }} />, // Vàng cam
    },
    "2": {
      label: "Đang chuẩn bị hàng",
      icon: <ShoppingOutlined style={{ marginRight: 6, color: "#1890ff" }} />, // Xanh dương
    },
    "3": {
      label: "Đang giao hàng",
      icon: (
        <DeliveredProcedureOutlined
          style={{ marginRight: 6, color: "#722ed1" }}
        />
      ), // Tím
    },
    "4": {
      label: "Đã giao",
      icon: <FileDoneOutlined style={{ marginRight: 6, color: "#52c41a" }} />, // Xanh lá
    },
    "5": {
      label: "Giao hàng thất bại",
      icon: (
        <CloseCircleOutlined style={{ marginRight: 6, color: "#ff4d4f" }} />
      ), // Đỏ
    },
    "6": {
      label: "Hoàn thành",
      icon: (
        <CheckCircleOutlined style={{ marginRight: 6, color: "#13c2c2" }} />
      ), // Xanh cyan
    },
    "7": {
      label: "Đã huỷ",
      icon: <StopOutlined style={{ marginRight: 6, color: "#8c8c8c" }} />, // Xám
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold">Tổng quan</h1>
      <br />
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {/* Tổng quan */}
          <Row gutter={[16, 16]}>
            {summaryCards.map((item, idx) => (
              <Col span={6} key={idx}>
                <Card style={{ borderRadius: 10 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {item.icon}
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 18 }}>{item.value}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Trạng thái đơn hàng */}
          <Row gutter={24} style={{ marginTop: 32 }}>
            {/* BẢN ĐỒ BÊN TRÁI */}
            <Col span={16}>
              <Card
                title="Bản đồ thống kê đơn hàng"
                style={{ borderRadius: 10 }}
              >
                <OrderLocationMap />
              </Card>
            </Col>

            {/* TRẠNG THÁI ĐƠN HÀNG BÊN PHẢI */}
            <Col span={8}>
              <Card
                title="Đơn hàng theo trạng thái"
                style={{ borderRadius: 10 }}
              >
                <Row gutter={[16, 16]}>
                  {Object.entries(overview.orders_by_status).map(
                    ([status, count]) => (
                      <Col span={12} key={status}>
                        <Card style={{ borderRadius: 10 }}>
                          <Row align="middle" gutter={8}>
                            <Col>{statusMap[status]?.icon}</Col>
                            <Col>
                              <span>
                                {statusMap[status]?.label ||
                                  `Trạng thái ${status}`}
                                : <strong>{count}</strong>
                              </span>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              </Card>
            </Col>
          </Row>

          {/*Biểu đồ thống kê*/}
          <div style={{ padding: 24 }}>
            <h1 className="font-bold text-lg">Thống kê doanh thu</h1>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Card title="Biểu đồ 7 / 14 / 30 ngày gần nhất">
                  <ChartLastDays />
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card title="Biểu đồ theo tháng">
                  <ChartByMonth />
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card title="Biểu đồ theo năm">
                  <ChartByYear />
                </Card>
              </Col>
            </Row>
          </div>
          {/*Top sản phẩm và 10 đơn gần đây*/}
          <Row gutter={24} style={{ marginTop: 32 }}>
            <Col span={16}>
              <Card size="small">
                <h1 className="font-bold text-lg">Top 10 sản phẩm bán chạy</h1>
                <TopProducts />
              </Card>
            </Col>

            <Col span={8}>
              <Card size="small">
                <h1 className="font-bold text-lg">Hoạt động mua gần đây</h1>
                <OrderList />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
