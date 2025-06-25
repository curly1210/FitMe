
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
import "./chaSetup"
import TopProducts from "./topProduct";

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
      icon: <DollarCircleOutlined style={{ color: "green", fontSize: 24, marginRight: 8 }} />,
    },
    {
      title: "Tổng đơn hàng",
      value: overview.total_orders,
      icon: <ShoppingCartOutlined style={{ color: "#1890ff", fontSize: 24, marginRight: 8 }} />,
    },
    {
      title: "Sản phẩm đang bán",
      value: overview.total_selling_products,
      icon: <ShoppingOutlined style={{ color: "red", fontSize: 24, marginRight: 8 }} />,
    },
    {
      title: "Khách hàng đã đăng ký",
      value: overview.total_customers,
      icon: <UserOutlined style={{ color: "orange", fontSize: 24, marginRight: 8 }} />,
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
    icon: <DeliveredProcedureOutlined style={{ marginRight: 6, color: "#722ed1" }} />, // Tím
  },
  "4": {
    label: "Đã giao",
    icon: <FileDoneOutlined style={{ marginRight: 6, color: "#52c41a" }} />, // Xanh lá
  },
  "5": {
    label: "Giao hàng thất bại",
    icon: <CloseCircleOutlined style={{ marginRight: 6, color: "#ff4d4f" }} />, // Đỏ
  },
  "6": {
    label: "Hoàn thành",
    icon: <CheckCircleOutlined style={{ marginRight: 6, color: "#13c2c2" }} />, // Xanh cyan
  },
  "7": {
    label: "Đã huỷ",
    icon: <StopOutlined style={{ marginRight: 6, color: "#8c8c8c" }} />, // Xám
  },
};


  return (
    <div style={{ padding: 24 }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {/* Tổng quan */}
          <Row gutter={[16, 16]}>
            {summaryCards.map((item, idx) => (
              <Col span={6} key={idx}>
                <Card style={{ borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8   }}>
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
          <Row style={{ marginTop: 32 }}>
            <Col span={24}>
              <Card title="Đơn hàng theo trạng thái" style={{ borderRadius: 10 }}>
                <Row gutter={[16, 16]}>
                  {Object.entries(overview.orders_by_status).map(([status, count]) => (
                    <Col span={6} key={status}>
                      <Card style={{ borderRadius: 10 }}>
                        <Row align="middle">
                          {statusMap[status]?.icon}
                          <span>
                            {statusMap[status]?.label || `Trạng thái ${status}`}:{" "}
                            <strong>{count}</strong>
                          </span>
                        </Row>
                      </Card>
                    </Col>
                  ))}
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
           {/*Top sản phẩm*/}
          <Card   size="small">
            <h1 className="font-bold text-lg">Top sản phẩm bán chạy</h1>
          <TopProducts />
        </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
