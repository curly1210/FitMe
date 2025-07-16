/* eslint-disable @typescript-eslint/no-explicit-any */
import { useList } from "@refinedev/core";
import { Button, Cascader, Input, Select, Skeleton, Table } from "antd";
import { useMemo, useState } from "react";
import { GoStarFill } from "react-icons/go";
import DrawerShowReview from "./DrawerShowReview";

const { Search } = Input;

const AdminReviewProductList = () => {
  const [searchText, setSearchText] = useState<any>(undefined);
  const [selectCategory, setSelectCategory] = useState<any>(undefined);
  const [selecteRate, setSelectRate] = useState<any>(undefined);

  const [openDrawerShowReview, setOpenDrawerShowReview] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [currentPageProduct, setCurrentPageProduct] = useState(1);
  const [pageSizeProducts, setPageSizeProducts] = useState(1);

  const { data: categories } = useList({
    resource: "client/categories",
  });

  const options = useMemo(() => {
    if (!categories?.data) return [];
    return categories?.data.map((category: any) => ({
      label: category?.name,
      value: category?.id,
      children: category?.children?.map((child: any) => ({
        label: child?.name,
        value: child?.id,
      })),
    }));
  }, [categories]);

  const handleSearchText = (value: any) => {
    setSearchText(value || undefined);
  };

  const handleSelectCategory = (value: any) => {
    setSelectCategory(value ? value[value.length - 1] : undefined);
  };

  const handleSelectRate = (value: any) => {
    setSelectRate(value || undefined);
  };

  const {
    data: productsResponse,
    isLoading,
    // refetch,
  } = useList({
    resource: "admin/reviews",
    pagination: {
      mode: "off",
    },
    filters: [
      { field: "search", operator: "eq", value: searchText },
      { field: "category", operator: "eq", value: selectCategory },
      { field: "rate", operator: "eq", value: selecteRate },
      { field: "per_page", operator: "eq", value: pageSizeProducts },
      { field: "page", operator: "eq", value: currentPageProduct },
    ],
    queryOptions: {
      enabled: true,
      keepPreviousData: false, //  khi page thay đổi thì sẽ loading lại
    },
  });

  const products =
    productsResponse?.data?.data.map((product: any) => ({
      ...product,
      key: product.id,
    })) || [];

  const totalProducts = productsResponse?.data?.meta?.total || 0;

  const handleTableChange = (pagination: any) => {
    setCurrentPageProduct(pagination?.current);
    setPageSizeProducts(pagination?.pageSize);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      key: "name",
      dataIndex: "name",
      render: (_: any, product: any) => (
        <div className="flex items-center gap-3">
          <div className="w-[60px] h-[60px]">
            <img
              src={product?.product_images}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <p>{product?.name}</p>
        </div>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      dataIndex: "category",
    },
    {
      title: "Số lượt đánh giá",
      key: "reviews_count",
      dataIndex: "reviews_count",
    },
    {
      title: "Trung bình rating",
      key: "reviews_avg_rate",
      dataIndex: "reviews_avg_rate",
      render: (_: any, product: any) => (
        <div className="flex items-center gap-2">
          <GoStarFill
            className={`w-5 h-5 fill-current transition-colors duration-150 text-yellow-400`}
          />
          <p>{product?.reviews_avg_rate}</p>
        </div>
      ),
    },

    {
      title: "",
      render: (_: any, product: any) => (
        <Button
          onClick={() => {
            setSelectedProductId(product.id);
            setOpenDrawerShowReview(true);
            setSelectedProduct(product);
          }}
          color="primary"
          variant="solid"
        >
          Xem đánh giá
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-3 font-semibold">Quản lý đánh giá</h1>
      <div className="flex gap-3 mb-5">
        <Search
          placeholder="Tìm kiếm"
          onChange={(e: any) => handleSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Cascader
          style={{ width: 200 }}
          onChange={handleSelectCategory}
          placeholder="Lọc theo danh mục"
          options={options}
          allowClear
        />
        <Select
          style={{ width: 200 }}
          onChange={handleSelectRate}
          placeholder="Lọc theo mức đánh giá"
          allowClear
          options={[
            { value: "low", label: "Đánh giá thấp (dưới 3 sao)" },
            { value: "high", label: "Đánh giá tốt (từ 3 sao trở lên)" },
          ]}
        />
      </div>

      <div>
        {isLoading ? (
          <div>
            <Skeleton active />
          </div>
        ) : (
          <Table
            dataSource={products}
            columns={columns}
            pagination={{
              pageSize: pageSizeProducts,
              total: totalProducts,
              current: currentPageProduct,
            }}
            onChange={handleTableChange}
          />
        )}
      </div>

      <DrawerShowReview
        open={openDrawerShowReview}
        onClose={() => setOpenDrawerShowReview(false)}
        productId={selectedProductId}
        product={selectedProduct}
      />
    </div>
  );
};
export default AdminReviewProductList;
