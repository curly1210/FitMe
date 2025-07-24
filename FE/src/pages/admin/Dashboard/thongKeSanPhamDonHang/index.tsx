import { useCustom } from "@refinedev/core";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Spin,
  Typography,
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
                <Title level={4}>Thống kê sản phẩm</Title>
              </Col>
              <Col>
                <DatePicker
                  picker="month"
                  allowClear={false}
                  value={dayjs(`${year}-${month}`, "YYYY-M")}
                  onChange={(date: Dayjs | null) => {
                    if (date) {
                      setMonth(date.month() + 1);
                      setYear(date.year());
                    }
                  }}
                />
              </Col>
            </Row>

            <TopSellingProductsTable products={topSellingProducts} />
          </Card>

          {/* <Card>
            <OrderLocationMap />
          </Card> */}
        </>
      )}
    </div>
  );
};

export default DashboardProduct;
