import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Image,
  Tooltip,
  Popconfirm,
  message,
  Spin,
} from "antd";
import { useList, useDelete } from "@refinedev/core";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import PostDrawerAdd from "./PostDrawerAdd";
import PostDrawerEdit from "./PostDrawerEdit";
import DetailPostDrawer from "./DetailPostDrawer";

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  thumbnail: string;
  thumbnails?: string[];
  is_active: number;
  created_at: string;
  updated_at: string;
}

const PostList = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
  const [openDrawerDetail, setOpenDrawerDetail] = useState(false);
  const [actionPost, setActionPost] = useState<null | Post>(null);
  const [detailPostId, setDetailPostId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [isDeleting, setIsDeleting] = useState(false); // ⭐️ trạng thái loading toàn màn hình

  const { data, isLoading, refetch } = useList<Post>({
    resource: "admin/posts",
    pagination: {
      current: currentPage,
      pageSize,
    },
  });

  const { mutate: deletePost } = useDelete();

  const handleDelete = (id: number) => {
    setIsDeleting(true); // 👉 Bắt đầu loading toàn màn hình
    deletePost(
      {
        resource: "admin/posts",
        id,
      },
      {
        onSuccess: () => {
          message.success("Đã xoá bài viết");
          refetch();
        },
        onError: () => {
          message.error("Lỗi khi xoá bài viết");
        },
        onSettled: () => {
          setIsDeleting(false); // 👉 Tắt loading sau khi xoá
        },
      }
    );
  };

  const columns: ColumnsType<Post> = [
    {
      title: "STT",
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
      render: (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const text = doc.body.textContent?.trim().slice(0, 100) || "";
        const imgEl = doc.querySelector("img");
        const imgSrc = imgEl?.getAttribute("src");

        return (
          <div className="flex gap-2 items-center max-w-[250px]">
            {imgSrc && (
              <Image
                src={imgSrc}
                width={60}
                height={60}
                alt="content-img"
                className="rounded-md border"
                preview={false}
              />
            )}
            <Tooltip title={text}>
              <span className="truncate text-gray-700">{text}</span>
            </Tooltip>
          </div>
        );
      },
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
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setDetailPostId(record.id);
              setOpenDrawerDetail(true);
            }}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => {
              setActionPost(record);
              setOpenDrawerEdit(true);
            }}
          >
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

  return (
    <Spin spinning={isDeleting} tip="Đang xoá bài viết...">
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
          dataSource={
            (data?.data?.data ?? []).map((item) => ({
              ...item,
              thumbnails: item.thumbnail ? [item.thumbnail] : [],
            }))
          }
          rowKey="id"
          loading={isLoading}
          scroll={{ x: true }}
          pagination={{
            current: currentPage,
            pageSize,
            total: data?.data?.total ?? 0,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
        />

        <PostDrawerAdd
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
            refetch();
          }}
        />
        <PostDrawerEdit
          open={openDrawerEdit}
          onClose={() => {
            setOpenDrawerEdit(false);
            refetch();
          }}
          post={actionPost}
        />
        <DetailPostDrawer
          open={openDrawerDetail}
          onClose={() => setOpenDrawerDetail(false)}
          postId={detailPostId}
        />
      </div>
    </Spin>
  );
};

export default PostList;
