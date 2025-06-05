import { Tabs, Radio, Button } from "antd";
import { useOne } from "@refinedev/core";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

const { TabPane } = Tabs;

interface ProductItem {
  id: number;
  price: number;
  sale_price: number;
  stock: number;
  sku: string;
  color: Color;
  size: Size;
}
interface Color {
  id: number;
  name: string;
  code: string;
  images: Image[];
}
interface Size {
  id: number;
  name: string;
}
interface Image {
  id: number;
  url: string;
}
interface IComment {
  id: number;
  content: string;
  user: User;
  created_at: string;
  is_active: number;
}
interface User {
  id: number;
  name: string;
}
interface IProduct {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  product_items: ProductItem[];
  comments: IComment[];
  related_products: RelatedProduct[];
}
interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useOne<IProduct>({
    resource: "products",
    id: slug,
    queryOptions: {
      enabled: !!slug,
    },
  });

  const product = data?.data;
  const productItems = product?.product_items || [];

  
// hàm lấy danh sách màu,size không trùng lặp
  const colors = Array.from(
    new Map(productItems.map((item) => [item.color.id, item.color])).values()
  );
//
  const [selectedColorId, setSelectedColorId] = useState<number>(
    productItems[0]?.color?.id || 0
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
    productItems[0]?.size?.id || null
  );
  const [selectedItem, setSelectedItem] = useState<ProductItem >(
    productItems[0] || null
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // hàm sử lý khi người dùng click vào màu và size  sẽ cập nhật biến thể tương ứng

  const handleColorChange = (colorId: number) => {
    setSelectedColorId(colorId);
    const item = productItems.find((p) => p.color.id === colorId);
    if (item) {
      setSelectedSizeId(item.size.id);
      setSelectedItem(item);
    }
  };

  const handleSizeChange = (sizeId: number) => {
    setSelectedSizeId(sizeId);
    const item = productItems.find(
      (p) => p.color.id === selectedColorId && p.size.id === sizeId
    );
    if (item) setSelectedItem(item);
  };
// hàm sử lý khi trang chi tiết vào sẽ lấy thông tin  biến thể đầu tiên để hiển thị khi ấn reload
  useEffect(() => {
    if (productItems.length > 0 && !selectedItem) {
      const first = productItems[0];
      setSelectedColorId(first.color.id);
      setSelectedSizeId(first.size.id);
      setSelectedItem(first);// cái này là lấy biển thể đầu tiên để hiển thị
    }
  }, [productItems]);

  // hàm cập nhật khi click ảnh nhỏ hiện ra ảnh to
  useEffect(() => {
  if (selectedItem?.color?.images?.length) {
    setSelectedImage(selectedItem.color.images[0].url);
  }
}, [selectedItem]);
  
  // cái này là lấy ảnh trong mảng theo màu khi click
  const images = selectedItem?.color?.images || [];
  // lấy danh sách size
  const sizes = Array.from(
    new Map(
      productItems
        .filter((item) => item.color.id === selectedColorId)
        .map((item) => [item.size.id, item.size])
    ).values()
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div >
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Sản phẩm */}
        <div className="grid  md:grid-cols-2 gap-6">
          {/* Ảnh sản phẩm */}
          <div className="flex gap-4">
            {/* Ảnh nhỏ hiển thị dọc */}
            <div className="flex flex-col gap-2 w-20 ">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="thumb"
                  onClick={()=>setSelectedImage(img.url)}
                  className={`w-full object-cover rounded-md border max-h-[500px] self-start cursor-pointer ${
                        selectedImage === img.url ? "ring-2 ring-black" : ""
                   }`}
                />
              ))}
            </div>

            {/* Ảnh lớn */}
            <div className="flex-1">
              <img
                 src={selectedImage || images[0]?.url}
                alt="main"
                className="w-full object-cover rounded-md border max-h-[500px]"
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
         <div className="border border-gray-200 rounded-md p-4 space-y-4 self-start">
          {/* Content block */}
      <div className="space-y-2">
    <h1 className="text-2xl font-bold">{product.name}</h1>
    <p className="text-sm text-gray-500">
      SKU: {selectedItem?.sku || "---"}
    </p>
    <p className="text-xl text-red-600 font-semibold">
      {selectedItem?.sale_price?.toLocaleString() || "0"} ₫
    </p>

    {/* Màu sắc */}
    <div className="flex items-center gap-2">
      <span className="text-sm">Màu:</span>
      {colors.map((color) => (
        <div
          key={color.id}
          onClick={() => handleColorChange(color.id)}
          className={`w-6 h-6 rounded-full border cursor-pointer`}
          style={{
            backgroundColor: color.code,
            outline:
              color.id === selectedColorId ? "2px solid black" : "",
          }}
        />
      ))}
    </div>

    {/* Size */}
    <div className="relative z-0">
      <p className="text-sm mb-1">Chọn size:</p>
      <Radio.Group
        value={selectedSizeId}
        onChange={(e) => handleSizeChange(e.target.value)}
      >
        {sizes.map((size) => {
          const matchedItem = productItems.find(
            (item) =>
              item.color.id === selectedColorId &&
              item.size.id === size.id
          );
          return (
            <Radio.Button
              key={size.id}
              value={size.id}
              disabled={!matchedItem || matchedItem.stock === 0}
            >
              {size.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>

    {/* Số lượng */}
    <div className="text-sm">
     <p> Số lượng còn:{" "}</p>
      <span className="font-medium">
        {selectedItem?.stock > 0 ? selectedItem.stock : "Hết hàng"}
      </span>
    </div>
  </div>

  {/* Button block */}
  <Button
    size="large"
    className="bg-black text-white border-none hover:!bg-black hover:!opacity-90 hover:!text-white w-full"
  >
    Thêm vào giỏ hàng
  </Button>
        </div>

        </div>

        {/* Tabs */}
        <div>
          <Tabs defaultActiveKey="1" centered >
            <TabPane tab="Mô tả" key="1" className="border border-gray-200">
              <p className="text-sm leading-relaxed text-gray-700">
               <p>Thông tin chi tiêt:</p>
              <div className="text-sm">
                Mô tả ngắn:{" "}
                <span className="font-medium">
                  {product.short_description}
                </span>
              </div>

              <div className="text-sm">
               <p> Mô tả:{" "}</p>
                <span className="font-medium">{product.description}</span>
              </div>
              </p>
            </TabPane>
            <TabPane tab="Bình luận" key="2" className="border border-gray-200">
              {product.comments?.filter((c) => c.is_active === 1).length >
              0 ? (
                product.comments
                  .filter((c) => c.is_active === 1)
                  .map((c) => (
                    <div key={c.id} className="mb-2">
                      <p className="font-semibold">
                        {c.user.name}: {c.created_at}
                      </p>
                      <p className="text-gray-700 text-sm">{c.content}</p>
                    </div>
                  ))
              ) : (
                <p>Chưa có bình luận nào.</p>
              )}
            </TabPane>
            <TabPane tab="Đánh giá" key="3"className="border border-gray-200">
              <p>Chưa có đánh giá nào.</p>
            </TabPane>
          </Tabs>
        </div>

        {/* Sản phẩm liên quan */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.related_products.map((rp) => (
              <div
                key={rp.id}
                className="border rounded-md p-3 text-center"
              >
                <img
                  src={rp.images?.[0]?.url}
                  alt={rp.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <p className="text-sm">{rp.name}</p>
                <p className="text-red-500 font-bold">
                  {rp.price.toLocaleString()} ₫
                </p>
                <div className="flex justify-center mt-2 space-x-2">
                  <Button size="small">Mua nhanh</Button>
                  <Button  size="small" type="default">
                   
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
