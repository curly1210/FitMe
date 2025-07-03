import { Avatar, Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

type ProductItem = {
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
};

const TopSellingProductsTable = ({ products }: { products: ProductItem[] }) => {
  const columns: ColumnsType<ProductItem> = [
    {
      title: "Ảnh",
      key: "thumbnail",
      render: (_, record) => (
        <Avatar shape="square" size={64} src={record.product_item.thumbnail} />
      ),
      align: "center" as const,
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      render: (_, record) => (
        <div>
          <Text strong>{record.product_item.product.name}</Text>
          <div style={{ fontSize: 12, color: "#888" }}>
            ID: {record.product_item.product.id} | Slug: {record.product_item.product.slug}
          </div>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: ["product_item", "sku"],
      key: "sku",
    },
    {
      title: "Giá gốc",
      dataIndex: ["product_item", "price"],
      key: "price",
      align: "right" as const,
      render: (val: number) => `${val.toLocaleString()} VNĐ`,
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: ["product_item", "sale_price"],
      key: "sale_price",
      align: "right" as const,
      render: (val: number) => `${val.toLocaleString()} VNĐ`,
    },
    {
      title: "% giảm",
      dataIndex: ["product_item", "sale_percent"],
      key: "sale_percent",
      align: "center" as const,
      render: (val: number) => `${val}%`,
    },
    {
      title: "Màu",
      dataIndex: ["product_item", "color"],
      key: "color_id",
      align: "center" as const,
    },
    {
      title: "Size",
      dataIndex: ["product_item", "size"],
      key: "size_id",
      align: "center" as const,
    },
    {
      title: "Tồn kho",
      dataIndex: ["product_item", "stock"],
      key: "stock",
      align: "center" as const,
    },
    {
      title: "Số lượng bán",
      dataIndex: "total_quantity",
      key: "total_quantity",
      align: "center" as const,
    },
    {
      title: "Doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      align: "right" as const,
      render: (val: number) => `${val.toLocaleString()} VNĐ`,
    },
  ];

  return (
    <Card
      title="Top sản phẩm bán chạy"
      style={{ marginTop: 24, borderRadius: 10 }}
      bodyStyle={{ padding: 0 }}
    >
      <Table
        dataSource={products}
        columns={columns}
        rowKey="product_item_id"
        pagination={false}
        scroll={{ x: "max-content" }} // Cho phép cuộn ngang nếu quá nhiều cột
      />
    </Card>
  );
};

export default TopSellingProductsTable;
