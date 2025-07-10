import { Drawer, Descriptions, Table, Typography } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  product: any | null;
}

export const ProductDetailDrawer = ({ open, onClose, product }: Props) => {
  if (!product) return null;

  return (
    <Drawer
      title={`Chi tiết sản phẩm: ${product.name}`}
      open={open}
      onClose={onClose}
      width={720}
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Tên">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Tồn kho">{product.total_stock}</Descriptions.Item>
        <Descriptions.Item label="Tỷ lệ còn hàng">{product.inventory_rate_percent}%</Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Danh sách biến thể
      </Typography.Title>

      <Table
        size="small"
        dataSource={product.product_items}
        pagination={false}
        rowKey="id"
        columns={[
          { title: "SKU", dataIndex: "sku", key: "sku" },
          {
            title: "Màu",
            dataIndex: "color",
            key: "color",
            render: (color: string) => (
              <span
                style={{
                  width: 16,
                  height: 16,
                  display: "inline-block",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                }}
              />
            ),
          },
          { title: "Size", dataIndex: "size", key: "size" },
          { title: "Tồn kho", dataIndex: "stock", key: "stock" },
          { title: "Đã bán", dataIndex: "total_sold", key: "total_sold" },
        ]}
      />
    </Drawer>
  );
};
