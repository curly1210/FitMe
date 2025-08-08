/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useApiUrl, useCustom } from "@refinedev/core";

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
  metaLink: any;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  setSortData: (value: string) => void;
  sortData: string;
  searchValue: string | null;
  fieldFilter: {
    color: number[];
    size: number[];
    price: number[];
  };
  setFieldFilter: (value: any) => void;
  isLoadingProduct: boolean;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export default function ProductProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const searchValue = queryParam.get("searchValue");

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

  const urlListProduct = categorySlug
    ? `${useApiUrl()}/category/${categorySlug}`
    : `${useApiUrl()}/search`;

  const { data: response, isLoading } = useCustom({
    url: urlListProduct,
    method: "get",
    queryOptions: {
      enabled: callapiList,
      onSuccess: () => {
        setCallapiList(false);
      },
      retry: 1,
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
        keyword: searchValue || "",
      },
    },
  });

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
      setMetaLink(response.data.meta);
    } else {
      setListProduct([]);
      setMetaLink(null);
    }
  }, [isLoading, response]);

  useEffect(() => {
    setCallapiList(true);
  }, [categorySlug, searchValue]);

  useEffect(() => {
    if (showFilter) setShowSort(false);
  }, [showFilter]);

  useEffect(() => {
    if (showSort) setShowFilter(false);
  }, [showSort]);

  useEffect(() => {
    switch (filterTab) {
      case "color":
        return setFilterData(responseFilterTabColors?.data || []);
      case "size":
        return setFilterData(responseFilterTabSizes?.data || []);
      default:
        return setFilterData([]);
    }
  }, [filterTab]);

  const toggleColor = (id: number) => {
    setFieldFilter((prev) => ({
      ...prev,
      [filterTab]: prev[filterTab].includes(id)
        ? prev[filterTab].filter((itemId) => itemId !== id)
        : [...prev[filterTab], id],
    }));
  };

  const handleSearch = (clear: boolean = false) => {
    if (clear) {
      setFieldFilter({ color: [], size: [], price: [] });
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
        setSortData,
        sortData,
        searchValue,
        fieldFilter,
        setFieldFilter,
        isLoadingProduct: isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
