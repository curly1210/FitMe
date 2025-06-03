import React from 'react';
import { Tabs, Radio, Button } from 'antd';

const { TabPane } = Tabs;

const ProductDetail = () => {
  return (
    <div>
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ảnh sản phẩm */}
        <div className="space-y-4">
          <img
            src="https://example.com/product-main.jpg"
            alt="Áo thun đỏ"
            className="w-full object-cover rounded-md border"
          />
          {/* Ảnh nhỏ */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((_, i) => (
              <img
                key={i}
                src="https://example.com/product-thumb.jpg"
                alt="thumb"
                className="w-16 h-16 object-cover border rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Áo thun tay ngắn nữ thêu</h1>
          <p className="text-sm text-gray-500">SKU: 102557SWKS2R1.003</p>
          <p className="text-xl text-red-600 font-semibold">245.000 ₫</p>

          {/* Màu sắc */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">Màu:</span>
            <div className="w-6 h-6 rounded-full border bg-red-600" />
            <div className="w-6 h-6 rounded-full border bg-gray-800" />
          </div>

          {/* Size */}
          <div>
            <p className="text-sm mb-1">Chọn size:</p>
            <Radio.Group defaultValue="M">
              <Radio.Button value="S">S</Radio.Button>
              <Radio.Button value="M">M</Radio.Button>
              <Radio.Button value="L">L</Radio.Button>
            </Radio.Group>
          </div>

          {/* Nút */}
          <Button type="primary" className="mt-4" size="large">
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      {/* Tabs: mô tả - bình luận - đánh giá */}
      <div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Mô tả" key="1">
            <p className="text-sm leading-relaxed text-gray-700">
              Mẫu áo sơ mi ngắn nữ thêu sắc đỏ được đội ngũ thiết kế Routine chú trọng đến sự tối giản và thoải mái sfsdfafafaasdawdfefqefwqfqwfqe...
            </p>
          </TabPane>
          <TabPane tab="Bình luận" key="2">
            <p>Chưa có bình luận nào.</p>
          </TabPane>
          <TabPane tab="Đánh giá" key="3">
            <p>Chưa có đánh giá nào.</p>
          </TabPane>
        </Tabs>
      </div>

      {/* Sản phẩm liên quan */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border rounded-md p-3 text-center">
              <img
                src="https://example.com/related-product.jpg"
                alt="sp"
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="text-sm">Áo phông nam ngắn tay</p>
              <p className="text-red-500 font-bold">471.000 ₫</p>
              <div className="flex justify-center mt-2 space-x-2">
                <Button size="small">Mua nhanh</Button>
                <Button size="small" type="default">
                  Xem chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;
