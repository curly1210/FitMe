/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { Button, Dropdown, Image, Select, Spin, Tooltip, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";

const categoryOptions = [
  { value: "upper_body", label: "Áo / Phần trên" },
  { value: "lower_body", label: "Quần / Phần dưới" },
];

const TryClothes = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imageClothes, setImageClothes] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isLoadingTryClothes, setIsLoadingTryClothes] =
    useState<boolean>(false);
  const [onRoom, setOnRoom] = useState(false);
  const [outputImage, setOutputImage] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const { openModal } = useModal();

  const [currentDropdownProductId, setCurrentDropdownProductId] = useState<
    string | null
  >(null);

  const { data } = useList({
    resource: "wishlist/getImages",
    config: {
      filters: [
        {
          field: "product_id",
          operator: "eq",
          value: currentDropdownProductId,
        },
      ],
    },
    queryOptions: {
      enabled: !!currentDropdownProductId, // Chỉ fetch khi có productId
    },
  });

  const renderOverlay = () => {
    const variantList = data?.data || [];
    console.log(variantList);
    return (
      <div className="flex gap-3 p-3 shadow-[0_6px_16px_0_rgba(0,0,0,0.08),_0_3px_6px_-4px_rgba(0,0,0,0.12),_0_9px_28px_8px_rgba(0,0,0,0.05)]">
        {variantList.map((variant: any, index: any) => (
          <img
            onClick={() => {
              setImageClothes(variant?.image);
              setCurrentDropdownProductId(null);
            }}
            key={index}
            src={variant?.image}
            alt=""
            className="w-[80px] h-[80px] object-cover  cursor-pointer"
          />
        ))}
      </div>
    );
  };

  const handleBeforeUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImageUpload(file);
    setPreviewImage(imageUrl);
    return false;
  };

  const { data: wishListResponse } = useList({
    resource: "wishlist",
  });

  const wishlist = wishListResponse?.data?.data || [];

  const contentStyle = {
    padding: 50,
    background: "transparent",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  const pollStatus = async (predictionId: any) => {
    const res = await axios.get(
      `http://localhost:8000/api/replicate/status/${predictionId}`
    );

    const status = res.data.status;

    console.log("Status:", status);

    if (status === "succeeded") {
      console.log("🎉 Output ready:", res.data.output);
      setOutputImage(res.data.output);
      setIsLoadingTryClothes(false);
    } else if (status === "failed") {
      console.error("❌ Prediction failed:", res.data.error);
      setErrorMessage("Đã có lỗi xảy ra");
      setIsLoadingTryClothes(false);
    } else {
      setTimeout(() => pollStatus(predictionId), 3000); // kiểm tra lại sau 3 giây
    }
  };

  const onTryClothes = async () => {
    setIsLoadingTryClothes(true);
    setOnRoom(true);
    setOutputImage(null);
    setErrorMessage(null);

    const formData = new FormData();

    formData.append(
      "version",
      "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985"
    );
    formData.append("human_img", imageUpload);
    formData.append("garment_des", "man shirt");
    formData.append("category", selectedCategory);
    formData.append("crop", "false");
    formData.append("force_dc", "false");
    formData.append("mask_only", "false");
    formData.append("seed", "42");
    formData.append("steps", "30");
    formData.append("garm_img", imageClothes);

    const response = await axios.post(
      "http://localhost:8000/api/replicate/run",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const predictionId = response.data.id;

    pollStatus(predictionId);
  };

  const handleDownloadImage = async () => {
    if (!outputImage) return;

    try {
      const response = await fetch(outputImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ket-qua-thu-do.png"; // tên file tải về
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // dọn dẹp bộ nhớ
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };

  useEffect(() => {
    if (onRoom) {
      openModal(
        <div className="w-[650px] h-[800px] flex justify-center items-center">
          {isLoadingTryClothes ? (
            <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-[1px] bg-white/50">
              <Spin tip="Đang tải dữ liệu" size="large">
                {content}
              </Spin>
            </div>
          ) : errorMessage ? (
            <div className="text-center text-red-500 font-bold p-6 text-4xl">
              {errorMessage}
            </div>
          ) : outputImage ? (
            <div className="flex flex-col items-center  justify-center">
              <h1 className="text-2xl mb-10 font-semibold">Kết quả thử đồ</h1>
              <Image
                className="!border-none  !w-[400px] !rounded-none    !object-contain"
                src={outputImage}
                alt="Ảnh preview"
                preview
              />
              <button
                onClick={handleDownloadImage}
                className="mt-9 px-6 py-2 bg-black cursor-pointer text-white rounded hover:bg-gray-800 transition-all "
              >
                Tải ảnh về
              </button>
            </div>
          ) : null}
        </div>
      );
    }
  }, [isLoadingTryClothes, onRoom, errorMessage, outputImage]);

  // if (isLoadingWishList) return <div>Loading...</div>;

  return (
    <div className="try-on">
      <h1 className="text-3xl font-bold text-center mb-10">PHÒNG THỬ ĐỒ</h1>

      <div className="grid grid-cols-2 gap-10 mb-4">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-center mb-3">
            Ảnh chân dung
          </h2>

          {previewImage ? (
            <Image
              className="!border-none  !h-[400px] !rounded-none !w-[100%]  !object-contain"
              src={previewImage}
              alt="Ảnh preview"
              preview
            />
          ) : (
            <div className="flex items-center justify-center border border-gray-300 h-[400px] w-full   text-gray-400">
              Ảnh chân dung
            </div>
          )}
          <Upload
            className="!mt-5 !mb-5"
            beforeUpload={handleBeforeUpload}
            listType="picture"
            maxCount={1}
            showUploadList={false}
          >
            <Button className="!w-[160px]" icon={<UploadOutlined />}>
              Chọn ảnh chân dung
            </Button>
          </Upload>
          <div className="self-start">
            <p className="text-sm">
              Chọn loại trang phục <span className="text-red-500">*</span>{" "}
            </p>
            <Select
              className="!w-[160px]"
              placeholder="Chọn loại trang phục"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-center  mb-3">
            Ảnh trang phục
          </h2>
          {imageClothes ? (
            <Image
              className="!border-none  !h-[400px] !rounded-none !w-[100%]  !object-contain"
              src={imageClothes}
              alt="Ảnh preview"
              preview
            />
          ) : (
            <div className="flex items-center justify-center border border-gray-300 h-[400px] w-full   text-gray-400">
              Ảnh trang phục
            </div>
          )}

          <div className="mt-5">
            {wishlist.length > 0 ? (
              <div className="flex gap-3">
                {wishlist.map((item: any) => (
                  <Dropdown
                    key={item?.id}
                    onOpenChange={(visible) => {
                      if (visible) {
                        setCurrentDropdownProductId(item.product.id);
                      } else {
                        setCurrentDropdownProductId(null);
                      }
                    }}
                    open={currentDropdownProductId === item.product.id}
                    overlay={renderOverlay}
                    placement="bottom"
                    trigger={["click"]}
                    arrow
                  >
                    <img
                      src={item?.product?.product_images[0].url}
                      className="w-[50px] h-[50px] cursor-pointer object-cover"
                      alt=""
                    />
                  </Dropdown>
                ))}
              </div>
            ) : (
              <div>Chưa có sản phẩm yêu thích</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Tooltip
          title={
            !previewImage || !imageUpload || !selectedCategory
              ? "Vui lòng chọn ảnh người, ảnh quần áo và loại trang phục"
              : ""
          }
        >
          <span>
            <Button
              size="large"
              className="!bg-black !text-white !border-none !rounded-none !px-10 !py-6 !hover:bg-gray-800 !duration-200"
              disabled={!previewImage || !imageUpload || !selectedCategory}
              onClick={() => onTryClothes()}
            >
              Thử đồ
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
export default TryClothes;
