import { useCustom } from "@refinedev/core";
import {
  Card,
  Col,
  Row,
  Spin,
  Typography,
 
  DatePicker,
} from "antd";
import {
  UserOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import RevenueByMonth from "./charMothUsers";
import RevenueByRecent from "./charDayUsers"; 
import TopCustomersTable from "./TopUser";
const { Title } = Typography;
const { MonthPicker } = DatePicker;

interface OverviewResponse {
  active_accounts: number;
  banned_accounts: number;
  returning_rate: number;
  monthly: { [day: string]: number };
  recent: Array<Record<string, number>>;
  top_customers_spending: Array<{
    id: number;
    name: string;
    email: string;
    total_spent: string;
  }>;
}

const DashboardUser = () => {
  const now = dayjs();
  const [month, setMonth] = useState(now.month() + 1);
  const [year, setYear] = useState(now.year());
  const [range, setRange] = useState<7 | 14 | 30>(7);

  const { data, isLoading } = useCustom<OverviewResponse>({
    url: "admin/statistics/customers",
    method: "get",
    config: {
      query: {
        year: year.toString(),
        month: month.toString(),
      },
    },
  });

  const overview = data?.data || {
    active_accounts: 0,
    banned_accounts: 0,
    returning_rate: 0,
    monthly: {},
    recent: [],
    top_customers_spending: [],
  };

  const summaryCards = [
    {
      title: "Tài khoản đang hoạt động",
      value: overview.active_accounts,
      icon: <UserOutlined style={{ color: "#52c41a", fontSize: 24, marginRight: 8 }} />,
    },
    {
      title: "Tài khoản bị khoá",
      value: overview.banned_accounts,
      icon: <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 24, marginRight: 8 }} />,
    },
    {
      title: "Tỉ lệ quay lại (%)",
      value: `${overview.returning_rate}%`,
      icon: <ReloadOutlined style={{ color: "#1890ff", fontSize: 24, marginRight: 8 }} />,
    },
  ];



  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4}>Tổng quan người dùng</Title>
        </Col>
      </Row>

      {isLoading ? (
        <Spin />
      ) : (
        <>
          {/*  thống kê tổng quan */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {summaryCards.map((item, idx) => (
              <Col span={8} key={idx}>
                <Card style={{ borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

          {/* Biểu đồ và bảng */}
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
              <Col>
                <Title level={4}>Thống kê khách hàng mới</Title>
              </Col>

               {/* lọc */}
              <Col>
                <MonthPicker
                  defaultValue={dayjs()}
                  format="MM/YYYY"
                  onChange={(val) => {
                    if (val) {
                      setMonth(val.month() + 1);
                      setYear(val.year());
                    }
                  }}
                />
              </Col>
            </Row>
                
                 {/* Biểu đồ và bảng ngày*/}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <RevenueByRecent
                  range={range}
                  setRange={setRange}
                  recentArray={overview.recent}
                />
              </Col>
                   {/* Biểu đồ và bảng Tháng */}
              <Col span={12}>
                <RevenueByMonth
                  month={month}
                  year={year}
                  data={overview.monthly}
                />
              </Col>
            </Row>
                  {/*Top khách hàng */}
            <Card title="Top khách hàng chi tiêu" style={{ borderRadius: 10 }}>
            <TopCustomersTable customers={overview.top_customers_spending} />
            </Card>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardUser;
