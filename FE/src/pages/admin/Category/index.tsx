import React, { useState } from "react";
import {
  MoreOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useList,
  useUpdate,
  useCreate,
  useDelete,
} from "@refinedev/core";
import {
  Card,
  Dropdown,
  Button,
  Menu,
  Drawer,
  Space,
  Image,
  Modal,
  Input,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Category: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState<"add-category" | "edit-category" | "add-item" | "edit-item" | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemImage, setItemImage] = useState<string>("");

  const { data, isLoading, isError } = useList({ resource: "categories" });
  const { mutate: updateCategory } = useUpdate();
  const { mutate: createCategory } = useCreate();
  const { mutate: deleteCategory } = useDelete();

  const getNow = () => dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

  const showDrawer = (category?: any, item?: any, addItemToCategory?: any) => {
    setOpenDrawer(true);

    if (category && !item) {
      setMode("edit-category");
      setEditingCategory(category);
      setCategoryName(category.name);
      setEditingItem(null);
      setParentCategory(null);
    } else if (!category && item) {
      setMode("edit-item");
      setEditingItem(item);
      setItemName(item.name);
      setItemImage(item.image || "");
      setParentCategory(null);
      const parent = data?.data.find((cat: any) =>
        cat.items.some((i: any) => i.id === item.id)
      );
      setParentCategory(parent);
    } else if (addItemToCategory) {
      setMode("add-item");
      setParentCategory(addItemToCategory);
      setItemName("");
      setItemImage("");
      setEditingCategory(null);
      setEditingItem(null);
    } else {
      setMode("add-category");
      setCategoryName("");
      setEditingCategory(null);
      setEditingItem(null);
      setParentCategory(null);
      setItemName("");
      setItemImage("");
    }
  };

  const onClose = () => {
    setOpenDrawer(false);
    setMode(null);
    setEditingCategory(null);
    setEditingItem(null);
    setParentCategory(null);
    setCategoryName("");
    setItemName("");
    setItemImage("");
  };

  // ✅ Giả lập upload ảnh: chỉ console.log thông tin và tạo URL tạm
  const handleImageUpload = async (options: any) => {
    const { file, onSuccess } = options;

    const tempUrl = URL.createObjectURL(file);

    console.log("📁 Thông tin ảnh được chọn:");
    console.log("• Tên file:", file.name);
    console.log("• Loại:", file.type);
    console.log("• Kích thước:", (file.size / 1024).toFixed(2) + " KB");
    console.log("• Sửa lần cuối:", new Date(file.lastModified).toLocaleString());
    console.log("• Link tạm thời:", tempUrl);

    setItemImage(tempUrl);
    onSuccess("ok");
    message.success("Ảnh đã chọn (hiển thị tạm)");
  };

  const handleAddCategory = () => {
    const now = getNow();
    const existingIds = data?.data.map((c: any) => Number(c.id)).filter((id) => !isNaN(id)) || [];
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

    const newCategory = {
      id: (maxId + 1).toString(),
      name: categoryName,
      parent_id: null,
      is_active: 1,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      items: [],
    };

    createCategory({ resource: "categories", values: newCategory });
    onClose();
  };

  const handleAddItem = () => {
    if (!parentCategory) return;
    const now = getNow();

    const items = parentCategory.items || [];
    const existingItemIds = items.map((item: any) => Number(item.id)).filter((id) => !isNaN(id));
    const maxItemId = existingItemIds.length > 0 ? Math.max(...existingItemIds) : 0;

    const newItem = {
      id: maxItemId + 1,
      name: itemName,
      image: itemImage,
    };

    const updatedCategory = {
      ...parentCategory,
      items: [...items, newItem],
      updated_at: now,
    };

    updateCategory({
      resource: "categories",
      id: parentCategory.id,
      values: updatedCategory,
    });
    onClose();
  };

  const handleSave = () => {
    const now = getNow();

    if (mode === "edit-category" && editingCategory) {
      updateCategory({
        resource: "categories",
        id: editingCategory.id,
        values: {
          ...editingCategory,
          name: categoryName,
          updated_at: now,
        },
      });
      onClose();
    } else if (mode === "edit-item" && editingItem && parentCategory) {
      const updatedItems = parentCategory.items.map((item: any) =>
        item.id === editingItem.id
          ? { ...item, name: itemName, image: itemImage }
          : item
      );
      const updatedCategory = {
        ...parentCategory,
        items: updatedItems,
        updated_at: now,
      };
      updateCategory({
        resource: "categories",
        id: parentCategory.id,
        values: updatedCategory,
      });
      onClose();
    } else if (mode === "add-category") {
      handleAddCategory();
    } else if (mode === "add-item") {
      handleAddItem();
    }
  };

  const handleDelete = (categoryId: string) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa toàn bộ danh mục này cùng các danh mục con?",
      onOk: () => {
        deleteCategory({ resource: "categories", id: categoryId });
      },
    });
  };

  if (isLoading) return <div>...Loading</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Quản lý danh mục sản phẩm</h1>

      <div className="flex gap-4 items-start overflow-x-auto">
        {data?.data.map((category: any) => (
          <Card
            key={category.id}
            title={<span className="font-semibold text-base">{category.name}</span>}
            className="w-64 rounded-xl border border-gray-200 bg-[#f5f6f8] shadow-sm flex-shrink-0"
            extra={
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => showDrawer(category)}>Sửa</Menu.Item>
                    <Menu.Item onClick={() => handleDelete(category.id)}>Xoá</Menu.Item>
                  </Menu>
                }
              >
                <MoreOutlined className="text-gray-500 cursor-pointer" />
              </Dropdown>
            }
          >
            <div className="p-3 flex flex-col gap-3">
              {Array.isArray(category.items) && category.items.length > 0 ? (
                category.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={30}
                          height={30}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                          preview={false}
                        />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            onClick={() => {
                              setParentCategory(category);
                              showDrawer(undefined, item);
                            }}
                          >
                            Sửa
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              Modal.confirm({
                                title: "Bạn có chắc muốn xóa danh mục con này?",
                                onOk: () => {
                                  const updatedItems = category.items.filter(
                                    (i: any) => i.id !== item.id
                                  );
                                  const now = getNow();
                                  const updatedCategory = {
                                    ...category,
                                    items: updatedItems,
                                    updated_at: now,
                                  };
                                  updateCategory({
                                    resource: "categories",
                                    id: category.id,
                                    values: updatedCategory,
                                  });
                                },
                              });
                            }}
                          >
                            Xóa
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <MoreOutlined className="text-gray-500 cursor-pointer" />
                    </Dropdown>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Không có danh mục con</div>
              )}

              <Button
                icon={<PlusOutlined />}
                onClick={() => showDrawer(undefined, undefined, category)}
                className="rounded-lg border border-blue-500"
                style={{
                  backgroundColor: "#f5f6f8",
                  color: "#22689B",
                  fontWeight: 500,
                  width: "100%",
                }}
              >
                + Thêm danh mục con
              </Button>
            </div>
          </Card>
        ))}

        <Card
          className="w-64 rounded-xl border border-gray-200 bg-[#f5f6f8] shadow-sm flex-shrink-0"
          bodyStyle={{ padding: 12 }}
        >
          <Button
            icon={<PlusOutlined />}
            onClick={() => showDrawer()}
            className="rounded-lg border border-blue-500"
            style={{
              backgroundColor: "#f5f6f8",
              color: "#22689B",
              fontWeight: 500,
              width: "100%",
            }}
          >
            + Thêm danh mục
          </Button>
        </Card>
      </div>

      <Drawer
        title={
          mode === "edit-category"
            ? `Sửa ${editingCategory?.name}`
            : mode === "edit-item"
            ? `Sửa ${editingItem?.name}`
            : mode === "add-item"
            ? `Thêm danh mục con cho ${parentCategory?.name}`
            : "Thêm danh mục"
        }
        placement="right"
        onClose={onClose}
        open={openDrawer}
        footer={
          <div className="text-right">
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                icon={<PlusOutlined />}
                className="text-white"
                style={{ backgroundColor: "#22689B" }}
                onClick={handleSave}
              >
                {mode === "add-category" || mode === "add-item"
                  ? "Thêm mới"
                  : "Lưu thay đổi"}
              </Button>
            </Space>
          </div>
        }
      >
        {(mode === "add-category" || mode === "edit-category") && (
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên danh mục"
          />
        )}

        {(mode === "add-item" || mode === "edit-item") && (
          <>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nhập tên mục con"
              style={{ marginBottom: 12 }}
            />

            <Upload
              customRequest={handleImageUpload}
              listType="picture"
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mục con</Button>
            </Upload>

            {itemImage && (
              <div style={{ marginTop: 12 }}>
                <Image
                  src={itemImage}
                  alt="Ảnh mục con"
                  style={{ maxHeight: 150, borderRadius: 6 }}
                  preview
                />
                <Button
                  danger
                  size="small"
                  style={{ marginTop: 8 }}
                  onClick={() => setItemImage("")}
                >
                  Xoá ảnh
                </Button>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Category;
