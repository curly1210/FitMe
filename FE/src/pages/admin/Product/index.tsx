import { PlusOutlined } from "@ant-design/icons";
import { Input } from "antd";

import { useState } from "react";
import DrawerAdd from "./DrawerAdd";

const { Search } = Input;

const ListProducts = () => {
  const [openDrawerAdd, setOpenDrawerAdd] = useState(false);
  // const [uploadKey, setUploadKey] = useState(Date.now());

  const onSearch = () => {};

  const showDrawer = () => {
    setOpenDrawerAdd(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-3">Danh sách sản phẩm</h1>
      <div className="flex items-center justify-between">
        <div>
          <Search
            placeholder="Tìm kiếm"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div
          onClick={showDrawer}
          className="flex gap-2 items-center bg-blue-600 text-white py-2 px-4 rounded-sm cursor-pointer"
        >
          <PlusOutlined className="!text-white" />
          <p>Thêm sản phẩm</p>
        </div>
      </div>

      <DrawerAdd
        openDrawerAdd={openDrawerAdd}
        setOpenDrawerAdd={setOpenDrawerAdd}
      />
    </div>
  );
};
export default ListProducts;
