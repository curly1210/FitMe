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
  // isLoadingProducts: boolean;
};

export const SearchPanelContext = createContext<SearchPanelType>({
  isOpenSearchPanel: false,
  setIsOpenSearchPanel: () => {},
  categories: [],
  selectedCategory: [],
  setSelectedCategory: () => {},
  isLoadingSearchPanel: false,
  // isLoadingProducts: false,
});

export const SearchPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenSearchPanel, setIsOpenSearchPanel] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const location = useLocation();

  // Gọi API danh mục
  const { data: responseCategories, isLoading: isLoadingSearchPanel } = useList(
    {
      resource: "admin/categories",
    }
  );

  const listCategory = responseCategories?.data || [];

  // Gọi API sản phẩm (giả định sẽ gọi theo selectedCategory)
  // const {
  //   data: responseProducts,
  //   isLoading: isLoadingProducts,
  // } = useList({
  //   resource: "products",
  //   filters: [
  //     {
  //       field: "categoryId",
  //       operator: "eq",
  //       value: selectedCategory?.id,
  //     },
  //   ],
  //   pagination: {
  //     pageSize: 10,
  //   },
  // });

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
    document.body.style.overflow = isOpenSearchPanel ? "hidden" : "scroll";
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
        // isLoadingProducts,
      }}
    >
      {children}
    </SearchPanelContext.Provider>
  );
};
