import { Card, Table, Typography, Button } from "antd";
import { useCustom } from "@refinedev/core";
import { useState } from "react";
import { ProductDetailDrawer } from "./DrawerProduct";

export const ProductInventoryList = ({ sortStock }: { sortStock: "asc" | "desc" }) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const { data, isLoading } = useCustom({
    url: "/admin/statistics/inventory",
    method: "get",
    config: {
      query: { 
        sort_stock: sortStock,
        product_item: 0,
        
       },
       
    },
  });

  const products = data?.data?.inventory_by_product || [];

  return (
    <>
      {products.map((product: any) => (
<div
  style={{
    maxWidth: 1000,
    margin: "0 auto",
    padding: "0 16px",
    marginLeft:185,
    
  }}
>
  <Card
    key={product.id}
    style={{
      marginBottom: 24,
      border: "1px solid #888",
      borderRadius: 8,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            marginRight: 16,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <div>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            {product.name}
          </Typography.Title>
          <Typography.Text>Tồn kho tổng: {product.total_stock}</Typography.Text>
          <br />
          <Typography.Text>Đã bán: {product.total_sold}</Typography.Text>
          <br />
          <Typography.Text>
            Tỉ lệ tồn kho: {product.inventory_rate_percent}%
          </Typography.Text>
        </div>
      </div>

      <Button onClick={() => setSelectedProduct(product)}>Chi tiết</Button>
    </div>
  </Card>
</div>



      ))}

      <ProductDetailDrawer
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  );
};
