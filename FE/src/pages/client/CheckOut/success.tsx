import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";


const CheckoutSuccess = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-white px-4 py-10 text-center">
      <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        Thanh toán thành công!
      </h1>

      <p className="text-gray-600 mt-2 text-sm md:text-base">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm xác nhận và giao hàng cho bạn.
      </p>

      <div className="mt-6 space-x-3">
   
          <Button className="bg-black text-white hover:opacity-90 px-6 py-2 text-sm font-medium rounded">
            Tiếp tục mua sắm
          </Button>
       
        
          <Button className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium rounded">
            Xem đơn hàng
          </Button>
     
      </div>
    </div>
  );
};

export default CheckoutSuccess;
