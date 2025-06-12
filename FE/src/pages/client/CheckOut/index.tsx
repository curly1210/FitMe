import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import AddressList from "./AddressList";
import { useList } from "@refinedev/core";

const CheckOut = () => {
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [addressListDefaultMode, setAddressListDefaultMode] = useState<"create" | "list">("list");

  // ✅ Gọi danh sách địa chỉ để tìm địa chỉ mặc định
  const { data: addressData, isLoading } = useList({
    resource: "addresses",
  });

  useEffect(() => {
    if (addressData?.data && !selectedAddress) {
      const defaultAddr = addressData.data.find((a: any) => a.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    }
  }, [addressData, selectedAddress]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50">
        {/* Cột 1: Thông tin giao hàng */}
        <div className="space-y-4">
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <div className="flex justify-between font-semibold">
              <span>Thông tin giao hàng</span>
              {selectedAddress && (
                <button
                  className="text-black underline text-sm"
                  onClick={() => {
                    setAddressListDefaultMode("list");
                    setIsSelectingAddress(true);
                  }}
                >
                  Thay đổi
                </button>
              )}
            </div>

            <div className="mt-2 text-sm bg-orange-100 text-gray-700 space-y-1 p-2">
              {!selectedAddress ? (
                <div>
                  <p>Bạn chưa có địa chỉ giao hàng nào.</p>
                  <Button
                    onClick={() => {
                      setAddressListDefaultMode("create");
                      setIsSelectingAddress(true);
                    }}
                    className="text-blue-600 underline text-sm"
                  >
                    Thêm địa chỉ
                  </Button>
                </div>
              ) : (
                <>
                  <p>
                    <span className="font-bold">{selectedAddress.name_receive}</span>
                    {selectedAddress.is_default && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded">
                        Mặc định
                      </span>
                    )}
                  </p>
                  <p>{selectedAddress.phone}</p>
                  <p>{selectedAddress.email}</p>
                  <p className="font-medium">{selectedAddress.full_address}</p>
                </>
              )}
            </div>
          </div>
        </div>

          {/* Cột 2: Giao hàng + Thanh toán */}
        <div className="space-y-4">
          {/* Giao hàng */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm space-y-4">
            <p className="font-semibold">Phương thức vận chuyển</p>
            
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="radio"  />
                <span>Giao Hàng tiết kiệm</span>
              </label>
              <span>40.000VNĐ</span>
            </div>

              <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="radio" checked />
                <span>ViettelPort</span>
              </label>
              <span>20.000VNĐ</span>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex justify-between items-start">
            <div>
              <p className="font-semibold">Phương thức thanh toán</p>
              <p className="text-sm mt-2">Trả tiền mặt khi nhận hàng (COD)</p>
            </div>
            <button className="text-gray-500 text-sm">Thay đổi</button>
          </div>

          {/* Mã giảm giá */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <div className="flex justify-between">
              <p className="font-semibold">Voucher và Coupon</p>
              <button className="text-sm text-gray-500">Xem tất cả</button>
            </div>
            <div className="mt-2 flex">
              <input
                className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded-l"
                placeholder="Nhập mã giảm giá (nếu có)"
              />
              <button className="bg-black text-white px-4 py-2 rounded-r text-sm">
                Áp dụng
              </button>
            </div>
          </div>
      
        </div>

        {/* Cột 3: Đơn hàng */}
        <div className="bg-white p-4 border border-gray-300 rounded shadow-md space-y-4">
          <h2 className="font-semibold text-lg">Đơn hàng</h2>

          {/* Ví dụ sản phẩm */}
          <div className="flex space-x-4 items-center">
            <img
              src="https://via.placeholder.com/60"
              alt="Áo khoác"
              className="w-16 h-16 object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                Áo khoác xẻ tà cotton form fitted - 10F21JACW016_001
              </p>
              <p className="text-xs text-gray-500">BLACK BEAUTY, S</p>
         
            </div>
            <div className="text-sm font-semibold">1.228.000đ</div>
          </div>

          <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
            <p className="flex items-start gap-2">
              <span>🎁</span>
              <span>Bạn có một phần quà cho đơn hàng này. Nhấn để chọn quà.</span>
            </p>
          </div>

          <div className="text-sm text-gray-800 space-y-1">
            <div className="flex justify-between">
              <span>Tổng giá trị đơn hàng</span>
              <span className="font-semibold">1.228.000đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>0 đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>0 đ</span>
            </div>
          </div>

          <div className="border-t pt-2 text-sm text-gray-900 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Thành tiền</span>
              <span>1.228.000đ</span>
            </div>
     
          </div>

          <button
            disabled={!selectedAddress}
            className={`w-full py-2 rounded text-sm font-semibold ${
              selectedAddress
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Thanh toán
          </button>

          <p className="text-xs text-center text-gray-600 mt-2">
            Khi tiếp tục, bạn đồng ý với các{" "}
            <span className="underline">Điều khoản & Điều kiện</span> và{" "}
            <span className="underline">Chính sách</span> của chúng tôi.
          </p>
        </div>

      </div>

      {/* Modal chọn địa chỉ */}
      <Modal
        open={isSelectingAddress}
        onCancel={() => setIsSelectingAddress(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <AddressList
          defaultMode={addressListDefaultMode}
          selectedAddressId={selectedAddress?.id || null}
          onSelect={(address) => {
            setSelectedAddress(address);
            setIsSelectingAddress(false);
          }}
        />
      </Modal>
    </>
  );
};

export default CheckOut;
