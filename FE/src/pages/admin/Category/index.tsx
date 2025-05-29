import React, { useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Image,
  Input,
  Menu,
  Modal,
  Space,
  Spin,
  Upload,
  notification,
} from "antd";
import { MoreOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useList, useUpdate, useCreate, useDelete } from "@refinedev/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

type Mode = "add-category" | "edit-category" | "add-item" | "edit-item" | null;

const Category: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const { data, refetch } = useList({ resource: "admin/categories" });
  const { mutate: updateCategory } = useUpdate();
  const { mutate: createCategory, isLoading } = useCreate();
  const { mutate: deleteCategory } = useDelete();

  const getNow = () =>
    dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

  const showDrawer = (category?: any, item?: any, parent?: any) => {
    if (category) {
      setMode("edit-category");
      setEditingCategory(category);
      setCategoryName(category.name);
      setPreviewImage(category.image || "");
      setCategoryImage(null); // reset
    } else if (item) {
      setMode("edit-item");
      setEditingItem(item);
      setItemName(item.name);
      setPreviewImage(item.image || "");
      setParentCategory(parent);
      setItemImage(null); // reset
    } else if (parent) {
      setMode("add-item");
      setParentCategory(parent);
      setItemName("");
      setPreviewImage("");
      setItemImage(null);
    } else {
      setMode("add-category");
      setCategoryName("");
      setPreviewImage("");
      setCategoryImage(null);
    }
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
    setMode(null);
    setEditingCategory(null);
    setParentCategory(null);
    setEditingItem(null);
    setCategoryName("");
    setItemName("");
    setCategoryImage(null);
    setItemImage(null);
    setPreviewImage("");
  };

  const handleBeforeUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    if (mode === "add-category" || mode === "edit-category") {
      setCategoryImage(file);
      notification.success({ message: "Ảnh danh mục đã được chọn." });
    } else {
      setItemImage(file);
      notification.success({ message: "Ảnh danh mục đã được chọn." });
    }
    return false;
  };

  // const handleDeletePreviewImage = () => {
  //   setPreviewImage("");
  //   if (mode === "add-category" || mode === "edit-category") {
  //     setCategoryImage(null);
  //   } else {
  //     setItemImage(null);
  //   }
  //   notification.info({ message: "Ảnh preview đã bị xoá." });
  // };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      notification.warning({ message: "Vui lòng nhập tên danh mục!" });
      return;
    }
    if (!categoryImage) {
      notification.warning({ message: "Vui lòng nhập ảnh danh mục!" });
      return;
    }
    const now = getNow();
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("created_at", now);
    formData.append("updated_at", now);
    if (categoryImage) formData.append("image", categoryImage);
    formData.append("items", JSON.stringify([]));

    createCategory(
      {
        resource: "admin/categories/insert",
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Thêm danh mục thành công!" });
          refetch();
          onClose();
        },
        onError: () => {
          notification.error({ message: "Thêm danh mục thất bại!" });
        },
      }
    );
  };

  const handleAddItem = () => {
    if (!itemName.trim()) {
      notification.warning({ message: "Vui lòng nhập tên mục con!" });
      return;
    }
    console.log("Tên mục con: ", itemName);
    if (!itemImage) {
      notification.warning({ message: "Vui lòng chọn ảnh mục con!" });
      return;
    }

    const now = getNow();
    const newItemId = Date.now();
    const newItem = { id: newItemId, name: itemName, image: "" };
    const updatedItems = [...(parentCategory.items || []), newItem];
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("updated_at", now);
    formData.append("items", JSON.stringify(updatedItems));
    formData.append("image", itemImage);
    formData.append("new_item_id", newItemId.toString());
    formData.append("parent_id", parentCategory.id);

    createCategory(
      {
        resource: "admin/categories/insert",
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Thêm mục con thành công!" });
          refetch();
          onClose();
        },
        onError: () => {
          notification.error({ message: "Thêm mục con thất bại!" });
        },
      }
    );
  };

  const handleSave = () => {
    const now = getNow();
    if (mode === "add-category") return handleAddCategory();
    if (mode === "add-item") return handleAddItem();

    if (mode === "edit-category") {
      if (!categoryName.trim()) {
        notification.warning({ message: "Vui lòng nhập tên danh mục!" });
        return;
      }
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("updated_at", now);
      if (categoryImage) formData.append("image", categoryImage);
      formData.append("items", JSON.stringify(editingCategory.items || []));
      formData.append("_method", "PATCH");

      createCategory(
        {
          resource: `admin/categories/update/${editingCategory.id}`,
          values: formData,
          meta: { headers: { "Content-Type": "multipart/form-data" } },
        },
        {
          onSuccess: () => {
            notification.success({ message: "Cập nhật danh mục thành công!" });
            refetch();
            onClose();
          },
          onError: () => {
            notification.error({ message: "Cập nhật danh mục thất bại!" });
          },
        }
      );
    }

    if (mode === "edit-item") {
      if (!itemName.trim()) {
        notification.warning({ message: "Vui lòng nhập tên danh mục con!" });
        return;
      }
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("updated_at", now);
      formData.append("parent_id", parentCategory.id);
      formData.append("_method", "PATCH");
      if (itemImage) formData.append("image", itemImage);

      createCategory(
        {
          resource: `admin/categories/update/${editingItem.id}`,
          values: formData,
          meta: { headers: { "Content-Type": "multipart/form-data" } },
        },
        {
          onSuccess: () => {
            notification.success({
              message: "Cập nhật danh mục con thành công!",
            });
            refetch();
            onClose();
          },
          onError: () => {
            notification.error({ message: "Cập nhật danh mục con thất bại!" });
          },
        }
      );
    }
  };

  const handleDelete = (id: number, items?: any[]) => {
    if (items && items.length > 0) {
      return notification.warning({
        message: "Danh mục có danh mục con, không thể xoá!",
      });
    }

    Modal.confirm({
      title: "Bạn có chắc muốn xóa danh mục này?",
      onOk: () => {
        deleteCategory(
          {
            resource: "admin/categories/delete",
            id,
            meta: { method: "delete" },
          },
          {
            onSuccess: () => {
              notification.success({ message: "Xoá thành công!" });
              refetch();
            },
            onError: () => {
              notification.error({ message: "Xoá thất bại!" });
            },
          }
        );
      },
    });
  };

  const categoryList = data?.data;

  return (
    <div className="p-2 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Quản lý danh mục sản phẩm</h1>
      <div className="flex gap-4 items-start overflow-x-auto">
        {Array.isArray(categoryList) && categoryList.length > 0 ? (
          categoryList.map((category: any) => (
            <Card
              key={category.id}
              title={
                <span className="font-semibold text-base">{category.name}</span>
              }
              bodyStyle={{ padding: 12 }}
              className="w-90  rounded-2xl border border-gray-100 !bg-gray-100 shadow-sm flex-shrink-0"
              extra={
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => showDrawer(category)}>
                        Sửa
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          handleDelete(category.id, category.items)
                        }
                      >
                        Xóa
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <MoreOutlined className="text-gray-500 cursor-pointer" />
                </Dropdown>
              }
            >
              <div className=" flex flex-col gap-3">
                {Array.isArray(category.items) && category.items.length > 0 ? (
                  category.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm w-full"
                      style={{ minWidth: 200 }}
                    >
                      <div className="flex items-center gap-3">
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
                              onClick={() =>
                                showDrawer(undefined, item, category)
                              }
                            >
                              Sửa
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => {
                                Modal.confirm({
                                  title:
                                    "Bạn có chắc muốn xóa danh mục con này?",
                                  onOk: () => {
                                    deleteCategory(
                                      {
                                        resource: "admin/categories/delete",
                                        id: item.id,
                                      },
                                      {
                                        onSuccess: () => {
                                          notification.success({
                                            message:
                                              "Xoá danh mục con thành công!",
                                          });
                                          refetch();
                                        },
                                        onError: () => {
                                          notification.error({
                                            message:
                                              "Xoá danh mục con thất bại!",
                                          });
                                        },
                                      }
                                    );
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
                  <div className="ml-3 text-gray-500">
                    Không có danh mục con
                  </div>
                )}
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => showDrawer(undefined, undefined, category)}
                  className="rounded-lg border border-blue-500"
                  style={{
                    backgroundColor: "#f5f6f8",
                    color: "#22689B",
                    fontWeight: 500,
                  }}
                >
                  <p className="text-left"> Thêm danh mục con</p>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-gray-500">Không có danh mục</div>
        )}
        <Card
          className="w-64 rounded-xl border border-gray-200 bg-[#f5f6f8] shadow-sm flex-shrink-0"
          bodyStyle={{ padding: 10 }}
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
            Thêm danh mục
          </Button>
        </Card>
      </div>
      <Drawer
        className="relative"
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
                style={{ backgroundColor: "#22689B", color: "white" }}
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
        {isLoading ? (
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          ""
        )}

        {(mode === "add-category" || mode === "edit-category") && (
          <>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục"
              style={{ marginBottom: 12 }}
            />
            <Upload
              beforeUpload={handleBeforeUpload}
              listType="picture"
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh danh mục</Button>
            </Upload>
          </>
        )}
        {(mode === "add-item" || mode === "edit-item") && (
          <>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nhập tên danh mục con"
              style={{ marginBottom: 12 }}
            />
            <Upload
              beforeUpload={handleBeforeUpload}
              listType="picture"
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh danh mục con</Button>
            </Upload>
          </>
        )}
        {previewImage && (
          <div className="mt-4 mb-2 ">
            <Image
              src={previewImage}
              alt="Ảnh preview"
              style={{ maxHeight: 150, borderRadius: 6 }}
              preview
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Category;
