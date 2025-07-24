import { useCustom } from "@refinedev/core";
import { Card, Typography, Image, Row, Col, Skeleton } from "antd";
import { useState } from "react";
import OrderDetailDrawer from "../../Oder/oderDetail";

const { Text, Title } = Typography;

type Order = {
  id: number;
  orders_code: string;
  customer_name: string;
  total_amount: string;
  created_at: string;
  product_image: string;
};

const OrderList = () => {
  const { data, isLoading } = useCustom<{ data: Order[] }>({
    url: "admin/statistics/recentOrder",
    method: "get",
  });

  const orders: Order[] = Array.isArray(data?.data) ? data.data : [];

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = (orderId: number) => {
    setSelectedOrderId(orderId.toString());
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div style={{ maxHeight: 600, overflow: "auto" }}>
          <Row gutter={[16, 16]}>
            {orders.map((order, index) => (
              <Col span={24} key={order.id}>
                <Card
                  bodyStyle={{ padding: 16 }}
                  onClick={() => handleOpenDrawer(order.id)}
                  hoverable
                  style={{ cursor: "pointer" }}
                >
                  <Row gutter={16} align="middle">
                    <Col flex="120px">
                      <div
                        style={{
                          position: "relative",
                          width: 100,
                          height: 100,
                        }}
                      >
                        <Image
                          src={order.product_image}
                          width={100}
                          height={100}
                          style={{ objectFit: "cover", borderRadius: 8 }}
                          preview={false}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </Col>
                    <Col flex="auto">
                      <Title level={5}>Mã đơn: {order.orders_code}</Title>
                      <Text>Khách: {order.customer_name}</Text> <br />
                      <Text>Tổng tiền: {order.total_amount}</Text> <br />
                      <Text type="secondary">Tạo lúc: {order.created_at}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <OrderDetailDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default OrderList;
