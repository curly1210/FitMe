import { useState } from "react";
import { Select, Space } from "antd";
import { ProductInventoryList } from "./ProductList";
import { ProductItemInventoryList } from "./ProductItemList";

export const InventoryPage = () => {
  const [mode, setMode] = useState<"product" | "product_item">("product");
   const [sortStock, setSortStock] = useState<"asc" | "desc">("desc"); // mặc định giảm dần

  return (
   <div>
    <h1 className="font-bold text-2xl">Thống kê tồn kho</h1> <br />
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={mode}
          onChange={(val) => setMode(val)}
          options={[
            { value: "product", label: "Theo sản phẩm" },
            { value: "product_item", label: "Theo biến thể" },
          ]}
          style={{ width: 160 }}
        />

        <Select
          value={sortStock}
          onChange={(val) => setSortStock(val)}
          options={[
            { value: "asc", label: "Tăng dần tồn kho" },
            { value: "desc", label: "Giảm dần tồn kho" },
          ]}
          style={{ width: 180 }}
        />
      </Space>

      {mode === "product" ? (
        <ProductInventoryList sortStock={sortStock} />
      ) : (
        <ProductItemInventoryList sortStock={sortStock} />
      )}
    </div>
  );
};
