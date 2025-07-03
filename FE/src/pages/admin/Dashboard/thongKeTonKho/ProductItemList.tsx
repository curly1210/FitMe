import { Table } from "antd";
import { useCustom } from "@refinedev/core";

export const ProductItemInventoryList = ({ sortStock }: { sortStock: "asc" | "desc" }) => {
  const { data, isLoading } = useCustom({
    url: "/admin/statistics/inventory",
    method: "get",
    config: {
      query: {
        sort_stock: sortStock,
        product_item: 1,
         
      },
    },
  });

  const items = data?.data?.inventory_by_product_item || [];

  const columns = [
    { title: "Tên sản phẩm", dataIndex: ["product", "name"], key: "product_name" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      render: (color: string) => (
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 16,
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
    {
  title: "Tỉ lệ tồn kho",
  dataIndex: "sell_rate_percent",
  key: "sell_rate_percent",
  render: (value: number) => `${value}%`,
},
  ];

  return (
    <Table
      dataSource={items}
      columns={columns}
      rowKey="id"
      loading={isLoading}
    />
  );
};
