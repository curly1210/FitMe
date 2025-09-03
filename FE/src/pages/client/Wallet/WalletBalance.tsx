/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";
import { formatCurrencyVND } from "../../../utils/currencyUtils";
import { useModal } from "../../../hooks/useModal";
import FormRequestWithDraw from "./FormRequestWithDraw";

const WalletBalance = ({ balance, walletResponse }: any) => {
  const { openModal } = useModal();

  return (
    <div className="bg-white p-6 sm:p-8 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 ">SỐ DƯ HIỆN TẠI</h2>
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            {formatCurrencyVND(balance)}
          </p>
        </div>
        <Button
          onClick={() =>
            openModal(<FormRequestWithDraw walletResponse={walletResponse} />)
          }
          disabled={
            walletResponse?.data?.balance == 0 ||
            !walletResponse?.data?.bank_account
          }
          className={`!bg-gray-900 !text-white font-semibold !py-5 !px-6  ${
            walletResponse?.data?.balance == 0 ||
            !walletResponse?.data?.bank_account
              ? "opacity-60"
              : ""
          }`}
        >
          Rút Tiền
        </Button>
      </div>
    </div>
  );
};
export default WalletBalance;
