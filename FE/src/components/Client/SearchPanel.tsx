/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useList } from "@refinedev/core";
import { Link } from "react-router";
import { Spin } from "antd";
import HeaderClient from "./HeaderClient";

interface SearchPanelProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchPanel = ({ setIsOpen }: SearchPanelProps) => {
  const [openCategory, setOpenCategory] = useState<any>();

  const { data: responseCategories, isLoading } = useList({
    resource: "admin/categories",
  });

  const categories = responseCategories?.data || [];

  useEffect(() => {
    if (categories?.length > 0) {
      setOpenCategory(categories[0]);
    }
  }, [responseCategories]);

  <Spin
    className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
    style={{ textAlign: "center" }}
    size="large"
  />;
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-full z-20 bg-white flex flex-col">
        {isLoading ? (
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <>
            {/* Header cố định trên cùng */}
            <HeaderClient
              categories={categories}
              openCategory={openCategory}
              setOpenCategory={setOpenCategory}
            />

            {/* Nội dung cuộn được ở giữa */}
            <div className="w-7xl flex-1 mx-auto  px-3 overflow-y-auto p-4 space-y-3 no-scrollbar">
              <div className="grid grid-cols-4 gap-y-8">
                {openCategory?.items.map((sub: any) => (
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
                onClick={() => setIsOpen(false)}
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
