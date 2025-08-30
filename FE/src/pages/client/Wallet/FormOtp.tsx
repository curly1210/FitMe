/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined, SafetyOutlined } from "@ant-design/icons";
import { useCreate } from "@refinedev/core";
import { Button, Form, Input, notification } from "antd";
import { useAuthen } from "../../../hooks/useAuthen";
// import FormAddInforAccount from "./FormAddInforAccount";
import { useModal } from "../../../hooks/useModal";
import FormAddInforAccount from "./FormAddInforAccount";

const FormOtp = ({ refetchGetWallet }: any) => {
  // const [error, setError] = useState("");
  const { user } = useAuthen();
  const { openModal, closeModal } = useModal();

  const { mutate: mutateCheckcode, isPending: isloadingCheckcode } = useCreate({
    resource: "wallet/checkCode",
  });

  const onHandleCheckcode = (otp: any) => {
    mutateCheckcode(
      { values: { code: otp } },
      {
        onSuccess: (_response) => {
          notification.success({ message: "Xác thực thành công." });
          openModal(
            <FormAddInforAccount refetchGetWallet={refetchGetWallet} />
          );
        },
        onError: (_error) => {
          notification.error({
            message: "Mã không đúng hoặc đã hết hạn",
          });
        },
      }
    );
  };

  const onFinish = (values: any) => {
    onHandleCheckcode(values?.otp);
    // console.log(values);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 animate-fade-in-up">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Xác thực Giao dịch</h2>
        <button
          onClick={() => closeModal()}
          className="text-gray-400 hover:text-gray-600 focus:outline-none "
          aria-label="Đóng"
        >
          <CloseCircleOutlined className="" />
        </button>
      </div>
      <Form onFinish={onFinish} className="!p-6 !text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <SafetyOutlined className=" !text-blue-600 text-xl" />
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Để bảo mật, vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email{" "}
          {user?.email}
        </p>

        {/* {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm"
            role="alert"
          >
            {error}
          </div>
        )} */}

        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP" },
            { len: 6, message: "Mã OTP phải gồm 6 chữ số" },
          ]}
        >
          <Input
            maxLength={6}
            // inputMode="numeric"
            // autoComplete="one-time-code"
            className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
            placeholder="------"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        {/* <div>
          <label htmlFor="otp" className="sr-only">
            Mã OTP
          </label>
          <input
            type="text"
            name="otp"
            id="otp"
            // value={otp}
            // onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
            maxLength={6}
            placeholder="------"
            // required
            autoComplete="one-time-code"
            inputMode="numeric"
          />
        </div> */}

        {/* <div className="mt-4 text-sm">
          {countdown > 0 ? (
            <p className="text-gray-500">
              Bạn có thể yêu cầu gửi lại mã sau {countdown} giây.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              Gửi lại mã
            </button>
          )}
        </div> */}

        <div className="pt-3">
          <Button
            loading={isloadingCheckcode}
            htmlType="submit"
            className="!w-full !bg-gray-900 !text-white font-semibold !py-6 !rounded-lg !shadow-md !hover:bg-gray-800 !focus:outline-none !focus:ring-2 !focus:ring-offset-2 !focus:ring-gray-900 !transition-all !duration-200"
          >
            Xác nhận
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default FormOtp;
