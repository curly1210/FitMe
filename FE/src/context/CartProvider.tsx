/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuthen } from "../hooks/useAuthen";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import { notification } from "antd";

interface CartContextType {
  cart: { [key: string]: any };
  addToCartHandler: (idProductItem: any, quantity: any) => void;
  isLoadingAddtoCart?: boolean;
  updateToCartHandler?: (idCartItem: any, quantity: any) => Promise<any>;
  isLoadingUpdateToCart?: boolean;
  loadingItemId?: string | null;
  deleteCartItemHandler?: (idCartItem: any) => void;
  refetch: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: {},
  addToCartHandler: () => {},
  isLoadingAddtoCart: false,
  updateToCartHandler: () => Promise.resolve(),
  isLoadingUpdateToCart: false,
  loadingItemId: null,
  deleteCartItemHandler: () => {},
  refetch: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken, user } = useAuthen();
  const hasAuth = !!accessToken && !!user;
  const [cart, setCart] = useState<any>({});
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const { data: cartResponse, refetch } = useList({
    resource: "cart-items",
    queryOptions: {
      enabled: hasAuth, // ✅ chỉ gọi API khi đã có accessToken & user
    },
  });

  const { mutate: addToCart, isLoading: isLoadingAddtoCart } = useCreate({
    resource: "cart-items",
    mutationOptions: {
      onSuccess: () => {
        refetch(); // Lấy lại dữ liệu giỏ hàng sau khi thêm thành công
        notification.success({ message: "Thêm vào giỏ hàng thành công" });
      },
      onError: (error) => {
        notification.error({ message: `${error?.response?.data?.message}` });
      },
    },
  });

  const { mutate: updateToCart, isLoading: isLoadingUpdateToCart } = useUpdate({
    resource: "cart-items",
  });

  const addToCartHandler = (idProductItem: any, quantity: any) => {
    addToCart({
      values: { product_item_id: idProductItem, quantity },
    });
  };

  const { mutate: deleteCartItem } = useDelete();

  const deleteCartItemHandler = (idCartItem: any) => {
    setLoadingItemId(idCartItem);
    deleteCartItem(
      { resource: "cart-items", id: idCartItem },
      {
        onSuccess: (response) => {
          refetch();
          notification.success({ message: response?.data?.message });
        },
        onError: (error) => {
          notification.error({ message: `${error?.response?.data?.message}` });
        },
        onSettled: () => {
          setLoadingItemId(null); // Reset loading state
        },
      }
    );
  };

  const updateToCartHandler = (idCartItem: any, quantity: any) => {
    setLoadingItemId(idCartItem);
    return new Promise((resolve, reject) => {
      updateToCart(
        {
          id: idCartItem,
          values: { quantity },
        },
        {
          onSuccess: (response) => {
            refetch();
            notification.success({ message: response?.data?.message });
            resolve(response); // return response
          },
          onError: (error) => {
            notification.error({
              message: `${error?.response?.data?.message}`,
            });
            reject(error); // return error
          },
          onSettled: () => {
            setLoadingItemId(null); // Reset loading state
          },
        }
      );
    });
  };

  useEffect(() => {
    if (cartResponse?.data) {
      setCart(cartResponse?.data);
      console.log("Cart items:", cartResponse?.data);
    }
    // console.log("Cart items dấdsa:", cartResponse?.data);
  }, [cartResponse?.data]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCartHandler,
        isLoadingAddtoCart,
        updateToCartHandler,
        isLoadingUpdateToCart,
        loadingItemId,
        deleteCartItemHandler,
        refetch,
      }}
    >
      {/* Children components will go here */}
      {children}
    </CartContext.Provider>
  );
};
