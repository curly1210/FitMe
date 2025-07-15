import { useState } from "react";
import { Card, InputNumber, Select, Row, Col, Spin, Progress } from "antd";
import { useCustom } from "@refinedev/core";
import ReviewProductList from "./topProduct"; 
import { Title } from "chart.js";

const ReviewPage = () => {
  const [sortBy, setSortBy] = useState<"count" | "rate">("count");
  const [rating, setRating] = useState<number | undefined>(undefined);

  const { data, isLoading } = useCustom({
    url: "/admin/statistics/reviews",
    method: "get",
    config: {
      query: {
        sort_by: sortBy,
        rating,
      },
    },
  });

  const ratingPercent = data?.data?.rating_percent || {};
  const filterProducts = data?.data?.filter_products || [];

const sortedRatings = [5, 4, 3, 2, 1].map((rate) => ({
  rate,
  count: ratingPercent?.[rate.toString()] ?? 0,
}));

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Bộ lọc */}
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Select
          value={sortBy}
          onChange={(val) => setSortBy(val)}
          options={[
            { label: "Sắp xếp theo lượt đánh giá", value: "count" },
            { label: "Sắp xếp theo số sao", value: "rate" },
          ]}
          style={{ width: 230 }}
        />
        {/* <InputNumber
          min={1}
          max={5}
          placeholder="Lọc theo số sao"
          value={rating}
          onChange={(val) => setRating(val ?? undefined)}
          style={{ width: 230 }}
        /> */}
      </div>

      {/* Thống kê rating */}
  <h1 className="font-bold text-2xl">Tỉ lệ đánh giá</h1><br />
      <Row gutter={[16, 16]}>
 
        {sortedRatings.map(({ rate, count }) => (
          <Col span={4} key={rate}>
  <Card
    hoverable
    onClick={() => setRating(rate)}
    style={{
      textAlign: "center",
    
      border: rating === rate ? "1px solid #1890ff" : undefined,
      cursor: "pointer",
      boxShadow: rating === rate ? "0 0 8px rgba(24,144,255,0.3)" : undefined,
      transition: "all 0.3s",
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 600, color: "#faad14" }}>
      {rate} ★
    </div>
    <Progress
      percent={count}
      size="small"
      showInfo={false}
      strokeColor="#52c41a"
      style={{ margin: "8px 0" }}
    />
    <div style={{ fontSize: 14 }}>{count}% đánh giá</div>
  </Card>
</Col>
        ))}
      </Row><br />
        <h1 className="font-bold text-2xl">Top sản phẩm đánh giá</h1>
      {/* Hiển thị danh sách sản phẩm */}
      <div style={{ marginTop: 24 }}>
        {isLoading ? <Spin /> : <ReviewProductList products={filterProducts} />}
      </div>
    </div>
  );
};

export default ReviewPage;
