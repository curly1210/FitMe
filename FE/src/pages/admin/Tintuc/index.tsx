import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Image,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import { useList, useDelete } from "@refinedev/core";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PostDrawerAdd from "./PostDrawerAdd";

// 1. Interface
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  thumbnails: string[];
  is_active: number;
  created_at: string;
  updated_at: string;
}

// 2. Component
const PostList = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  // ✨ Thêm quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading } = useList<Post>({
    resource: "admin/posts",
    pagination: {
      current: currentPage,
      pageSize: pageSize,
    },
  });

  const { mutate: deletePost } = useDelete();

  const handleDelete = (id: number) => {
    deletePost(
      {
        resource: "admin/posts",
        id,
      },
      {
        onSuccess: () => {
          message.success("Đã xoá bài viết");
        },
        onError: () => {
          message.error("Lỗi khi xoá bài viết");
        },
      }
    );
  };

  // 3. Cột bảng
  const columns: ColumnsType<Post> = [
    {
      title: "STT",
      dataIndex: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnails",
      render: (thumbnails?: string[]) => (
        <div className="flex gap-2">
          {(thumbnails ?? []).map((src, idx) => (
            <Image
              key={idx}
              src={src}
              width={60}
              height={60}
              alt={`thumb-${idx}`}
              className="rounded-md border"
              preview={false}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (text: string) => (
        <Tooltip title={text}>
          <div className="max-w-[250px] truncate text-gray-700">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (text: string) => (
        <span className="text-sm text-blue-500 italic">{text}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (active: number) =>
        active === 1 ? (
          <Tag color="green">Hiển thị</Tag>
        ) : (
          <Tag color="red">Ẩn</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} type="primary" size="small">
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xoá bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // 4. Render
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách bài viết</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenDrawer(true)}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          total: data?.total ?? 0,
        }}
        scroll={{ x: true }}
      />

      {/* Drawer Add */}
      <PostDrawerAdd open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </div>
  );
};

export default PostList;
