import { FiFilter } from "react-icons/fi";
import { HiBars3 } from "react-icons/hi2";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import FilterProduct from "../../../components/Products/FilterProduct";
import { useProduct } from "../../../hooks/useProduct";
import { Pagination } from "antd";
import { Link, useNavigate } from "react-router";
import { HeartOutlined } from "@ant-design/icons";
import { usePopupMessage } from "../../../hooks/usePopupMessage";
import { useCreate, useDelete, useList } from "@refinedev/core";
import { useAuthen } from "../../../hooks/useAuthen";

function ProductPage() {
  const {
    categoryData,
    setShowFilter,
    showFilter,
    setShowSort,
    showSort,
    listProduct,
    setCurrentPage,
    currentPage,
    metaLink,
    setSortData,
    handleSearch,
  } = useProduct();
  const { accessToken, user } = useAuthen();
  const hasAuth = !!accessToken && !!user;
  const { notify } = usePopupMessage();
  const navigate = useNavigate();
  const { mutate: store } = useCreate();
  const { mutate } = useDelete();

  const { data: wishlistData, refetch } = useList({
    resource: "wishlist",
    queryOptions: {
      enabled: hasAuth,
    },
  });
  const dataLike = wishlistData?.data?.data || [];

  const handleLikeProduct = (productId: any, unlike: boolean) => {
    if (unlike) {
      unLike(productId);
      return;
    }
    store(
      {
        resource: "wishlist",
        values: { product_id: productId },
      },
      {
        onSuccess: (res) => {
          refetch();
          notify("success", `${res.data?.message}`);
        },
        onError: (error) => {
          notify("error", `${error?.response?.data?.message}`);
        },
      }
    );
  };
  const unLike = (productId: any) => {
    mutate(
      { resource: "wishlist", id: productId },
      {
        onError: (error) => {
          notify("error", error?.response?.data?.message);
          // An error occurred!
        },
        onSuccess: (response) => {
          refetch();
          notify("success", response?.data?.message);
        },
      }
    );
  };
  return (
    <>
      <div className="font-sans bg-white min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb + Filter + Sort */}
          <div className="border border-gray-200 rounded-sm mb-4">
            <div className="flex justify-between items-center px-6 py-4 relative">
              <div className="text-sm text-gray-500 space-x-2">
                <span className="hover:underline cursor-pointer">Trang chủ</span> /
                <span className="hover:underline cursor-pointer">Thời trang</span> /
                <span className="font-semibold text-black">{categoryData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    className="flex items-center text-sm text-gray-600 border px-3 py-1.5 rounded hover:bg-gray-100"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <FiFilter className="mr-2" /> Lọc
                  </button>
                  <FilterProduct />
                </div>

                {/* Sort Button */}
                <div className="relative">
                  <button
                    className="flex items-center text-sm text-gray-600 border px-2 py-1.5 rounded hover:bg-gray-100"
                    onClick={() => setShowSort(!showSort)}
                  >
                    <HiBars3 size={20} />
                  </button>
                  {showSort && (
                    <div className="absolute right-0 z-10 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-3 border-b font-semibold">Sắp xếp theo</div>
                      <div
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSortData("desc");
                          handleSearch();
                        }}
                      >
                        <FaSortAmountDownAlt className="mr-2" /> Giá giảm dần
                      </div>
                      <div
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSortData("asc");
                          handleSearch();
                        }}
                      >
                        <FaSortAmountUpAlt className="mr-2" /> Giá tăng dần
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid or Empty Message */}
          {listProduct.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listProduct.map((product) => {
                const productItems = product.colors.flatMap((itemV) => itemV.product_items) || [];
                // lấy ảnh đầu tiên
                const imgFirst = product.colors[0]?.images[0]?.url;
                const thumbnals = product.colors.flatMap((itemV) => itemV.images[0]) || [];
                const minPrice = Math.min(...product.colors.flatMap((item) => item.min_sale_price));
                const percent = product.colors[0]?.product_items[0]?.sale_percent as number;

                return (
                  <div key={product.id} className="group border border-gray-100 relative">
                    {/* Like */}
                    <div
                      className="group/group-like absolute right-0 top-0 z-10 p-2 cursor-pointer"
                      onClick={() =>
                        handleLikeProduct(
                          product.id,
                          dataLike.some((item) => item?.product?.id === product.id)
                        )
                      }
                    >
                      <HeartOutlined
                        className={`text-2xl group-hover/group-like:!text-red-400 ${
                          dataLike.some((item) => item?.product?.id === product.id) && "!text-red-400"
                        }`}
                      />
                    </div>

                    <div className="relative">
                      <Link to={`/products/${product.slug}`}>
                        <img
                          src={imgFirst}
                          className="w-full h-[400px] object-contain object-center bg-white hover:opacity-90 transition duration-200"
                          alt={product.name}
                        />
                      </Link>

                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition bg-white">
                        <div className="flex border-t border-gray-200 divide-x divide-gray-200">
                          <button className="flex-1 text-xs py-2 bg-black text-white hover:opacity-90 cursor-pointer">
                            Mua nhanh
                          </button>
                          <Link
                            className="flex-1 text-xs py-2 hover:bg-gray-100 cursor-pointer flex justify-center items-center"
                            to={`/products/${product.slug}`}
                          >
                            <button className="">Xem chi tiết</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      <p className="text-sm font-semibold text-black">{product.name}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {minPrice?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫ -
                        <span className="text-green-600">
                          {percent?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}%
                        </span>
                      </p>
                      <div className="flex gap-1 mt-2">
                        {thumbnals.map((modelImg, key) => (
                          <img
                            key={modelImg.id + key}
                            src={modelImg.url}
                            alt={modelImg.id}
                            className="w-6 h-6 object-cover border rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-base py-10">Không có sản phẩm nào phù hợp với bộ lọc</div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-1 mt-6">
            {metaLink !== null && listProduct.length > 0 && (
              <Pagination
                className="flex justify-end col-span-full"
                size="small"
                current={metaLink.current_page}
                pageSize={metaLink.per_page}
                total={metaLink.last_page}
                onChange={(e) => { 
                  setCurrentPage(e);
                  handleSearch();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
