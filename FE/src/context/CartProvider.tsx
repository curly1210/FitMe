/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuthen } from "../hooks/useAuthen";
import { useCreate, useList } from "@refinedev/core";
import { notification } from "antd";

interface CartContextType {
  cart: any[];
  addToCartHandler: (idProductItem: any, quantity: any) => void;
  isLoadingAddtoCart?: boolean;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCartHandler: () => {},
  isLoadingAddtoCart: false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken, user } = useAuthen();
  const hasAuth = !!accessToken && !!user;
  const [cart, setCart] = useState<any>([]);

  const { data: cartResponse } = useList({
    resource: "cart-items",
    queryOptions: {
      enabled: hasAuth, // ✅ chỉ gọi API khi đã có accessToken & user
    },
  });

  const { mutate: addToCart, isLoading: isLoadingAddtoCart } = useCreate({
    resource: "cart-items",
    mutationOptions: {
      onSuccess: () => {
        notification.success({ message: "Thêm vào giỏ hàng thành công" });
      },
      onError: (error) => {
        notification.error({ message: `${error?.response?.data?.message}` });
      },
    },
  });

  const addToCartHandler = (idProductItem: any, quantity: any) => {
    addToCart({
      values: { product_item_id: idProductItem, quantity },
    });
  };

  useEffect(() => {
    if (cartResponse?.data && cartResponse?.data.length > 0) {
      setCart(cartResponse?.data);
    }
  }, [cartResponse]);

  return (
    <CartContext.Provider
      value={{ cart, addToCartHandler, isLoadingAddtoCart }}
    >
      {/* Children components will go here */}
      {children}
    </CartContext.Provider>
  );
};
