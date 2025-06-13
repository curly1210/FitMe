import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router";

const Order = () => {
  return (
    <>
      <div className="flex gap-3 border border-gray-400 items-center py-5 px-4 mb-5">
        <Link to={"/"}>Trang chủ</Link>
        <RightOutlined />
        <p className="font-bold">Đơn hàng</p>
      </div>

      <div className="grid grid-cols-12 gap-x-[10px] pt-5">
        <div className="col-span-4 flex flex-col gap-7">
          <Link to={""}>Tài khoản</Link>
          <p className="cursor-pointer font-bold">Đơn hàng</p>
          <Link to={"/address"}>Địa chỉ</Link>
          <Link to={""}>Đổi mật khẩu</Link>
        </div>
        <div className="col-span-8">
          <h1 className="font-semibold mb-8 text-2xl">Đơn hàng</h1>
          <div className="flex items-center gap-3 mb-5">
            <p className="pr-3 py-1 border-b-2 font-semibold border-black">
              Đơn hàng
            </p>
            <p className="pr-3 py-1   border-black">Thành công</p>
            <p className="pr-3 py-1   border-black">Đã hủy</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="py-3 px-4 text-sm border border-gray-300 flex flex-col gap-4">
              <div className="flex items-center gap-20">
                <p className="font-semibold">
                  Mã đơn hàng: <span className="font-normal">#ADASDAS</span>
                </p>
                <p>Ngày đặt: 12/10/2000</p>
                <p>2 sản phẩm (1.244.000đ)</p>
              </div>
              <div>
                Giao đến: 234 Phạm Văn Đồng, Phường 3, Quận Gò Vấp, TP.HCM
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Đã xác nhận</p>
                <div className="flex gap-3">
                  <button className="border-2 py-2 px-3 font-semibold cursor-pointer">
                    XEM CHI TIẾT
                  </button>
                  <button className="text-white bg-black py-2 px-3 cursor-pointer">
                    HỦY ĐƠN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Order;
