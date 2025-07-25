// pages/statistics/TopProducts.tsx
import { useCustom } from "@refinedev/core";
import { Card, DatePicker, Radio, Space, Table, Typography } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const TopProducts = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [filterBy, setFilterBy] = useState<"revenue" | "quantity">("revenue");

  const from = range[0].format("YYYY-MM-DD");
  const to = range[1].format("YYYY-MM-DD");

  const { data, isLoading, error } = useCustom({
    url: "/admin/statistics/top-products",
    method: "get",
    config: {
      query: {
        from,
        to,
        filter_by: filterBy,
      },
    },
  });

  const products = Array.isArray(data?.data?.data) ? data.data.data : [];

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image_product",
      key: "image",
      render: (src: string) => (
        <img
          src={src}
          alt="product"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 6,
            boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name_product",
      key: "name_product",
      render: (text: string) => <strong>{text}</strong>,
    },
    ...(filterBy === "quantity"
      ? [
          {
            title: "Số lượng bán",
            dataIndex: "total_quantity",
            key: "total_quantity",
          },
        ]
      : [
          {
            title: "Doanh thu",
            dataIndex: "total_revenue",
            key: "total_revenue",
            render: (value: string) => {
              const num = Number(value);
              return !isNaN(num) ? (
                <span>{num.toLocaleString("vi-VN")} VNĐ</span>
              ) : (
                "-"
              );
            },
          },
        ]),
  ];

  return (
    <div style={{ padding: 24,maxHeight: 600, overflow: "auto" }}>
      <Card style={{ marginTop: 16 }}>
        <Space
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Radio.Group
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <Radio.Button value="revenue">Doanh thu</Radio.Button>
            <Radio.Button value="quantity">Số lượng</Radio.Button>
          </Radio.Group>

          <RangePicker
            value={range}
            onChange={(val: any) => val && setRange(val)}
            allowClear={false}
          />
        </Space>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="product_item_id"
          loading={isLoading}
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};

export default TopProducts;
