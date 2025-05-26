import { useContext } from "react";
import { ModalContext } from "../context/ModalProvider";

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
