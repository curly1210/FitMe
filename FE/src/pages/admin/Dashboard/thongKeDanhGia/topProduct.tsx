import { Card, Col, Row, Rate, Empty } from "antd";

interface Product {
  id: number;
  name: string;
  reviews_count: number;
  average_rating: number;
  review_image: string;
}

const ReviewProductList = ({ products }: { products: Product[] }) => {
  if (!products || products.length === 0) {
    return <Empty description="Không có sản phẩm nào" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {products.map((item) => (
        <Col span={8} key={item.id}>
          <Card
            cover={
              <img
                alt={item.name}
                src={item.review_image}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
          >
            <h3>{item.name}</h3>
            <Rate disabled allowHalf defaultValue={item.average_rating} />
            <div>{item.reviews_count} đánh giá</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ReviewProductList;
