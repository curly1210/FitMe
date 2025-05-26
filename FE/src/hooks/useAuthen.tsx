import { useContext } from "react";
import { AuthContext } from "../context/AuthenProvider";

export const useAuthen = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
