/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrencyVND } from "../../../utils/currencyUtils";

const WalletBalance = ({ balance }: any) => {
  return (
    <div className="bg-white p-6 sm:p-8 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 ">SỐ DƯ HIỆN TẠI</h2>
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            {formatCurrencyVND(balance)}
          </p>
        </div>
        <button
          // onClick={onWithdraw}
          className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 w-full sm:w-auto"
        >
          Rút Tiền
        </button>
      </div>
    </div>
  );
};
export default WalletBalance;
