import { useList, useDelete } from "@refinedev/core";
import { message, Popconfirm, Dropdown, Menu, Card, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Add from "./add";
import Edit from "./edit";

// type ColorDataResponse = {
//   data: {
//     data: {
//       colors: [];
//     };
//   };
// };

const Bienthe = () => {
  const { data: colorData } = useList({ resource: "admin/variations/color" });
  const { data: sizeData } = useList({ resource: "admin/variations/size" });
  const colors = colorData?.data ?? [];
  // const colors = colorData?.data ?? [];
  const sizes = sizeData?.data ?? [];

  // console.log(colorData);

  const { mutate: deleteOne } = useDelete();

  const [drawerOpen, setAddDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"colo" | "sizee" | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);

  const openAdd = (type: "colo" | "sizee") => {
    setDrawerType(type);
    setAddDrawerOpen(true);
  };

  const openEditDrawer = (type: "colo" | "sizee", id: number | string) => {
    setDrawerType(type);
    setEditId(id);
    setEditDrawerOpen(true);
  };

  const handleDelete = (
    resource: "admin/variations/color" | "admin/variations/size",
    id: number | string
  ) => {
    deleteOne(
      { resource, id },
      {
        onSuccess: () => message.success("Xoá thành công"),
        onError: () => message.error("Xoá thất bại"),
      }
    );
  };

  const menu = (
    resource: "admin/variations/color" | "admin/variations/size",
    id: number | string
  ) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() =>
          openEditDrawer(
            resource === "admin/variations/color" ? "colo" : "sizee",
            id
          )
        }
      >
        Sửa
      </Menu.Item>
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa?"
        okText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDelete(resource, id)}
      >
        <Menu.Item key="delete" icon={<DeleteOutlined />}>
          Xoá
        </Menu.Item>
      </Popconfirm>
    </Menu>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý biến thể</h1>
      <div className="flex gap-4 p-4 items-start">
        {/* Card Màu sắc */}
        <Card
          title={<span className="font-semibold text-base">Màu sắc</span>}
          className="w-64 rounded-2xl border border-gray-200 !bg-gray-200"
          bodyStyle={{ padding: 12 }}
        >
          <div className="flex flex-col gap-2">
            <div style={{ maxHeight: 460, paddingRight: 4, overflow: "auto" }}>
              {colors.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.code }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <Dropdown
                    overlay={menu("admin/variations/color", item.id!)}
                    trigger={["click"]}
                  >
                    <MoreOutlined className="text-gray-500 cursor-pointer" />
                  </Dropdown>
                </div>
              ))}
            </div>

            <Button
              icon={<PlusOutlined />}
              onClick={() => openAdd("colo")}
              className="justify-start rounded-xl mt-2"
              style={{ color: "#22689B", textAlign: "left" }}
            >
              Thêm màu sắc
            </Button>
          </div>
        </Card>

        {/* Card Kích thước */}
        <Card
          title={<span className="font-semibold text-base">Kích thước</span>}
          className="w-64 rounded-2xl border border-gray-200 !bg-gray-200"
          bodyStyle={{ padding: 12 }}
        >
          <div className="flex flex-col gap-2">
            <div style={{ maxHeight: 460, overflowY: "auto" }}>
              {sizes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <span className="font-medium">{item.name}</span>
                  <Dropdown
                    overlay={menu("admin/variations/size", item.id!)}
                    trigger={["click"]}
                  >
                    <MoreOutlined className="text-gray-500 cursor-pointer" />
                  </Dropdown>
                </div>
              ))}
            </div>

            <Button
              icon={<PlusOutlined />}
              onClick={() => openAdd("sizee")}
              className="justify-start rounded-xl mt-2"
              style={{ color: "#22689B", textAlign: "left" }}
            >
              Thêm kích thước
            </Button>
          </div>
        </Card>
      </div>

      <Add
        open={drawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        type={drawerType}
      />
      <Edit
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditId(null);
        }}
        type={drawerType}
        id={editId}
      />
    </div>
  );
};

export default Bienthe;
