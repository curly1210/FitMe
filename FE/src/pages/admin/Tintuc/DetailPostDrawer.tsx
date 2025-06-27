import React from "react";
import { Drawer, Image, Spin, Tag } from "antd";
import { useOne } from "@refinedev/core";

interface DetailPostDrawerProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
}

const DetailPostDrawer: React.FC<DetailPostDrawerProps> = ({
  open,
  onClose,
  postId,
}) => {
  const { data, isLoading } = useOne({
    resource: "admin/posts",
    id: postId || 0,
    queryOptions: {
      enabled: !!postId, // chỉ gọi khi có id
    },
  });

const post = data?.data?.data;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr.slice(0, 19)).toLocaleString("vi-VN");
    } catch {
      return "Không xác định";
    }
  };

  return (
    <Drawer
      title="Chi tiết bài viết"
      open={open}
      onClose={onClose}
      destroyOnClose
      width={650}
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : post ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{post.title}</h2>

          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              width={300}
              alt="thumbnail"
              style={{ borderRadius: 8 }}
            />
          )}

          <div>
            <strong>Slug:</strong>{" "}
            <span className="italic text-blue-500">{post.slug}</span>
          </div>

          <div>
            <strong>Trạng thái:</strong>{" "}
            {post.is_active ? (
              <Tag color="green">Hiển thị</Tag>
            ) : (
              <Tag color="red">Ẩn</Tag>
            )}
          </div>

          <div>
            <strong>Nội dung:</strong>
            <div
              className="border p-3 rounded bg-gray-50 mt-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div>
            <strong>Ngày tạo:</strong> {formatDate(post.created_at)}
          </div>
          <div>
            <strong>Ngày cập nhật:</strong> {formatDate(post.updated_at)}
          </div>
        </div>
      ) : (
        <p>Không tìm thấy bài viết.</p>
      )}
    </Drawer>
  );
};

export default DetailPostDrawer;
