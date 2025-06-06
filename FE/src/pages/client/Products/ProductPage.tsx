import { FiFilter } from "react-icons/fi";
import { HiBars3 } from "react-icons/hi2";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import FilterProduct from "../../../components/Products/FilterProduct";
import { useProduct } from "../../../hooks/useProduct";
import { Pagination } from "antd";

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
                const item = product.product_items || [];
                const imgUrl = item?.image?.[0]?.url || "";
                const productImage = item.flatMap((value) => value.color.images);
                return (
                  <div key={product.id} className="group border border-gray-100 relative">
                    <div className="relative">
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-full h-[400px] object-contain object-center bg-white"
                      />
                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition bg-white">
                        <div className="flex border-t border-gray-200 divide-x divide-gray-200">
                          <button className="flex-1 text-xs py-2 bg-black text-white hover:opacity-90 cursor-pointer">
                            Mua nhanh
                          </button>
                          <button className="flex-1 text-xs py-2 hover:bg-gray-100 cursor-pointer">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      <p className="text-sm font-semibold text-black">{product.name}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {item[0]?.sale_price
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        ₫
                      </p>
                      <div className="flex gap-1 mt-2">
                        {productImage.slice(0, 5).map((modelImg, key) => (
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
            <div className="text-center text-gray-500 text-base py-10">
              Không có sản phẩm nào phù hợp với bộ lọc
            </div>
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
