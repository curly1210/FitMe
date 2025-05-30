/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Spin } from "antd";
import HeaderClient from "./HeaderClient";
import { useSearchPanel } from "../../hooks/useSearchPanel";

// interface SearchPanelProps {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const SearchPanel = () => {
  const { isLoadingSearchPanel, selectedCategory, setIsOpenSearchPanel } =
    useSearchPanel();

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute top-0 left-0 w-full h-full  bg-white flex flex-col">
        {isLoadingSearchPanel ? (
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <>
            {/* Header cố định trên cùng */}
            <HeaderClient />

            {/* Nội dung cuộn được ở giữa */}
            <div className="w-7xl flex-1 mx-auto  px-3 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-100 rounded">
                  Gợi ý #{i + 1}
                </div>
              ))}
              <div className="grid grid-cols-4 gap-y-8">
                {selectedCategory?.items.map((sub: any) => (
                  <Link
                    to={""}
                    key={sub.id}
                    className="flex gap-2 items-center"
                    // onClick={() => navigate(`/category/${sub.id}`)}
                  >
                    <div className="w-10 h-11">
                      <img
                        src={sub?.image}
                        width={40}
                        alt=""
                        className="object-cover h-full"
                      />
                    </div>

                    <p>{sub.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer cố định dưới cùng */}
            <footer className="w-7xl mx-auto shrink-0 sticky bottom-0 bg-white z-10   px-4 flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Nhập để tìm kiếm..."
                className="w-full border border-gray-400 rounded px-4 py-2 mt-3"
              />
              <button
                onClick={() => setIsOpenSearchPanel(false)}
                className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center mb-3"
              >
                <CloseOutlined />
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
export default SearchPanel;
