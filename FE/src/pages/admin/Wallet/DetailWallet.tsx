/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOne } from "@refinedev/core";
import { Drawer, Skeleton, Tag } from "antd";

const DetailWallet = ({ open, onClose, walletId }: any) => {
  const { data, isFetching: isFetchingWallet } = useOne({
    resource: "admin/wallet",
    id: walletId || "",
    queryOptions: {
      enabled: open,
    },
  });

  console.log(walletId);

  return (
    <Drawer
      title="Chi tiết ví"
      placement="right"
      width={700}
      onClose={onClose}
      open={open}
    >
      <div className="text-base font-semibold mb-7">Thông tin giao dịch</div>

      {isFetchingWallet ? (
        <Skeleton active />
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-y-8 mb-7">
            <div>
              <p className="text-gray-500">Tên khách hàng</p>
              <p>{data?.data?.user_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Số điện thoại</p>
              <p>{data?.data?.user_phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p>{data?.data?.user_email}</p>
            </div>
            <div>
              <p className="text-gray-500">Số dư</p>
              <Tag color="red" className="!font-bold !text-2xl">
                {data?.data?.balance.toLocaleString().replace(/,/g, ".")} đ
              </Tag>
              {/* <p>{data?.data?.user_email}</p> */}
            </div>

            {/* <div>
              <p className="text-gray-500">Số tiền</p>
              <span
                className={`font-bold text-lg ${
                  data?.data.type === "refund"
                    ? "text-green-600"
                    : "text-red-600"
                } `}
              >
                {data?.data?.type === "refund" ? "+" : "-"}{" "}
                {data?.data?.amount.toLocaleString().replace(/,/g, ".")} ₫
              </span>
            </div> */}
          </div>

          <div className="bg-white p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Thông tin thanh toán
            </h3>
            {data?.data?.bank_account ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tên chủ tài khoản:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.bank_account.account_holder}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tên ngân hàng:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.bank_account.bank_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Số tài khoản:</span>
                  <span className="text-gray-900 text-right">
                    {data?.data?.bank_account.account_number}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 border border-gray-300  rounded-lg flex flex-col  items-center justify-center gap-4">
                {/* <BanknotesIcon className="w-12 h-12 text-gray-400" /> */}
                <div>
                  <p className="text-gray-500">
                    Chưa có thông tin tài khoản ngân hàng.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};
export default DetailWallet;
