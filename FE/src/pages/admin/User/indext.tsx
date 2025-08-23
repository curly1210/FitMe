/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrudFilters, useList, useUpdate } from "@refinedev/core";
import { Col, Dropdown, Input, Menu, Row, Select, Table } from "antd";
import { useState } from "react";
import Detail from "./detail";
import DashboardUser from "../Dashboard/thongKeKhachHang";

const User = () => {
  const { mutate } = useUpdate();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );

  // Tính toán _start và _end theo page & pageSize backend dùng
  const _start = (current - 1) * pageSize;
  const _end = current * pageSize;

  const filters: CrudFilters = [];

  if (searchName) {
    filters.push({
      field: "search",
      operator: "eq",
      value: searchName,
    });
  }

  if (statusFilter !== undefined) {
    filters.push({
      field: "is_ban",
      operator: "eq",
      value: statusFilter,
    });
  }

  const { data, isLoading } = useList({
    resource: "admin/users",
    filters,
    hasPagination: true,
    pagination: {
      current,
      pageSize,
    },
    meta: {
      _start,
      _end,
    },
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Ngày sinh", dataIndex: "birthday", key: "birthday" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    {
      title: "Trạng thái",
      dataIndex: "is_ban",
      key: "is_ban",
      render: (value: number) => {
        if (value === 0)
          return <span style={{ color: "green" }}>Hoạt động</span>;
        if (value === 1) return <span style={{ color: "red" }}>Khóa</span>;
        return <span>Không xác định</span>;
      },
    },
    {
      render: (_: any, record: any) => {
        const hanlToggleBan = () => {
          mutate(
            {
              resource: "admin/users/lock",
              id: record.id,
              values: {
                is_ban: record.is_ban === 0 ? 1 : 0,
              },
              successNotification: () => ({
                message: "Cập nhật thành công",
                description: `Người dùng đã được ${
                  record.is_ban === 0 ? "khóa" : "mở khóa"
                }`,
                type: "success",
              }),
            },
            {
              onSuccess: () => {
                window.location.reload();
              },
            }
          );
        };

        const menu = (
          <Menu>
            <Menu.Item
              key="detail"
              onClick={() => {
                setSelectedRecord(record);
                setDrawerOpen(true);
              }}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item key="toggle_ban" onClick={hanlToggleBan}>
              {record.is_ban === 0 ? "Khóa" : "Mở khóa"}
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <span style={{ cursor: "pointer", fontSize: 20 }}>⋯</span>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <Row className="w-full">
          <DashboardUser />
        </Row>
        {/* Thanh tìm kiếm & lọc */}
        <div style={{ width: 1310 }} className="ml-4.75">
          <Row className="flex gap-3 mb-4 flex-wrap">
            <Input
              size="middle"
              placeholder="Tìm theo tên"
              allowClear
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="!h-10" // ép height 40px
              style={{ width: 250 }}
            />

            <Col span={8}>
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrent(1);
                }}
                size="middle"
                className="!h-10 [&_.ant-select-selector]:!h-10"
                style={{ width: 200 }}
              >
                <Select.Option value={undefined}>Tất cả</Select.Option>
                <Select.Option value={0}>Hoạt động</Select.Option>
                <Select.Option value={1}>Khóa</Select.Option>
              </Select>
            </Col>
          </Row>

          <Table
            className="border-gray rounded-2xl"
            dataSource={data?.data ?? []}
            columns={columns}
            loading={isLoading}
            rowKey="id"
            pagination={{
              current,
              pageSize,
              total: data?.meta?.total ?? 0,
              showSizeChanger: true,
              onChange: (page, size) => {
                setCurrent(page);
                setPageSize(size);
              },
            }}
          />
        </div>
      </div>
      <Detail
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        record={selectedRecord}
      />
    </>
  );
};

export default User;
