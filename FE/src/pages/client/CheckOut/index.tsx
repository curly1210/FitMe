const CheckOut=()=>{
    return( 
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50">
      {/* Thông tin giao hàng */}
      <div className=" space-y-4">
        <div className="bg-white p-4 border border-gray-300  rounded shadow-sm">
          <div className="flex justify-between font-semibold">
            <span>Thông tin giao hàng</span>
            <button className="text-black underline text-sm">Thay đổi</button>
          </div>
          <div className="mt-2 text-sm bg-orange-100  text-gray-700 space-y-1">
            <div className="pl-2 pt-1">
            <p>
              <span className="font-bold">việt n</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded">Mặc định</span>
            </p>
            <p>8437488942</p>
            <p>raven18@fay.com</p>
            <p className="font-medium">addad | ádasd, Xã Cẩm Lĩnh, Huyện Ba Vì, Hà Nội</p>

            </div>
          </div>
        </div>
         </div>

         <div className="space-y-4 ">
        {/* Mua online */}
        <div className="bg-white p-4 border border-gray-300 rounded shadow-sm space-y-4">
          <p className="font-semibold">Mua online</p>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="radio" defaultChecked />
              <span>Giao hàng tiêu chuẩn (3 - 6 ngày) (Giao giờ hành chính)</span>
            </label>
            <span>0đ</span>
          </div>
        </div>

        {/* Phương thức thanh toán */}
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
            <button className="bg-black text-white px-4 py-2 rounded-r text-sm">Áp dụng</button>
          </div>
        </div>

        {/* Tùy chọn */}
        {["phiếu mua hàng", "thêm", "xuất hoá đơn"].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center text-sm"
          >
            <span>Bạn có {item === "phiếu mua hàng" ? "phiếu mua hàng?" : `yêu cầu ${item}`} </span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-checked:bg-black rounded-full"></div>
            </label>
          </div>
        ))}

      </div>


      {/* Đơn hàng */}
      <div className="bg-white p-4 border border-gray-300 rounded shadow-md space-y-4">
        <h2 className="font-semibold text-lg">Đơn hàng</h2>
        <div className="flex space-x-4 items-center">
          <img src="https://via.placeholder.com/60" alt="Áo khoác" className="w-16 h-16 object-cover" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Áo khoác xẻ tà cotton form fitted - 10F21JACW016_001</p>
            <p className="text-xs text-gray-500">BLACK BEAUTY, S</p>
            <div className="flex items-center mt-1">
              <button className="px-2">−</button>
              <span className="px-2">1</span>
              <button className="px-2">+</button>
            </div>
          </div>
          <div className="text-sm font-semibold">1.228.000đ</div>
        </div>
    

        {/* Quà tặng */}
        <div className="bg-green-100 text-green-800 p-3 rounded text-sm">
          <p className="flex items-start gap-2">
            <span>🎁</span>
            <span>Bạn có một phần quà cho đơn hàng này. Nhấn để chọn quà.</span>
          </p>
        </div>

        {/* Chi tiết giá */}
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

        {/* Tổng thanh toán */}
        <div className="border-t pt-2 text-sm text-gray-900 space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Thành tiền</span>
            <span>1.228.000đ</span>
          </div>
          <div className="flex justify-between">
            <span>ROUTINE Reward</span>
            <span>0 đ</span>
          </div>
          <div className="flex justify-between">
            <span>Số điểm tích lũy dự kiến</span>
            <span>122đ</span>
          </div>
        </div>

        <button className="w-full bg-black text-white py-2 rounded text-sm font-semibold">Đặt hàng</button>

        <p className="text-xs text-center text-gray-600 mt-2">
          Khi tiếp tục, bạn đồng ý với các <span className="underline">Điều khoản & Điều kiện</span> và{' '}
          <span className="underline">Chính sách</span> của chúng tôi.
        </p>
      </div>
    </div>
    )
}

export default CheckOut