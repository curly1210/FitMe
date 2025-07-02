/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Tabs,
  Radio,
  Button,
  Tooltip,
  Space,
  notification,
  Pagination,
} from "antd";
import { useCreate, useCustom, useOne } from "@refinedev/core";
import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { RightOutlined } from "@ant-design/icons";
import { useAuthen } from "../../../hooks/useAuthen";
import { useModal } from "../../../hooks/useModal";
import ModalLogin from "../../../components/Modal/ModalLogin";

import { AiOutlineMinus } from "react-icons/ai";

import { IoAdd } from "react-icons/io5";
import { useCart } from "../../../hooks/useCart";
import TextArea from "antd/es/input/TextArea";

import { GoStarFill } from "react-icons/go";
import StarRating from "../../../utils/StarRating";

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
  sale_percent: number;
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
interface RelatedProductColor {
  id: string;
  code: string;
}

interface RelatedProduct {
  id?: number;
  name: string;
  slug: string;
  price: number;
  colors: RelatedProductColor[];
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

const ratingOptions = [
  { label: "Tất Cả", value: null },
  { label: "5 Sao", value: 5 },
  { label: "4 Sao", value: 4 },
  { label: "3 Sao", value: 3 },
  { label: "2 Sao", value: 2 },
  { label: "1 Sao", value: 1 },
];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { accessToken, user } = useAuthen();
  const { openModal } = useModal();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Paginate review
  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [pageSizeReviews, setPageSizeReviews] = useState(10);

  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const { addToCartHandler, isLoadingAddtoCart } = useCart();

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[1-9]\d*$/.test(value)) {
      setQuantity(value === "" ? 1 : Number(value));
    }
  };

  const onHandleQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const { data, isLoading, error, refetch } = useOne<Product>({
    resource: "products",
    id: slug,
    queryOptions: { enabled: !!slug },
  });

  const nav = useNavigate();

  const product = data?.data;

  // console.log(product);
  const productItems: ProductItem[] = product?.product_items || [];
  const allSizes: Size[] = product?.sizes || [];
  const colors: ColorImage[] = product?.color_images || [];

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: responseReviews,
    // isLoading,
    // refetch,
  } = useCustom({
    method: "get",
    url: "reviews",
    config: {
      query: {
        page: currentPageReview,
        per_page: pageSizeReviews,
        ...(product?.id && { product_id: product.id }),
        ...(selectedRating && { rate: selectedRating }),
      },
    },

    queryOptions: { enabled: !!product?.id },
  });

  const handlePageReviewsChange = (page: number, pageSize?: number) => {
    setCurrentPageReview(page);
    if (pageSize) setPageSizeReviews(pageSize);
  };

  console.log(responseReviews?.data);

  const reviews = responseReviews?.data?.data || [];
  const totalReviews = responseReviews?.data?.meta?.total || 0;

  const handleAddToCart = () => {
    if (!accessToken || !user) {
      openModal(<ModalLogin />);
      return;
    }

    addToCartHandler(selectedItem?.id, quantity);

    // alert(`Thêm vào giỏ hàng thành công, idBienthe: ${selectedItem?.id}`);
    // if (!selectedItem || selectedItem.stock <= 0) {
    //   return; // Không thêm vào giỏ hàng nếu không có item hoặc hết hàng
    // }

    // // Giả lập thêm vào giỏ hàng
    // console.log("Thêm vào giỏ hàng:", selectedItem);
    // // Thực hiện logic thêm vào giỏ hàng ở đây
  };

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
        item.stock > 0 // Chỉ chọn những item còn hàng
    );

    if (matchedWithCurrentSize) {
      setSelectedItem(matchedWithCurrentSize);
      setSelectedSizeId(matchedWithCurrentSize.size.id);
    } else {
      // Chọn size đầu tiên còn hàng với màu này
      const firstForColor: any = productItems.find(
        // (item) => item.color_id === colorId
        (item) => item.color_id === colorId && item.stock > 0
      );
      // setSelectedItem(firstForColor);
      // if (firstForColor.stock > 0) {
      //   setSelectedSizeId(firstForColor.size.id);
      // } else {
      //   setSelectedSizeId(null);
      // }

      if (firstForColor) {
        setSelectedItem(firstForColor);
        setSelectedSizeId(firstForColor.size.id);
      } else {
        setSelectedItem(productItems[0]);
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

  /* Comment */
  const { mutate: createComment, isLoading: loadingCreateComment } =
    useCreate();
  const handleSubmitComment = () => {
    /* Chưa có comment nào */
    if (comment === "") {
      notification.error({ message: "Vui lòng nhập comment" });
      return;
    }

    createComment(
      {
        resource: `products/${product?.id}/comments`,
        values: {
          content: comment,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Bình luận thành công" });
          refetch(); // Lấy lại dữ liệu giỏ hàng sau khi thêm thành công
          setComment("");
        },
        onError: (error) => {
          notification.error({ message: `${error?.response?.data?.message}` });
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="space-y-10">
      <div className="flex gap-3 border border-gray-300 items-center py-5 px-4 mb-5">
        <Link className="text-gray-500" to={"/"}>
          Trang chủ
        </Link>
        <RightOutlined className="text-sm text-gray-500" />
        <Link
          className="text-gray-500"
          state={{ categoryData: product.category }}
          to={`/category/${product.category.slug}`}
        >
          {product.category.name}
        </Link>
        <RightOutlined className="text-sm text-gray-500" />
        <Link className="font-bold" to={""}>
          {product.name}
        </Link>

        {/* {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="p-4  rounded">
          Gợi ý #{i + 1}
        </div>
      ))} */}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex gap-4">
          {/* Ảnh nhỏ kéo dọc, max chiều cao fix */}
          <div className="flex flex-col gap-2 w-20 max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {images.map((img) => (
              <div
                key={img.id}
                className={`w-[80px] h-[80px]  overflow-hidden border  cursor-pointer    ${
                  selectedImage === img.url
                    ? " border-black"
                    : " border-gray-300"
                }`}
              >
                <img
                  src={img.url}
                  alt="thumb"
                  loading="lazy"
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-full h-full object-cover  duration-200 hover:scale-110 `}
                />
              </div>
            ))}
          </div>
          {/* Ảnh lớn */}
          <div className="flex-1">
            <img
              src={selectedImage || images[0]?.url}
              alt="main"
              loading="lazy"
              className="w-full object-cover  h-[700px]"
            />
          </div>
        </div>

        <div className="col-span-1 border border-gray-200 rounded-md p-4 space-y-4 self-start">
          <div className="">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-sm text-gray-500">
                SKU: {selectedItem?.sku || "Đang cập nhật"}
              </p>

              <p className="text-xl text-black-600 font-semibold">
                {selectedItem ? (
                  selectedItem.sale_price > 0 ? (
                    <>
                      <span className="text-red-500">
                        {selectedItem.sale_price.toLocaleString()} ₫
                      </span>
                      <span className="line-through text-gray-400 ml-2">
                        {selectedItem.price.toLocaleString()} ₫
                      </span>
                      <span className="ml-2 text-green-600 text-sm">
                        -{selectedItem.sale_percent}%
                      </span>
                    </>
                  ) : (
                    <span>{selectedItem.price.toLocaleString()} ₫</span>
                  )
                ) : null}
              </p>

              {/* <p>{selectedItem?.sale_percent}</p> */}
              <div className="text-sm flex items-center gap-2 mb-3">
                {/* Số lượng còn */}
                <p>Số lượng còn:</p>
                <span className="font-medium">
                  {selectedItem?.stock && selectedItem.stock > 0
                    ? selectedItem.stock
                    : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Chọn màu */}
            <div className="flex items-center gap-2 mb-3">
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

            {/* Chọn size */}
            <div className="relative z-0 product-size-select mb-7">
              {/* <p className="text-sm mb-1">Chọn size:</p> */}
              <Radio.Group
                className="!flex !gap-3 !rounded-none"
                value={selectedSizeId}
                onChange={(e) => handleSizeChange(e.target.value)}
              >
                {availableSizesForSelectedColor.map((size) => (
                  <Radio.Button
                    key={size.id}
                    value={size.id}
                    disabled={size.disabled} // nếu stock = 0 chặn ấn
                    className="font-bold p-5 relative"
                  >
                    {size.name}
                    {size.disabled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-full h-[1px] bg-gray-500 rotate-30"></div>
                        <div className="absolute w-full h-[1px] bg-gray-500 -rotate-30"></div>
                      </div>
                    )}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            <div className="border border-solid border-neutral-400 w-fit   flex items-center">
              <button
                onClick={() => onHandleQuantity(quantity - 1)}
                className="py-2 px-4 cursor-pointer"
              >
                {/* <FaMinus className="font-light" /> */}
                <AiOutlineMinus />
              </button>
              <input
                // defaultValue={1}
                value={quantity}
                onChange={onHandleChange}
                className="w-[30px] text-center "
                type="text"
              />
              <button
                onClick={() => onHandleQuantity(quantity + 1)}
                className="py-2 px-4 cursor-pointer"
              >
                <IoAdd />
              </button>
            </div>
          </div>

          {/* <button disabled={!selectedItem || selectedItem.stock <= 0}>
            Thêm vào giỏ hàng
          </button> */}

          <Tooltip
            placement="bottom"
            title={!selectedSizeId ? "Vui lòng chọn màu sắc và kích cỡ" : ""}
          >
            <Button
              loading={isLoadingAddtoCart}
              size="large"
              className="!bg-black !text-white !border-none !rounded-none     w-full !py-6"
              disabled={!selectedItem || selectedItem.stock <= 0}
              onClick={() => handleAddToCart()}
            >
              Thêm vào giỏ hàng
            </Button>
          </Tooltip>
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

          <TabPane
            tab="Bình luận"
            key="2"
            className="border border-gray-200 p-4"
          >
            <div className="max-h-[300px] overflow-y-auto pr-3 mb-4 space-y-4 rounded-md bg-gray-50 p-4 shadow-inner">
              {product.comments?.filter((c) => c.is_active === 1).length > 0 ? (
                product.comments
                  .filter((c) => c.is_active === 1)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border border-gray-200 p-3 rounded shadow-sm"
                    >
                      <p className="font-semibold text-sm text-gray-800 mb-1">
                        {c.user.name} -{" "}
                        <span className="text-xs text-gray-500">
                          {c.created_at}
                        </span>
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
              )}
            </div>

            <Space.Compact style={{ width: "100%" }}>
          <TextArea
  rows={4}
  placeholder="Bình luận ..."
  value={comment}
  onChange={(e) => {
    if (!accessToken || !user) return;
    setComment(e.target.value);
  }}
  onFocus={() => {
    if (!accessToken || !user) {
      openModal(<ModalLogin />); 
    }
  }}
  className="rounded-l-md cursor-pointer"
/>
              <Button
                type="primary"
                className="rounded-r-md"
                onClick={handleSubmitComment}
                loading={loadingCreateComment}
              >
                Bình luận
              </Button>
            </Space.Compact>
          </TabPane>

          <TabPane
            tab="Đánh giá"
            key="3"
            className="border border-gray-200 p-4"
          >
            <h1 className="text-xl mb-5">ĐÁNH GIÁ SẢN PHẨM</h1>

            <div className="p-5 grid grid-cols-12 gap-x-10 border bg-gray-100 border-gray-300 mb-8">
              <div className="col-span-2">
                <div className="flex w-[70%] flex-col justify-center items-center">
                  <p className="text-red-500 text-xl mb-1">
                    <span className="text-3xl">
                      {responseReviews?.data?.review_rate}
                    </span>{" "}
                    trên 5
                  </p>
                  <div className="flex  ">
                    <GoStarFill className="text-red-500 text-xl" />
                    <GoStarFill className="text-red-500 text-xl" />
                    <GoStarFill className="text-red-500 text-xl" />
                    <GoStarFill className="text-red-500 text-xl" />
                    <GoStarFill className="text-red-500 text-xl" />
                  </div>
                </div>
              </div>
              <div className="col-span-10 flex gap-2 items-center">
                {ratingOptions.map((rate) => (
                  <button
                    key={rate.label}
                    onClick={() => setSelectedRating(rate.value)}
                    className={`px-5 py-1 border cursor-pointer ${
                      selectedRating === rate.value ||
                      (rate.value === null && selectedRating === null)
                        ? "border-red-500 text-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {rate.label} (
                    {
                      responseReviews?.data?.[
                        `total_review${rate.value ? `_${rate?.value}` : ""}`
                      ]
                    }
                    )
                  </button>
                ))}
              </div>
            </div>

            <div>
              {reviews?.map((review: any) => (
                <div
                  key={review?.id}
                  className="border-b-[1px] border-gray-300 "
                >
                  <div className="flex gap-4 px-5 mb-8 mt-8">
                    <div>
                      <img src="" className="w-8 h-8 rounded-full" alt="" />
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-[2px]">
                        <p>{review?.user?.name}</p>
                        <div className="flex">
                          <StarRating rating={review?.rate} />
                          {/* <StarRating rating={review.rate} /> */}
                        </div>
                        <p className="text-gray-500">{review?.updated_at}</p>
                      </div>
                      <p className="text-justify">{review?.content}</p>
                      <div className="flex gap-3">
                        {review?.review_images?.map((image: any) => (
                          <img
                            key={image?.id}
                            src={image?.url}
                            className="block w-[80px] h-[80px]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center ">
              <Pagination
                current={currentPageReview}
                pageSize={pageSizeReviews}
                total={totalReviews}
                // showSizeChanger
                onChange={handlePageReviewsChange}
                style={{ marginTop: 16, textAlign: "right" }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>

      <div className="">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Sản phẩm liên quan
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.related_products.slice(0, 4).map((rp) => (
            <div
              key={rp.slug}
              onClick={() => nav(`/products/${rp.slug}`)}
              className="border rounded-md hover:shadow transition cursor-pointer overflow-hidden group"
            >
              {/* Wrapper có kích thước cố định */}
              <div className="relative w-full h-80 overflow-hidden">
                {/* Container chứa 2 ảnh xếp ngang */}
                <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                  <img
                    src={rp.images?.[0]?.url}
                    alt={rp.name}
                    className="w-1/2 h-full object-cover"
                  />
                  <img
                    src={rp.images?.[1]?.url}
                    alt={rp.name}
                    className="w-1/2 h-full object-cover"
                  />
                </div>
              </div>

              {/* Nội dung */}
              <div className="p-3 pt-4 space-y-2">
                {/* Màu sắc */}
                <div className="flex gap-2">
                  {rp.colors?.map((c, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: c.code }}
                    />
                  ))}
                </div>

                <p className="font-bold text-red-500">
                  {rp.price.toLocaleString()} ₫
                </p>
                <p className="text-sm font-bold line-clamp-2">{rp.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-lg font-semibold mt-4 text-center">
          {" "}
          <Button>Xem thêm</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
