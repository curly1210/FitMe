/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCustom } from "@refinedev/core";
import { Button, Input, Skeleton, Table } from "antd";
import { useState } from "react";
import DetailWallet from "./DetailWallet";

const { Search } = Input;

const ListWallet = () => {
  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số item mỗi trang

  const [searchText, setSearchText] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<any>(null);

  const handleSearchText = (value: any) => {
    setSearchText(value || "");
  };

  const {
    data: responseWallet,
    isLoading: isloadingListWallet,
    refetch: refetchListWallet,
  } = useCustom({
    method: "get",
    url: "admin/wallet",
    config: {
      query: {
        page: currentPage,
        per_page: pageSize,
        search: searchText,
      },
    },
  });

  // console.log(responseWallet);

  const columns = [
    {
      title: "Tên khách hàng",
      key: "user_name",
      dataIndex: "user_name",
    },

    {
      title: "Số điện thoại",
      key: "user_phone",
      dataIndex: "user_phone",
    },
    {
      title: "Email",
      key: "user_email",
      dataIndex: "user_email",
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Chi tiết",
      render: (_: any, wallet: any) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedWalletId(wallet?.id);
            // setSelectedTransactionId(transaction.id);
            setDrawerOpen(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const transactions =
    responseWallet?.data?.data.map((wallet: any) => ({
      ...wallet,
      key: wallet.id,
    })) || [];

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Danh sách ví</h1>

      <div className="flex gap-3 mb-5">
        <Search
          placeholder="Tìm kiếm"
          onChange={(e: any) => handleSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
      </div>

      <div>
        {isloadingListWallet ? (
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
              total: responseWallet?.data?.meta.total, // tổng số bản ghi
              onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
              },
            }}
          />
        )}
      </div>

      <DetailWallet
        walletId={selectedWalletId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedWalletId(null);
        }}
      />
    </div>
  );
};
export default ListWallet;
