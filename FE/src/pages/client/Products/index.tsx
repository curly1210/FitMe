import React from "react";
import ProductProvider from "../../../context/ProductProvider";
import ProductPage from "./ProductPage";

const ListProduct: React.FC = () => {
  return (
    <ProductProvider>
      <ProductPage />
    </ProductProvider>
  );
};

export default ListProduct;
