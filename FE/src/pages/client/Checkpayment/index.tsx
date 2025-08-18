/* eslint-disable react-hooks/exhaustive-deps */
import { useCreate } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useCart } from "../../../hooks/useCart";
import { Spin } from "antd";

import Fail from "../../../assets/images/fail.png";
import Success from "../../../assets/images/success.png";

const CheckPayment = () => {
  const [searchParams] = useSearchParams();
  const [statuspayment, setStatusPayment] = useState(false);
  const { mutate, isLoading } = useCreate();

  const { refetch } = useCart();

  useEffect(() => {
    if (searchParams) {
      mutate(
        {
          resource: `vnpay/return?${searchParams}`,
          values: {},
          // values: localStorage.getItem("order") || "",
        },
        {
          onSuccess: (response) => {
            if (response.data?.vnp_ResponseCode === "00") {
              setStatusPayment(true);
              refetch();
              console.log("Payment successful:", response.data);
            } else {
              setStatusPayment(false);
            }
          },
          onError: (error) => {
            console.error("Error processing payment:", error);
            setStatusPayment(false);
          },
          // onSettled: () => {
          //   localStorage.removeItem("order");
          // },
        }
      );
    }
  }, [searchParams]);

  return (
    <div>
      {isLoading ? (
        <Spin
          className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        <div>
          <div className="flex items-center justify-center ">
            <img
              src={statuspayment ? Success : Fail}
              width={200}
              className="block"
              alt=""
            />
          </div>
          <h1 className="text-2xl font-bold text-center mt-10">
            {statuspayment ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </h1>
          <p className="text-center mt-4">
            {statuspayment
              ? "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn sẽ được xử lý sớm nhất."
              : "Xin lỗi, có vẻ như đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
          </p>
        </div>
      )}
    </div>
  );
  // <div>
  //   <h1 className="text-2xl font-bold text-center mt-10">
  //     {statuspayment ? "Thanh toán thành công" : "Thanh toán thất bại"}
  //   </h1>
  //   <p className="text-center mt-4">
  //     {statuspayment
  //       ? "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn sẽ được xử lý sớm nhất."
  //       : "Xin lỗi, có vẻ như đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
  //   </p>
  // </div>;
};
export default CheckPayment;
