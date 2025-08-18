import React from "react";
import { Drawer, Spin, Tag } from "antd";
import { useOne } from "@refinedev/core";

interface ContactDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  contactId: number | null;
}

const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  open,
  onClose,
  contactId,
}) => {
  const { data, isLoading } = useOne({
    resource: "admin/contact",
    id: contactId || 0,
    queryOptions: {
      enabled: !!contactId, // chỉ gọi khi có id
    },
  });

  const contact = data?.data;

  const formatDate = (dateStr?: string) => {
    try {
      return dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "Không xác định";
    } catch {
      return "Không xác định";
    }
  };

  return (
    <Drawer
      title="Chi tiết liên hệ"
      open={open}
      onClose={onClose}
      destroyOnClose
      width={550}
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : contact ? (
        <div className="space-y-3">
          <p><b>Họ tên:</b> {contact.name}</p>
          <p><b>Email:</b> {contact.email}</p>
          <p><b>SĐT:</b> {contact.phone}</p>
          <p><b>Tiêu đề:</b> {contact.title}</p>
          <p>
            <b>Nội dung:</b>
            <div className="border p-2 rounded bg-gray-50 mt-1">
              {contact.content}
            </div>
          </p>
          <p>
            <b>Trạng thái:</b>{" "}
            {contact.is_read ? (
              <Tag color="green">Đã đọc</Tag>
            ) : (
              <Tag color="red">Chưa đọc</Tag>
            )}
          </p>
          <p><b>Ngày tạo:</b> {formatDate(contact.created_at)}</p>
        </div>
      ) : (
        <p>Không tìm thấy liên hệ.</p>
      )}
    </Drawer>
  );
};

export default ContactDetailDrawer;
