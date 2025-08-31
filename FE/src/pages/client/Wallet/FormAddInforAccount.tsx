/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useCreate } from "@refinedev/core";

const FormAddInforAccount = ({ refetchGetWallet }: any) => {
  const { closeModal } = useModal();

  const { mutate: mutateAddInforAccount, isPending: isloadingAddInforAccount } =
    useCreate({
      resource: "wallet/update",
    });

  const onHandleAddInforAccount = (values: any) => {
    mutateAddInforAccount(
      { values },
      {
        onSuccess: (_response) => {
          notification.success({ message: "Thêm thông tin thành công." });
          refetchGetWallet();
          closeModal();
        },
        onError: (_error) => {
          notification.error({
            message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
          });
        },
      }
    );
  };

  const onFinish = (values: any) => {
    onHandleAddInforAccount(values);
    // console.log(values);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl  w-[400px]  transform transition-all duration-300 scale-100 animate-fade-in-up">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Thêm thông tin tài khoản ngân hàng
        </h2>
        <button
          onClick={() => closeModal()}
          className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          aria-label="Đóng"
        >
          <CloseCircleOutlined className="" />
        </button>
      </div>
      <Form onFinish={onFinish} className="!p-6 !space-y-4">
        <Form.Item
          name="account_holder"
          rules={[
            { required: true, message: "Vui lòng nhập tên chủ tài khoản" },
          ]}
        >
          <div>
            <label
              htmlFor="account_holder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên chủ tài khoản
            </label>
            <Input
              type="text"
              className="w-full !p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              placeholder="NGUYEN VAN A"
            />
          </div>
        </Form.Item>

        <Form.Item
          name="bank_name"
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
        >
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên ngân hàng
            </label>
            <Input
              type="text"
              // value={formData.bankName}
              // onChange={handleChange}
              className="w-full !p-2 bg-white border  border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              placeholder="VD: Vietcombank"
            />
          </div>
        </Form.Item>

        <Form.Item
          name="account_number"
          rules={[
            { required: true, message: "Vui lòng nhập số tài khoản" },
            { max: 20, message: "Tối đa 20 số" },
          ]}
        >
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số tài khoản ngân hàng
            </label>
            <Input
              className="w-full !p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </Form.Item>

        <div className="pt-4">
          <Button
            loading={isloadingAddInforAccount}
            htmlType="submit"
            className="w-full !bg-gray-900 !text-white font-semibold !py-6 px-6 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
          >
            Lưu Thông tin
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default FormAddInforAccount;
