import { Tabs, Radio, Button } from "antd";
import { useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

const { TabPane } = Tabs;

interface Image {
  id: number;
  url: string;
}

interface ColorImage {
  id: number;
  name: string;
  code: string;
  images: Image[];
}

interface Size {
  id: number;
  name: string;
}

interface ProductItem {
  id: number;
  import_price: number;
  price: number;
  sale_price: number;
  stock: number;
  sku: string;
  color_id: number;
  size: Size;
  color?: ColorImage;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
  };
  content: string;
  is_active: number;
  created_at: string;
}

interface RelatedProductImage {
  url: string;
}
interface RelatedProductColor{
  id:string;
  code:
}

interface RelatedProduct {
  id?: number;
  name: string;
  slug: string;
  price: number;
  images: RelatedProductImage[];
}

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: Category;
  product_items: ProductItem[];
  sizes: Size[];
  color_images: ColorImage[];
  comments: Comment[];
  related_products: RelatedProduct[];
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useOne<Product>({
    resource: "products",
    id: slug,
    queryOptions: { enabled: !!slug },
  });

  const nav= useNavigate()

  const product = data?.data;
  const productItems: ProductItem[] = product?.product_items || [];
  const allSizes: Size[] = product?.sizes || [];
  const colors: ColorImage[] = product?.color_images || [];

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Khởi tạo chọn mặc định khi có data
  useEffect(() => {
    if (!productItems.length) {
      setSelectedColorId(null);
      setSelectedSizeId(null);
      setSelectedItem(null);
      setSelectedImage(null);
      return;
    }

    // Chọn item đầu tiên có hàng
    const firstInStock = productItems.find((item) => item.stock > 0);

    if (firstInStock) {
      setSelectedColorId(firstInStock.color_id);
      setSelectedSizeId(firstInStock.size.id);
      setSelectedItem(firstInStock);
      // Chọn ảnh màu đầu tiên 
      const color = colors.find((c) => c.id === firstInStock.color_id);
      if (color?.images?.length) setSelectedImage(color.images[0].url);
      else setSelectedImage(null);
    } else {
      const first = productItems[0];
      setSelectedColorId(first.color_id);
      setSelectedSizeId(first.size.id);
      setSelectedItem(first);
      const color = colors.find((c) => c.id === first.color_id);
      if (color?.images?.length) setSelectedImage(color.images[0].url);
      else setSelectedImage(null);
    }
  }, [productItems, colors]);

  // Khi đổi màu, cập nhật ảnh đại diện và chọn item + size phù hợp
  const handleColorChange = (colorId: number) => {
    setSelectedColorId(colorId);

    // Cập nhật ảnh đại diện màu mới
    const color = colors.find((c) => c.id === colorId);
    if (color?.images?.length) {
      setSelectedImage(color.images[0].url);
    } else {
      setSelectedImage(null);
    }

    // Kiểm tra với size đang chọn
    const matchedWithCurrentSize = productItems.find(
      (item) =>
        item.color_id === colorId &&
        item.size.id === selectedSizeId &&
        item.stock > 0
    );

    if (matchedWithCurrentSize) {
      setSelectedItem(matchedWithCurrentSize);
      setSelectedSizeId(matchedWithCurrentSize.size.id);
    } else {
      // Chọn size đầu tiên còn hàng với màu này
      const firstForColor = productItems.find(
        (item) => item.color_id === colorId && item.stock > 0
      );
      if (firstForColor) {
        setSelectedItem(firstForColor);
        setSelectedSizeId(firstForColor.size.id);
      } else {
        setSelectedItem(null);
        setSelectedSizeId(null);
      }
    }
  };

  // Khi chọn size
  const handleSizeChange = (sizeId: number) => {
    setSelectedSizeId(sizeId);

    const matched = productItems.find(
      (item) =>
        item.color_id === selectedColorId &&
        item.size.id === sizeId &&
        item.stock > 0
    );

    if (matched) {
      setSelectedItem(matched);
    } else {
      setSelectedItem(null);
    }
  };

  // Hàm này lọc size từ product-item theo color-id để khi click màu sẽ lấy size tương ứng (cái này khoai)
  const availableSizesForSelectedColor = allSizes.map((size) => {
    const hasStock = productItems.some(
      (item) =>
        item.color_id === selectedColorId &&
        item.size.id === size.id &&
        item.stock > 0
    );
    return { ...size, disabled: !hasStock };
  });

  // Ảnh nhỏ theo màu
  const images = colors.find((c) => c.id === selectedColorId)?.images || [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex gap-4">
          {/* Ảnh nhỏ kéo dọc, max chiều cao fix */}
          <div className="flex flex-col gap-2 w-20 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="thumb"
                loading="lazy"
                onClick={() => setSelectedImage(img.url)}
                className={`w-full object-cover rounded-md border cursor-pointer transition ring-2 ${
                  selectedImage === img.url
                    ? "ring-black"
                    : "ring-transparent hover:ring-gray-400"
                }`}
              />
            ))}
          </div>
          {/* Ảnh lớn */}
          <div className="flex-1">
            <img
              src={selectedImage || images[0]?.url}
              alt="main"
              loading="lazy"
              className="w-full object-cover rounded-md border max-h-[500px]"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-md p-4 space-y-4 self-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">
              SKU: {selectedItem?.sku || "Đang cập nhật"}
            </p>
            <p className="text-xl text-red-600 font-semibold">
              {selectedItem
                ? (
                    selectedItem.sale_price > 0
                      ? selectedItem.sale_price
                      : selectedItem.price
                  ).toLocaleString()
                : "Liên hệ"}{" "}
              ₫
            </p>

            {/* Chọn màu */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Màu:</span>
              {colors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className="w-6 h-6 rounded-full border cursor-pointer transition"
                  style={{
                    backgroundColor: color.code,
                    outline:
                      color.id === selectedColorId ? "2px solid black" : "none",
                  }}
                  title={color.name}
                />
              ))}
            </div>
              {/* Số lượng còn */}
            <div className="text-sm">
              <p>Số lượng còn:</p>
              <span className="font-medium">
                {selectedItem?.stock && selectedItem.stock > 0
                  ? selectedItem.stock
                  : "Hết hàng"}
              </span>
            </div>

            {/* Chọn size */}
            <div className="relative z-0">
              <p className="text-sm mb-1">Chọn size:</p>
              <Radio.Group
                value={selectedSizeId}
                onChange={(e) => handleSizeChange(e.target.value)}
              >
                {availableSizesForSelectedColor.map((size) => (
                  <Radio.Button
                    key={size.id}
                    value={size.id}
                    disabled={size.disabled}// nếu stock = 0 chặn ấn
                  >
                    {size.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

          
          </div>

          <Button
            size="large"
            className="bg-black text-white border-none hover:!bg-black hover:!opacity-90 hover:!text-white w-full"
            disabled={!selectedItem || selectedItem.stock <= 0}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Mô tả" key="1" className="border border-gray-200 p-4">
            <p className="text-sm leading-relaxed text-gray-700">
              <strong>Mô tả ngắn:</strong> {product.short_description}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-2">
              <strong>Chi tiết:</strong> {product.description}
            </p>
          </TabPane>

          <TabPane tab="Bình luận" key="2" className="border border-gray-200 p-4">
            {product.comments?.filter((c) => c.is_active === 1).length > 0 ? (
              product.comments
                .filter((c) => c.is_active === 1)
                .map((c) => (
                  <div key={c.id} className="mb-2">
                    <p className="font-semibold">
                      {c.user.name} - {c.created_at}
                    </p>
                    <p className="text-gray-700 text-sm">{c.content}</p>
                  </div>
                ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </TabPane>
          <TabPane tab="Đánh giá" key="3" className="border border-gray-200 p-4">
            <p>Chưa có đánh giá nào.</p>
          </TabPane>
        </Tabs>
      </div>

      <div className="">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Sản phẩm liên quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4  ">
          {product.related_products.slice(0,4).map((rp) => (
            <div key={rp.slug}  onClick={() => nav(`/products/${rp.slug}`)}  className="border rounded-md   hover:shadow transition cursor-pointer">
              <img
                src={rp.images?.[0]?.url}
                alt={rp.name}
                className="w-full h-80 object-cover "
                loading="lazy"
              />
              <div className="p-3 pt-4">
                 <p className=" font-bold">
                  {rp.price.toLocaleString()} ₫
                </p>
                <p className="text-sm font-bold">{rp.name}</p>
          
              </div>
           
           
            </div>
          ))}
        </div>
        <div className="text-lg font-semibold mt-4 text-center"> <Button>Xem thêm</Button></div>
       
      </div>
    </div>
  );
};

export default ProductDetail;
