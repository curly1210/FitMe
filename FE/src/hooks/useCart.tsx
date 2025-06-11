import { useContext } from "react";
import { CartContext } from "../context/CartProvider";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("use searach panel must be used within a PopupProvider");
  }
  return context;
};
