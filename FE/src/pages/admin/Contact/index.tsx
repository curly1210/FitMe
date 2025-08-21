import React, { useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Spin,
  Tag,
} from "antd";
import { useList, useDelete, useUpdate } from "@refinedev/core";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import ContactDetailDrawer from "./DrawercontactDetail";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at?: string;
}

const ContactList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, refetch } = useList<Contact>({
    resource: "admin/contacts", // lấy danh sách
    pagination: {
      current: currentPage,
      pageSize,
    },
  });

  const { mutate: deleteContact } = useDelete();
  const { mutate: updateContact } = useUpdate();

  const handleDelete = (id: number) => {
    setIsDeleting(true);
    deleteContact(
      {
        resource: "admin/contact",
        id,
      },
      {
        onSuccess: () => {
          message.success("Đã xoá liên hệ");
          refetch();
        },
        onError: () => {
          message.error("Lỗi khi xoá liên hệ");
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      }
    );
  };

  const handleToggleRead = (record: Contact) => {
    updateContact(
      {
        resource: "admin/contact", 
        id: record.id,
        values: { is_read: record.is_read ? 0 : 1 },
        meta: { method: "patch" }, 
      },
      {
        onSuccess: () => {
          message.success("Cập nhật trạng thái thành công!");
          refetch();
        },
        onError: () => {
          message.error("Cập nhật trạng thái thất bại!");
        },
      }
    );
  };

  const columns: ColumnsType<Contact> = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="truncate inline-block max-w-[250px]">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_read",
      render: (_, record) => (
        <Tag
          color={record.is_read ? "green" : "red"}
          className="cursor-pointer"
          onClick={() => handleToggleRead(record)}
        >
          {record.is_read ? "Đã đọc" : "Chưa đọc"}
        </Tag>
      ),
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
              setSelectedId(record.id);
              setDrawerOpen(true);
            }}
          >
            Xem
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá liên hệ này?"
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
    <Spin spinning={isDeleting} tip="Đang xoá liên hệ...">
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Danh sách liên hệ</h2>

        <Table
          columns={columns}
          dataSource={data?.data?.data || data?.data || []}
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

        {/* Drawer chi tiết liên hệ */}
        <ContactDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          contactId={selectedId}
        />
      </div>
    </Spin>
  );
};

export default ContactList;
