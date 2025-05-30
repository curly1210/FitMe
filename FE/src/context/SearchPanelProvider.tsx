/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useList } from "@refinedev/core";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

type SearchPanelType = {
  isOpenSearchPanel: boolean;
  setIsOpenSearchPanel: (isOpenSearchPanel: boolean) => void;
  categories: any;
  selectedCategory: any;
  setSelectedCategory: (category: any) => void;
  isLoadingSearchPanel: boolean;
};

export const SearchPanelContext = createContext<SearchPanelType>({
  isOpenSearchPanel: false,
  setIsOpenSearchPanel: () => {},
  categories: [],
  selectedCategory: [],
  setSelectedCategory: () => {},
  isLoadingSearchPanel: false,
});

export const SearchPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenSearchPanel, setIsOpenSearchPanel] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const location = useLocation();

  const { data: responseCategories, isLoading: isLoadingSearchPanel } = useList(
    {
      resource: "admin/categories",
    }
  );

  const listCategory = responseCategories?.data || [];

  useEffect(() => {
    if (listCategory?.length > 0) {
      setCategories(listCategory);
      setSelectedCategory(listCategory[0]);
    }
  }, [responseCategories]);

  useEffect(() => {
    setIsOpenSearchPanel(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpenSearchPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isOpenSearchPanel]);

  return (
    <SearchPanelContext.Provider
      value={{
        isOpenSearchPanel,
        setIsOpenSearchPanel,
        categories,
        selectedCategory,
        setSelectedCategory,
        isLoadingSearchPanel,
      }}
    >
      {children}
    </SearchPanelContext.Provider>
  );
};
