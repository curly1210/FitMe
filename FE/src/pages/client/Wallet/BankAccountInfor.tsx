/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, notification } from "antd";
import { useModal } from "../../../hooks/useModal";
import FormOtp from "./FormOtp";
import { useCreate } from "@refinedev/core";
import { useAuthen } from "../../../hooks/useAuthen";

/* eslint-disable @typescript-eslint/no-explicit-any */
const BankAccountInfor = ({ bankAccount, refetchGetWallet }: any) => {
  const { openModal } = useModal();
  const { user } = useAuthen();

  const { mutate: mutateSendCode, isPending: isLoadingSendcode } = useCreate({
    resource: "wallet/sendCode",
  });

  const onHandleSendcode = () => {
    mutateSendCode(
      { values: { email: user?.email } },
      {
        onSuccess: (_response) => {
          notification.success({ message: "Đã gửi mã OTP đến email." });
          openModal(<FormOtp refetchGetWallet={refetchGetWallet} />);
        },
        onError: (_error) => {
          notification.error({
            message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
          });
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 sm:p-8 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Thông tin thanh toán
        </h3>
        {bankAccount && (
          <button
            // onClick={onManageAccount}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            aria-label="Chỉnh sửa thông tin ngân hàng"
          >
            {/* <PencilIcon className="w-4 h-4" /> */}
            Sửa
          </button>
        )}
      </div>

      {bankAccount ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tên chủ tài khoản:</span>
            <span className="text-gray-900 text-right">
              {bankAccount.account_holder}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tên ngân hàng:</span>
            <span className="text-gray-900 text-right">
              {bankAccount.bank_name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Số tài khoản:</span>
            <span className="text-gray-900 text-right">
              {bankAccount.account_number}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 px-4 border border-gray-300  rounded-lg flex flex-col  items-center justify-center gap-4">
          {/* <BanknotesIcon className="w-12 h-12 text-gray-400" /> */}
          <div>
            <p className="text-gray-500 mb-2">
              Chưa có thông tin tài khoản ngân hàng.
            </p>
            <Button
              loading={isLoadingSendcode}
              onClick={() => onHandleSendcode()}
              // onClick={() => openModal(<FormAddInforAccount />)}
              className="!bg-gray-200 !text-gray-800 !font-semibold !py-2 !px-4 !rounded-lg !hover:bg-gray-300 !focus:outline-none !focus:ring-2 !focus:ring-offset-2 !focus:ring-gray-400 !transition-all !duration-200"
            >
              + Thêm Tài Khoản
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default BankAccountInfor;
