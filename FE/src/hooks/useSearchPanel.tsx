import { useContext } from "react";
import { SearchPanelContext } from "../context/SearchPanelProvider";

export const useSearchPanel = () => {
  const context = useContext(SearchPanelContext);
  if (!context) {
    throw new Error("use searach panel must be used within a PopupProvider");
  }
  return context;
};
