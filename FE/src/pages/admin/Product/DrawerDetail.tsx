import {
  Drawer,
  Button,
  Skeleton,
  Dropdown,
  Modal,
  notification,
  Select,
} from "antd";
import { useOne, useDelete, useUpdate } from "@refinedev/core";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useState } from "react";

const { Option } = Select;

interface DrawerDetailProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
}

const DrawerDetail: React.FC<DrawerDetailProps> = ({ open, onClose, productId }) => {
  const { data, isLoading, refetch } = useOne({
    resource: `admin/products/${productId}/comments`,
    id: "",
    queryOptions: {
      enabled: !!productId && open,
    },
  });

  const { mutate: deleteComment } = useDelete();
  const { mutate: updateCommentStatus } = useUpdate();

  const handleDeleteComment = (commentId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa bình luận",
      content: "Bạn có chắc chắn muốn xóa bình luận này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteComment(
          {
            resource: "admin/comments",
            id: `${commentId}/delete`,
          },
          {
            onSuccess: () => {
              notification.success({
                message: "Xóa thành công",
                description: "Bình luận đã được xóa.",
              });
              refetch();
            },
            onError: (error) => {
              notification.error({
                message: "Xóa thất bại",
                description: error.message,
              });
            },
          }
        );
      },
    });
  };

  const product = data?.data;

  // State cho Drawer sửa
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const openEditDrawer = (comment: any) => {
    setEditingComment(comment);
    setSelectedStatus(comment.is_active);
    setEditDrawerOpen(true);
  };

  const handleSaveStatus = () => {
    if (selectedStatus === editingComment.is_active) {
      notification.info({
        message: "Không có thay đổi",
        description: "Trạng thái không thay đổi.",
      });
      return;
    }

    updateCommentStatus(
      {
        resource: "admin/comments",
        id: `${editingComment.id}/toggle`,
        values: {}, // Không gửi gì cả, BE tự xử lý toggle
        meta: {},   // Nếu bạn cần thêm header/custom config
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Cập nhật thành công",
            description: "Trạng thái bình luận đã được thay đổi.",
          });
          setEditDrawerOpen(false);
          refetch();
        },
        onError: (error) => {
          notification.error({
            message: "Cập nhật thất bại",
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <>
      <Drawer
        title="Chi tiết sản phẩm"
        placement="right"
        width={600}
        onClose={onClose}
        open={open}
        footer={
          <div className="text-right">
            <Button onClick={onClose}>Đóng</Button>
          </div>
        }
      >
        {isLoading || !product ? (
          <Skeleton active />
        ) : (
          <div className="space-y-5">
            {/* Thông tin sản phẩm */}
            <div className="flex gap-4 items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded border"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500">{product.description}</p>
                <p className="text-green-600 font-bold text-lg">
                  {Number(product.price || 0).toLocaleString()}₫
                </p>
                <p className="text-sm text-gray-600">
                  Tồn kho: {product.total_inventory}
                </p>
                <p className="text-sm text-gray-600">
                  Trạng thái:{" "}
                  <span
                    className={
                      product.is_active ? "text-green-600" : "text-red-500"
                    }
                  >
                    {product.is_active ? "Hiển thị" : "Đang ẩn"}
                  </span>
                </p>
              </div>
            </div>

            {/* Bình luận */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Bình luận:</h3>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                {product.comments?.length > 0 ? (
                  product.comments.map((comment: any) => {
                    const menuItems: MenuProps["items"] = [
                      {
                        key: "edit",
                        label: "Sửa trạng thái",
                        onClick: () => openEditDrawer(comment),
                      },
                      {
                        key: "delete",
                        label: <span className="text-red-500">Xóa</span>,
                        onClick: () => handleDeleteComment(comment.id),
                      },
                    ];

                    return (
                      <div
                        key={comment.id}
                        className="relative rounded p-3 bg-gray-50 border shadow-sm"
                      >
                        <div className="absolute top-2 right-2">
                          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                            <EllipsisOutlined className="cursor-pointer text-gray-500 hover:text-gray-700 text-lg" />
                          </Dropdown>
                        </div>

                        <p className="font-medium text-sm">
                          {comment.user?.name ?? "Ẩn danh"}
                        </p>

                        <p className="text-sm text-gray-700">{comment.content}</p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-600">
                          Trạng thái:{" "}
                          <span
                            className={
                              comment.is_active === 1
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {comment.is_active === 1 ? "Hiển thị" : "Đang ẩn"}
                          </span>
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Chưa có bình luận nào.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Drawer sửa trạng thái */}
      <Drawer
        title="Sửa trạng thái bình luận"
        placement="right"
        width={360}
        onClose={() => setEditDrawerOpen(false)}
        open={editDrawerOpen}
        footer={
          <div className="text-right">
            <Button onClick={() => setEditDrawerOpen(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" onClick={handleSaveStatus}>
              Lưu
            </Button>
          </div>
        }
      >
        {editingComment && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Trạng thái bình luận:</p>
            <Select
              style={{ width: "100%" }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
            >
              <Option value={1}>Hiển thị</Option>
              <Option value={0}>Đang ẩn</Option>
            </Select>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default DrawerDetail;
