import FilterChild from "./FilterChild";
import { useProduct } from "../../hooks/useProduct";

const FilterProduct = () => {
  const { filterTab, setFilterTab, showFilter, handleSearch, fieldFilter } =
    useProduct();

  const clearFilters = () => {
    handleSearch(true);
  };

  return (
    <>
      {showFilter && (
        <div className="absolute right-0 z-20 mt-2 w-[700px] bg-white border border-gray-200 rounded-md shadow-xl">
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
          <div className="p-4">
            <h4 className="text-sm font-bold mb-3">Bộ lọc</h4>

            <div className="flex gap-2 mb-4">
              {["color", "size", "price"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 border rounded text-sm ${filterTab === tab ? "border-black" : "border-gray-200"
                    }`}
                  onClick={() => setFilterTab(tab as any)}
                >
                  {tab === "color" ? "Màu" : tab === "size" ? "Kích Cỡ" : "Giá"}
                </button>
              ))}
            </div>

            {filterTab && <FilterChild />}

            <div className="flex justify-between gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 w-[140px]"
              >
                Xoá hết
              </button>
              <button
                className="px-4 py-2 
              text-sm font-semibold text-white bg-black rounded hover:opacity-90 w-[160px]
              cursor-pointer
              "
                onClick={() => handleSearch()}
              >
                Xem kết quả ({fieldFilter[filterTab]?.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FilterProduct;
