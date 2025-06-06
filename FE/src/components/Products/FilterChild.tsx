import { Slider } from "antd";
import { useProduct } from "../../hooks/useProduct";

function FilterChild() {
  const { filterData, toggleColor, filterTab, fieldFilter, setFieldFilter } = useProduct();
  const filterDataOfTab = fieldFilter[filterTab] || [];

  const onChangeComplete = (arrValue) => {
    setFieldFilter((prev) => ({
      ...prev,
      [filterTab]: arrValue,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-3 mb-4">
        {["color", "size"].includes(filterTab) ? (
          filterData.map((color) => (
            <div
              key={color.id}
              className={`text-center border p-2 rounded cursor-pointer ${
                filterDataOfTab.includes(color.id)
                  ? "ring-2 ring-gray-300 border-transparent"
                  : "border-gray-200"
              }`}
              onClick={() => toggleColor(color.id)}
            >
              <div
                className="w-6 h-6 mx-auto mb-1 rounded"
                style={{ backgroundColor: color.code }}
              />
              <div className="text-xs font-medium">{color.name}</div>
            </div>
          ))
        ) : (
          <>
            {/* Hiển thị giá trị 0đ và 2,000,000đ */}
            <span>0đ</span>
            <Slider
              range
              step={100000} // Bước nhảy là 100000
              defaultValue={[0, 2000000]} // Giá trị mặc định từ 0 đến 2,000,000
              max={2000000} // Giá trị tối đa của thanh trượt
              onChangeComplete={onChangeComplete}
              tipFormatter={(value) => `${value.toLocaleString()}đ`} // Định dạng tiền tệ với dấu phẩy và "đ"
            />
            <span>2,000,000đ</span>
          </>
        )}
      </div>
    </>
  );
}

export default FilterChild;
