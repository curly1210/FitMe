import { useOne } from "@refinedev/core";
import { useAuthen } from "../../../hooks/useAuthen";
import WalletBalance from "./WalletBalance";
import BankAccountInfor from "./BankAccountInfor";
import { Skeleton } from "antd";
import WithDrawHistory from "./WithDrawHistory";

const Wallet = () => {
  const { user } = useAuthen();

  const {
    data: walletResponse,
    isFetching,
    refetch: refetchGetWallet,
  } = useOne({
    resource: "wallet",
    id: "",
  });

  // console.log(walletResponse?.data);

  // const handleOpenWithdrawalModal = () => {
  //   if (bankAccount) {
  //     setIsWithdrawalModalOpen(true);
  //   } else {
  //     // Prompt to add bank account first
  //     setIsBankAccountModalOpen(true);
  //   }
  // };
  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
        {isFetching ? (
          <Skeleton active />
        ) : (
          <div>
            <header className="flex justify-between items-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Lịch sử ví
              </h1>
              <div className="flex items-center">
                <span className="text-right text-sm font-medium text-gray-700 hidden sm:block mr-3">
                  {user?.name}
                </span>
                <img
                  src={user?.avatar}
                  alt={`Ảnh đại diện của ${user?.name}`}
                  className="w-10 h-10  rounded-full object-cover object-center border-2 border-white shadow-sm"
                />
              </div>
            </header>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <WalletBalance
                balance={walletResponse?.data.balance}
                // onWithdraw={handleOpenWithdrawalModal}
              />
              <BankAccountInfor
                refetchGetWallet={refetchGetWallet}
                bankAccount={walletResponse?.data?.bank_account}
                // onManageAccount={handleOpenBankAccountModal}
              />

              <WithDrawHistory />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Wallet;
