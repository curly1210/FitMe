/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined, SwapRightOutlined } from "@ant-design/icons";
import { useCustom } from "@refinedev/core";
import {
  Collapse,
  ConfigProvider,
  DatePicker,
  Pagination,
  Select,
  Skeleton,
  Tag,
} from "antd";
import { CollapseProps } from "antd/lib";
import { useState } from "react";
import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";

const { Option } = Select;

const WithDrawHistory = () => {
  // const { data: responseTransaction, isLoading } = useList({
  //   resource: "wallet/transaction",
  // });

  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại
  const [pageSize, setPageSize] = useState(10); // số item mỗi trang

  const [fromDate, setFromDate] = useState<dayjs.Dayjs | undefined>(undefined);
  const [toDate, setToDate] = useState<dayjs.Dayjs | undefined>(undefined);
  const [status, setStatus] = useState(undefined);

  const { data: responseTransaction, isFetching } = useCustom({
    method: "get",
    url: "wallet/transaction",
    config: {
      query: {
        page: currentPage,
        per_page: pageSize,
        status: status,
        date_from: fromDate?.format("YYYY-MM-DD"),
        date_to: toDate?.format("YYYY-MM-DD"),
      },
    },
  });

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleChangeStatus = (value: any) => {
    setStatus(value);
    // console.log("Trạng thái đã chọn:", value);
  };

  // console.log(responseTransaction);

  const items: CollapseProps["items"] = responseTransaction?.data?.data?.map(
    (item: any) => ({
      key: item.id.toString(),
      label: (
        <div className="flex justify-between items-center w-full">
          <div className="grid grid-cols-2 w-2/3 items-center">
            <span
              className={`font-bold text-lg ${
                item?.type === "refund" ? "text-green-600" : "text-red-600"
              } `}
            >
              {item?.type === "refund" ? "+" : "-"}{" "}
              {item?.amount.toLocaleString().replace(/,/g, ".")} ₫
            </span>
            <span className="text-gray-500">{item?.created_at}</span>
          </div>
          {item?.status === "accept" ? (
            <Tag color="green" className="font-bold">
              Đã duyệt
            </Tag>
          ) : item?.status === "pending" ? (
            <Tag color="orange" className="font-bold">
              Đang xử lý
            </Tag>
          ) : (
            <Tag color="red" className="font-bold">
              Từ chối
            </Tag>
          )}
        </div>
      ),
      children: (
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">
            Chi tiết Giao dịch
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="font-medium text-gray-700">
                {item?.status === "accept"
                  ? "Đã duyệt"
                  : item?.status === "pending"
                  ? "Đang xử lý"
                  : "Từ chối"}
              </span>
            </div>

            {item?.type === "refund" && (
              <div className="flex justify-between">
                <span className="text-gray-500">Nội dung:</span>
                <span className=" text-gray-700">
                  Hoàn tiền từ đơn <span className="font-bold">#F3F4F6</span>
                </span>
              </div>
            )}
            {/* 
            {request.rejectionReason && (
              <div className="pt-2">
                <p className="text-gray-500 font-medium">Lý do từ chối:</p>
                <p className="text-red-700 bg-red-50 p-3 rounded-md mt-1">
                  {request.rejectionReason}
                </p>
              </div>
            )}

            {request.proofImageUrl && (
              <div className="pt-2">
                <p className="text-gray-500 font-medium mb-2">
                  Minh chứng chuyển khoản:
                </p>
                <img
                  src={request.proofImageUrl}
                  alt="Minh chứng chuyển khoản"
                  className="rounded-lg border border-gray-300 w-full max-w-sm mx-auto"
                />
              </div>
            )} */}
          </div>
        </div>
      ),
    })
  );

  // const items: CollapseProps["items"] = [
  //   {
  //     key: "1",
  //     label: (
  //       <div className="flex justify-between items-center w-full">
  //         <div className="grid grid-cols-2 w-2/3">
  //           <span className="font-bold text-lg ">1.250.000 ₫</span>
  //           <span className="text-gray-500">25 tháng 7, 2024</span>
  //         </div>
  //         <Tag color="green">Đã duyệt</Tag>
  //       </div>
  //     ),
  //     children: <p>cuong</p>,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <div className="flex justify-between items-center w-full">
  //         <div className="grid grid-cols-2 w-2/3">
  //           <span className="font-bold text-lg ">9.000 ₫</span>
  //           <span className="text-gray-500">25 tháng 7, 2024</span>
  //         </div>
  //         <Tag color="green">Đã duyệt</Tag>
  //       </div>
  //     ),
  //     children: <p>cuong</p>,
  //   },
  //   {
  //     key: "3",
  //     label: (
  //       <div className="flex justify-between items-center w-full">
  //         <div className="grid grid-cols-2 w-2/3">
  //           <span className="font-bold text-lg ">1.250.000 ₫</span>
  //           <span className="text-gray-500">25 tháng 7, 2024</span>
  //         </div>
  //         <Tag color="green">Đã duyệt</Tag>
  //       </div>
  //     ),
  //     children: <p>cuong</p>,
  //   },
  // ];

  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch sử rút tiền</h3>

      <div className="grid grid-cols-12 mb-4 gap-x-3">
        <div className="col-span-4">
          <Select
            className="w-full"
            allowClear
            placeholder="Chọn trạng thái"
            onChange={handleChangeStatus}
          >
            {/* <Option value={undefined}>Tất cả</Option> */}
            <Option value="pending">Đang chờ</Option>
            <Option value="reject">Từ chối</Option>
            <Option value="accept">Đã duyệt</Option>
          </Select>
          {/* <Search
            placeholder="Tìm kiếm mã đơn hàng"
            // onChange={(e: any) => handleSearchText(e.target.value)}
            // style={{ width: 300 }}
            allowClear
          /> */}
        </div>

        <div className="flex gap-2 col-span-8 !w-full">
          <ConfigProvider locale={viVN}>
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Từ ngày"
              value={fromDate}
              onChange={(date) => setFromDate(date)}
              allowClear
              className="!w-full"
            />
          </ConfigProvider>

          <SwapRightOutlined className="text-2xl !text-gray-500" />

          <ConfigProvider locale={viVN}>
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Đến ngày"
              value={toDate}
              onChange={(date) => setToDate(date)}
              className="!w-full"
              allowClear
            />
          </ConfigProvider>
        </div>
      </div>

      {isFetching ? (
        <div className="relative">
          <Skeleton active />
          {/* <Spin
            className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          /> */}
        </div>
      ) : // ) : responseTransaction?.data?.data.length > 0 ? (
      responseTransaction?.data?.data.length > 0 ? (
        <div>
          <Collapse
            items={items}
            defaultActiveKey={["0"]}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <RightOutlined
                rotate={isActive ? 270 : 90} // Xoay icon khi mở
                style={{ fontSize: "14px" }}
              />
            )}
          />

          <div className="flex justify-center mt-2">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={responseTransaction?.data?.meta?.total}
              // showSizeChanger
              onChange={handlePageChange}
              style={{ marginTop: 16, textAlign: "right" }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-10 px-4 border border-gray-300 rounded-lg">
          <p className="text-gray-500">Không tìm thấy yêu cầu nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};
export default WithDrawHistory;
