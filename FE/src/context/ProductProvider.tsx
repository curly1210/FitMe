/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { filterColor, filterSize } from "../pages/client/Products/product";
import { useApiUrl, useCustom, useList } from "@refinedev/core";

type FilterTabType = "color" | "size" | "price" | "";
interface ProductContextType {
  categorySlug?: string;
  categoryData: { name: string };
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
  showSort: boolean;
  setShowSort: (value: boolean) => void;
  filterTab: FilterTabType;
  setFilterTab: (value: FilterTabType) => void;
  filterData: any[];
  setFilterData: (value: []) => void;
  toggleColor: (color: string) => any;
  listProduct: any[];
  handleSearch: (clear: boolean) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export default function ProductProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categoryData } = location.state || {};

  const [listProduct, setListProduct] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTabType>("");
  const [filterData, setFilterData] = useState([]);
  const [metaLink, setMetaLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [callapiList, setCallapiList] = useState(true);
  const [sortData, setSortData] = useState("");
  const [fieldFilter, setFieldFilter] = useState({
    color: [],
    size: [],
    price: [],
  });
  const navigate = useNavigate();

  /* Gọi danh sách sản phầm */
  const {
    data: response,
    isLoading,
    isError,
  } = useCustom({
    url: `${useApiUrl()}/category/${categorySlug}`,
    method: "get",
    queryOptions: {
      enabled: callapiList,
      onSuccess: (data) => {
        setCallapiList(false);
      },
    },
    config: {
      query: {
        page: currentPage,
        color: fieldFilter.color.length
          ? `[${fieldFilter.color.join(",")}]`
          : "",
        size: fieldFilter.size.length ? `[${fieldFilter.size.join(",")}]` : "",
        price: fieldFilter.price.length
          ? `[${fieldFilter.price.join(",")}]`
          : "",
        sort: sortData,
      },
    },
  });
  /* gọi màu và size */
  const { data: responseFilterTabColors } = useCustom({
    url: `${useApiUrl()}/get-colors`,
    method: "get",
  });
  const { data: responseFilterTabSizes } = useCustom({
    url: `${useApiUrl()}/get-sizes`,
    method: "get",
  });

  useEffect(() => {
    if (response?.data?.data) {
      setListProduct(response.data.data);
      console.log(response.data.data);
      setMetaLink(response.data.meta);
    } else {
      setListProduct([]);
      setMetaLink(null);
    }
  }, [isLoading, response]);
  useEffect(() => {
    setCallapiList(true);
  }, [categorySlug]);
  useEffect(() => {
    if (showFilter) setShowSort(false);
  }, [showFilter]);

  useEffect(() => {
    if (showSort) setShowFilter(false);
  }, [showSort]);

  useEffect(() => {
    switch (filterTab) {
      case "color":
        return setFilterData(responseFilterTabColors.data);
      case "size":
        return setFilterData(responseFilterTabSizes.data);
      default:
        return setFilterData([]);
    }
  }, [filterTab]);

  const toggleColor = (id: number) => {
    setFieldFilter((prev) => {
      return {
        ...prev,
        [filterTab]: prev[filterTab].includes(id)
          ? prev[filterTab].filter((itemId) => itemId !== id)
          : [...prev[filterTab], id],
      };
    });
  };
  const handleSearch = (clear: boolean = false) => {
    console.log(clear);

    if (clear) {
      setFieldFilter((prev) => ({
        ...prev,
        color: [],
        size: [],
        price: [],
      }));
      setSortData("");
    }
    setShowFilter(false);
    setCallapiList(true);
    handleAppendQueryUrl();
  };
  const handleAppendQueryUrl = () => {
    const params = new URLSearchParams();
    if (fieldFilter.color.length) {
      params.set("color", JSON.stringify(fieldFilter.color));
    }
    if (fieldFilter.price.length) {
      params.set("price", JSON.stringify(fieldFilter.price));
    }
    if (fieldFilter.size.length) {
      params.set("size", JSON.stringify(fieldFilter.size));
    }
    navigate(
      { search: params.toString() },
      { replace: true, state: { categoryData } }
    );
  };

  return (
    <ProductContext.Provider
      value={{
        categorySlug,
        categoryData,
        showFilter,
        setShowFilter,
        showSort,
        setShowSort,
        filterTab,
        setFilterTab,
        filterData,
        setFilterData,
        toggleColor,
        listProduct,
        handleSearch,
        metaLink,
        setCurrentPage,
        currentPage,
        fieldFilter,
        setFieldFilter,
        setSortData,
        sortData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
