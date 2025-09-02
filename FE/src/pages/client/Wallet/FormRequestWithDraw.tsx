/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, notification } from "antd";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useCreate } from "@refinedev/core";

const FormRequestWithDraw = () => {
  const { closeModal } = useModal();
  const [amount, setAmount] = useState<any>(undefined);

  const { mutate: mutateRequestWithDraw, isPending: isPendingRequestWithDraw } =
    useCreate({
      resource: "wallet/widraw-request/create",
    });

  const onFinish = (values: any) => {
    // console.log(Number(values?.amount));
    // console.log(amount);
    // console.log(values);

    mutateRequestWithDraw(
      {
        values: { amount },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Gửi yêu cầu thành công" });
          closeModal();
        },
        onError: (err) => {
          const errors = err.response?.data?.errors;
          if (err?.status !== 422) {
            notification.error({ message: "Lỗi khi thêm sản phẩm" });
          } else {
            const firstKey = Object.keys(errors)[0];
            notification.error({ message: errors[firstKey] });
            // console.log(errors[firstKey][0]);
          }
        },
        // onSettled: () => reFetchTransaction(),
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl  w-[400px]  transform transition-all duration-300 scale-100 animate-fade-in-up">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Yêu cầu rút tiền</h2>
        <button
          onClick={() => closeModal()}
          className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          aria-label="Đóng"
        >
          <CloseCircleOutlined className="" />
        </button>
      </div>
      <Form onFinish={onFinish} className="!p-6 !space-y-4">
        {/* <Form className="!p-6 !space-y-4"> */}
        <Form.Item
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <div>
            <label
              htmlFor="account_holder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số tiền muốn rút:
            </label>
            <InputNumber
              controls={false}
              // type="text"
              className="w-full !py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") || ""}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              onChange={(value) => setAmount(value)}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <div>
            <label
              htmlFor="account_holder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên chủ tài khoản:
            </label>
            <Input
              disabled
              type="text"
              className="w-full !p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              placeholder="NGUYEN VAN A"
            />
          </div>
        </Form.Item>

        <Form.Item>
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên ngân hàng:
            </label>
            <Input
              disabled
              type="text"
              className="w-full !p-2 bg-white border  border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              placeholder="Vietcombank"
            />
          </div>
        </Form.Item>

        <Form.Item>
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số tài khoản ngân hàng:
            </label>
            <Input
              disabled
              className="w-full !p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
              placeholder="23123"
            />
          </div>
        </Form.Item>

        <div className="pt-4">
          <Button
            loading={isPendingRequestWithDraw}
            htmlType="submit"
            className="w-full !bg-gray-900 !text-white font-semibold !py-6 px-6 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default FormRequestWithDraw;
