import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Dropdown,
  Menu,
  Pagination,
  notification,
  Modal,
  Input,
} from "antd";
import { FaEdit } from "react-icons/fa";
import { useList, useDelete } from "@refinedev/core";
import AddKhuyenMai from "./AddCoupon";
import EditCoupon from "./EditCoupon";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const CouponsList = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(""); // giữ keyword thực tế
  const [cacheBuster, setCacheBuster] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useList({
    resource: `admin/coupons?page=${currentPage}&keyword=${encodeURIComponent(searchTrigger)}&t=${cacheBuster}`,
    config: { hasPagination: false },
    queryOptions: {
      keepPreviousData: true,
      select: (response) => {
        const items = Array.isArray(response?.data)
          ? response.data
          : response?.data?.data ?? [];
        const metaL = response?.meta || response?.data?.meta || {};
        const total = metaL.total || 0;
        return { data: items, total, metaL };
      },
    },
  });

  const { mutate: deleteCoupon } = useDelete();

  const handleEdit = (record: any) => {
    setSelectedCoupon(record);
    setEditVisible(true);
  };

  const handleCloseEditDrawer = () => {
    setEditVisible(false);
    setSelectedCoupon(null);
  };

  const handleDelete = (id: any) => {
    deleteCoupon(
      {
        resource: "admin/coupons",
        id,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Xóa thành công",
            description: `Chương trình khuyến mãi ID ${id} đã được xóa.`,
          });
          setCacheBuster((prev) => prev + 1); // ép reload
        },
        onError: () => {
          notification.error({
            message: "Lỗi khi xóa",
            description: "Vui lòng thử lại.",
          });
        },
      }
    );
  };

  const showDeleteConfirm = (id: any) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => handleDelete(id),
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setCacheBuster((prev) => prev + 1); // ép gọi lại với trang mới
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTrigger(keyword.trim());
    setCacheBuster((prev) => prev + 1); // ép gọi lại API
  };

  const formatDateTimeVN = (value: any) => {
    return dayjs(value).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) =>
        ((data?.metaL?.current_page || currentPage) - 1) * pageSize + index + 1,
    },
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã khuyến mãi",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value: any) => `${value}%`,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "time_start",
      key: "time_start",
      render: formatDateTimeVN,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "time_end",
      key: "time_end",
      render: (value: any) =>
        value ? (
          formatDateTimeVN(value)
        ) : (
          <span className="italic text-gray-500">Không thời hạn</span>
        ),
    },
    {
      title: "Số tiền tối thiểu",
      dataIndex: "min_price_order",
      key: "min_price_order",
      render: (amount: any) => `${amount} VND`,
    },
    {
      title: "Số tiền tối đa",
      dataIndex: "max_price_discount",
      key: "max_price_discount",
      render: (amount: any) => `${amount} VND`,
    },
    {
      title: "Số lần sử dụng",
      dataIndex: "limit_use",
      key: "limit_use",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) =>
        is_active ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Hết hiệu lực</Tag>
        ),
    },
    {
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button type="link">
            <span className="text-black text-xs font-semibold">⋮</span>
          </Button>
        </Dropdown>
      ),
    },
  ];

const menu = (record: any) => {
  return (
    <Menu>
      {record.is_active ? (
        <Menu.Item onClick={() => handleEdit(record)}>Sửa</Menu.Item>
      ) : null}
      <Menu.Item onClick={() => showDeleteConfirm(record.id)}>Xóa</Menu.Item>
    </Menu>
  );
};

  return (
    <div className="coupons-list p-5 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">
        Danh sách chương trình khuyến mãi
      </h1>

      {/* Tìm kiếm + Thêm */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex gap-2">
          <Input
            placeholder="Tìm theo tên, mã khuyến mãi..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <Button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
          icon={<FaEdit />}
          onClick={() => setVisible(true)}
        >
          Thêm chương trình khuyến mãi
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        pagination={false}
        rowKey="id"
        loading={isLoading}
        className="border border-gray-300 rounded-lg"
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          size="small"
          current={data?.metaL?.current_page || currentPage}
          pageSize={data?.metaL?.per_page || pageSize}
          total={data?.metaL?.total || 0}
          onChange={handlePageChange}
        />
      </div>

      {/* Add & Edit */}
      <AddKhuyenMai visible={visible} onClose={() => setVisible(false)} />
      <EditCoupon
        visible={editVisible}
        onClose={handleCloseEditDrawer}
        couponData={selectedCoupon}
        onSuccessEdit={() => setCacheBuster((prev) => prev + 1)}
      />
    </div>
  );
};

export default CouponsList;
