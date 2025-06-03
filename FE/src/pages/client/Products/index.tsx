import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { HiBars3 } from 'react-icons/hi2';
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from 'react-icons/fa';

const ListProduct: React.FC = () => {
  const colorOptions = [
    { name: 'RED', hex: '#81142b' },
    { name: 'BROWN', hex: '#9b6e43' },
    { name: 'WHITE', hex: '#e8e4db' },
    { name: 'YELLOW', hex: '#ebb650' },
    { name: 'ORANGE', hex: '#f3c1a0' },
    { name: 'GREEN', hex: '#226e57' },
    { name: 'BLUE', hex: '#acc4dd' },
    { name: 'PINK', hex: '#f4d2dc' },
    { name: 'PURPLE', hex: '#c8b7d0' },
    { name: 'BEIGE', hex: '#cab99f' },
    { name: 'GREY', hex: '#dad9d6' },
    { name: 'NAVY', hex: '#1a1d2b' },
  ];

  const products = [
    {
      id: 1,
      name: 'Áo Phông Nam',
      product_items: [
        {
          sale_price: '123232',
          image: [
            { id: 1, url: 'https://via.placeholder.com/300x400/000000/ffffff?text=Ao+1' },
            { id: 2, url: 'https://via.placeholder.com/300x400/111111/ffffff?text=Ao+1b' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Áo Sơ Mi Trắng',
      product_items: [
        {
          sale_price: '99000',
          image: [
            { id: 1, url: 'https://via.placeholder.com/300x400/f5f5f5/000000?text=Ao+So+Mi' },
          ],
        },
      ],
    },
  ];

  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterTab, setFilterTab] = useState<'color' | 'size' | 'price'>('color');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => setSelectedColors([]);

  return (
    <div className="font-sans bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb + Filter + Sort */}
        <div className="border border-gray-200 rounded-sm mb-4">
          <div className="flex justify-between items-center px-6 py-4 relative">
            <div className="text-sm text-gray-500 space-x-2">
              <span className="hover:underline cursor-pointer">Trang chủ</span> /
              <span className="hover:underline cursor-pointer"> Thời trang</span> /
              <span className="font-semibold text-black"> Áo thun</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <div className="relative">
                <button
                  className="flex items-center text-sm text-gray-600 border px-3 py-1.5 rounded hover:bg-gray-100"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <FiFilter className="mr-2" /> Lọc
                </button>

                {showFilter && (
                  <div className="absolute right-0 z-20 mt-2 w-[700px] bg-white border border-gray-200 rounded-md shadow-xl">
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold mb-3">Bộ lọc</h4>

                      <div className="flex gap-2 mb-4">
                        {['color', 'size', 'price'].map((tab) => (
                          <button
                            key={tab}
                            className={`px-3 py-1.5 border rounded text-sm ${
                              filterTab === tab ? 'border-black' : 'border-gray-200'
                            }`}
                            onClick={() => setFilterTab(tab as any)}
                          >
                            {tab === 'color' ? 'Màu' : tab === 'size' ? 'Kích Cỡ' : 'Giá'}
                          </button>
                        ))}
                      </div>

                      {filterTab === 'color' && (
                        <div className="grid grid-cols-6 gap-3 mb-4">
                          {colorOptions.map((color) => (
                            <div
                              key={color.name}
                              className={`text-center border p-2 rounded cursor-pointer ${
                                selectedColors.includes(color.name)
                                  ? 'ring-2 ring-gray-300 border-transparent'
                                  : 'border-gray-200'
                              }`}
                              onClick={() => toggleColor(color.name)}
                            >
                              <div
                                className="w-6 h-6 mx-auto mb-1 rounded"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="text-xs font-medium">{color.name}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between gap-2">
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 text-sm border rounded hover:bg-gray-100 w-[140px]"
                        >
                          Xoá hết
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-black rounded hover:opacity-90 w-[160px]">
                          Xem kết quả ({selectedColors.length})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <button
                  className="flex items-center text-sm text-gray-600 border px-2 py-1.5 rounded hover:bg-gray-100"
                  onClick={() => setShowSort(!showSort)}
                >
                  <HiBars3 size={20} />
                </button>
                {showSort && (
                  <div className="absolute right-0 z-10 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-3 border-b font-semibold">Sắp xếp theo</div>
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                      <FaSortAmountDownAlt className="mr-2" /> Giá giảm dần
                    </div>
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                      <FaSortAmountUpAlt className="mr-2" /> Giá tăng dần
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const item = product.product_items?.[0];
            const imgUrl = item?.image?.[0]?.url || '';

            return (
              <div key={product.id} className="group border border-gray-100 relative">
                <div className="relative">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-[400px] object-contain object-center bg-white"
                  />
                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition bg-white">
                    <div className="flex border-t border-gray-200 divide-x divide-gray-200">
                      <button className="flex-1 text-xs py-2 bg-black text-white hover:opacity-90">Mua nhanh</button>
                      <button className="flex-1 text-xs py-2 hover:bg-gray-100">Xem chi tiết</button>
                    </div>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <p className="text-sm font-semibold text-black">{product.name}</p>
                  <p className="text-sm font-semibold text-gray-700">{item?.sale_price}₫</p>

                  {/* Ảnh nhỏ của biến thể */}
                  <div className="flex gap-1 mt-2">
                    {item?.image?.slice(0, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`variant-${idx}`}
                        className="w-6 h-6 object-cover border rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 mt-6">
          <button className="w-8 h-8 text-sm bg-black text-white rounded border">1</button>
          <button className="w-8 h-8 text-sm border rounded hover:bg-gray-100">2</button>
          <button className="w-8 h-8 text-sm border rounded hover:bg-gray-100">3</button>
          <span className="text-sm text-gray-500">...</span>
          <button className="w-8 h-8 text-sm border rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
