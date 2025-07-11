import { useCustom } from "@refinedev/core";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Spin,
  Select,
  Typography,
  Space,
} from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import TopSellingProductsTable from "./topProduct";
import { OrderLocationMap } from "./mapDonHang";

const { Title } = Typography;
interface Customer {
  id: number;
  name: string;
  email: string;
  total_spent: string;
}

interface ProductItem {
  product_item_id: number;
  total_quantity: number;
  total_revenue: number;
  product_item: {
    sku: string;
    stock: number;
    price: number;
    sale_price: number;
    sale_percent: number;
    color: string;
    size: string;
    thumbnail: string;
    product: {
      id: number;
      name: string;
      slug: string;
    };
  };
}

interface OverviewResponse {
  active_accounts: number;
  banned_accounts: number;
  returning_rate: number;
  monthly: { [day: string]: number };
  recent: Array<Record<string, number>>;
  top_customers_spending: Customer[];
}

interface ProductsResponse {
  top_selling_products: ProductItem[];
}

const DashboardProduct = () => {
  const now = dayjs();
  const [month, setMonth] = useState(now.month() + 1);
  const [year, setYear] = useState(now.year());

  const [dateRange, setDateRange] = useState<[string, string]>([
    now.subtract(30, "day").format("YYYY-MM-DD"),
    now.format("YYYY-MM-DD"),
  ]);
  const [statusOrderId, setStatusOrderId] = useState<number | undefined>();
  const { RangePicker } = DatePicker;

  const { data: customerData, isLoading: isLoadingCustomer } =
    useCustom<OverviewResponse>({
      url: "admin/statistics/customers",
      method: "get",
      config: {
        query: {
          year: year.toString(),
          month: month.toString(),
        },
      },
    });

  const { data: productData, isLoading: isLoadingProduct } =
    useCustom<ProductsResponse>({
      url: "admin/statistics/products",
      method: "get",
      config: {
        query: {
          year: year.toString(),
          month: month.toString(),
        },
      },
    });

  const overview = customerData?.data || {
    active_accounts: 0,
    banned_accounts: 0,
    returning_rate: 0,
    monthly: {},
    recent: [],
    top_customers_spending: [],
  };

  const topSellingProducts = productData?.data?.top_selling_products || [];

  return (
    <div style={{ padding: 24 }}>
      {isLoadingCustomer || isLoadingProduct ? (
        <Spin />
      ) : (
        <>
          <Card>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 24 }}
            >
              <Col>
                <Title level={4}>Thống kê sản phẩm </Title>
              </Col>
              <Col>
                <DatePicker
                  picker="month"
                  allowClear={false}
                  value={dayjs(`${year}-${month}`, "YYYY-M")}
                  onChange={(date: Dayjs | null) => {
                    if (date) {
                      setMonth(date.month() + 1); // month() is 0-based
                      setYear(date.year());
                    }
                  }}
                />
              </Col>
            </Row>

            {/* Bảng sản phẩm */}

            <TopSellingProductsTable products={topSellingProducts} />
          </Card>

          <Card>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 24 }}
            >
              <Col>
                <Title level={4}>Bản đồ thống kê đơn hàng</Title>
              </Col>
              <Col>
                <Space>
                  <RangePicker
                    allowClear={false}
                    value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange([
                          dates[0]?.format("YYYY-MM-DD") ?? "",
                          dates[1]?.format("YYYY-MM-DD") ?? "",
                        ]);
                      }
                    }}
                  />
                  <Select
                    allowClear
                    style={{ width: 180 }}
                    placeholder="Trạng thái đơn hàng"
                    onChange={(value) => setStatusOrderId(value)}
                  >
                    <Select.Option value={1}>Chờ xác nhận</Select.Option>
                    <Select.Option value={2}>Đang chuẩn bị hàng</Select.Option>
                    <Select.Option value={3}>Đang giao hàng</Select.Option>
                    <Select.Option value={4}>Đã giao hàng</Select.Option>
                    <Select.Option value={5}>Giao hàng thất bại</Select.Option>
                    <Select.Option value={6}>Hoàn thành</Select.Option>
                    <Select.Option value={7}>Đã huỷ</Select.Option>
                  </Select>
                </Space>
              </Col>
            </Row>

            <OrderLocationMap
              from={dateRange[0]}
              to={dateRange[1]}
              status_order_id={statusOrderId}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardProduct;
