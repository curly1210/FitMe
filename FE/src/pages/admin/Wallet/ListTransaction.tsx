/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCustom } from "@refinedev/core";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Select,
  Skeleton,
  Table,
  Tag,
} from "antd";
// import Search from "antd/es/transfer/search";
import { useEffect, useState } from "react";
import DetailTransaction from "./DetailTransaction";
import { SwapRightOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import { useNotificationUser } from "../../../hooks/userNotificationUser";

const { Search } = Input;
const { Option } = Select;

const ListTransaction = () => {
  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số item mỗi trang

  const [status, setStatus] = useState(undefined);
  const [typeTransaction, setTypeTransaction] = useState(undefined);
  const [searchText, setSearchText] = useState<any>(undefined);
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | undefined>(undefined);
  const [toDate, setToDate] = useState<dayjs.Dayjs | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const { echo } = useNotificationUser();

  const {
    data: responseTransaction,
    isLoading: isloadingListTransaction,
    refetch: refetchListTransaction,
  } = useCustom({
    method: "get",
    url: "admin/wallet/widraw-request",
    config: {
      query: {
        page: currentPage,
        per_page: pageSize,
        status: status,
        type: typeTransaction,
        search: searchText,
        date_from: fromDate?.format("YYYY-MM-DD"),
        date_to: toDate?.format("YYYY-MM-DD"),
      },
    },
  });

  const transactions =
    responseTransaction?.data?.data.map((transaction: any) => ({
      ...transaction,
      key: transaction.id,
    })) || [];

  useEffect(() => {
    let isMounted = true;

    if (!echo) return;
    const channelName = `admin.notifications`;
    const channel = echo.private(channelName);

    channel.listen(".order", (e: any) => {
      if (isMounted) {
        refetchListTransaction();
      }
    });

    return () => {
      isMounted = false; // chỉ tắt logic, không hủy listener
    };
  }, [echo]);

  const handleSearchText = (value: any) => {
    setSearchText(value || undefined);
  };

  const handleChangeStatus = (value: any) => {
    setStatus(value);
    // console.log("Trạng thái đã chọn:", value);
  };

  const handleChangeType = (value: any) => {
    setTypeTransaction(value);
    // console.log("Trạng thái đã chọn:", value);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Tên khách hàng",
      key: "userName",
      dataIndex: ["user", "name"],
    },

    {
      title: "Ngày tạo",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Loại giao dịch",
      key: "type",
      dataIndex: "type",
      render: (type: string) =>
        type === "withdraw" ? (
          <Tag color="green" className="font-bold ">
            Rút tiền
          </Tag>
        ) : (
          <Tag color="blue" className="font-bold ">
            Hoàn tiền
          </Tag>
        ),
    },
    {
      title: "Số tiền",
      key: "amount",
      dataIndex: "amount",
      render: (amount: string, record: any) => (
        <span
          className={`font-bold text-lg ${
            record?.type === "refund" ? "text-green-600" : "text-red-600"
          } `}
        >
          {record?.type === "refund" ? "+" : "-"}{" "}
          {record?.amount.toLocaleString().replace(/,/g, ".")} ₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status: string) =>
        status === "accept" ? (
          <Tag color="green" className="font-bold">
            Đã duyệt
          </Tag>
        ) : status === "pending" ? (
          <Tag color="orange" className="font-bold">
            Chờ xử lý
          </Tag>
        ) : (
          <Tag color="red" className="font-bold">
            Từ chối
          </Tag>
        ),
    },
    {
      title: "Chi tiết",
      render: (_: any, transaction: any) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedTransactionId(transaction.id);
            setDrawerOpen(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Quản lý giao dịch</h1>

      <div className="flex gap-3 mb-5">
        <Search
          placeholder="Tìm kiếm"
          onChange={(e: any) => handleSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />

        <Select
          className="w-[200px]"
          allowClear
          placeholder="Chọn trạng thái"
          onChange={handleChangeStatus}
        >
          {/* <Option value={undefined}>Tất cả</Option> */}
          <Option value="pending">Đang chờ</Option>
          <Option value="reject">Từ chối</Option>
          <Option value="accept">Đã duyệt</Option>
        </Select>

        <Select
          className="w-[200px]"
          allowClear
          placeholder="Chọn loại giao dịch"
          onChange={handleChangeType}
        >
          <Option value="refund">Hoàn tiền</Option>
          <Option value="withdraw">Rút tiền</Option>
        </Select>

        <ConfigProvider locale={viVN}>
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Từ ngày"
            value={fromDate}
            onChange={(date) => setFromDate(date)}
            allowClear
            className="!w-[250px]"
          />
        </ConfigProvider>

        <SwapRightOutlined className="text-2xl !text-gray-500" />

        <ConfigProvider locale={viVN}>
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Đến ngày"
            value={toDate}
            onChange={(date) => setToDate(date)}
            className="!w-[250px]"
            allowClear
          />
        </ConfigProvider>
      </div>

      <div>
        {isloadingListTransaction ? (
          <Skeleton active />
        ) : (
          <Table
            dataSource={transactions}
            columns={columns}
            pagination={{
              showSizeChanger: false,
              // current: responseTransaction?.data?.meta.current_page, // trang hiện tại
              current: currentPage, // trang hiện tại
              pageSize: pageSize, // số bản ghi mỗi trang
              total: responseTransaction?.data?.meta.total, // tổng số bản ghi
              onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
              },
            }}
          />
        )}
      </div>

      <DetailTransaction
        refetchListTransaction={refetchListTransaction}
        transactionId={selectedTransactionId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTransactionId(null);
        }}
      />
    </div>
  );
};
export default ListTransaction;
