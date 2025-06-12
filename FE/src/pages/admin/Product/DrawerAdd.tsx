/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { useCreate, useList } from "@refinedev/core";
import {
  Button,
  Cascader,
  Checkbox,
  CheckboxChangeEvent,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Spin,
  Tooltip,
  Upload,
  UploadFile,
} from "antd";
import { useWatch } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

type DrawerAddPros = {
  openDrawerAdd: boolean;
  setOpenDrawerAdd: (openDrawerAdd: boolean) => void;
  options: any[];
  refetch: () => void;
};

const DrawerAdd = ({
  openDrawerAdd,
  setOpenDrawerAdd,
  options,
  refetch,
}: DrawerAddPros) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    category: 0,
    description: "",
    status: 0,
    long_description: "",
    price: 0,
    variants: [],
    images: [],
  });
  // const [uploadKey, setUploadKey] = useState(Date.now());

  const [form] = Form.useForm();

  const resetAllStates = () => {
    setImportPrice(0);
    setSellingPrice(0);
    setPercent(0);

    setUploadImagesMap({});
    setSelectedColors([]);
    setSelectedColorsId([]);

    setSelectedSizes([]);
    setSelectedSizesId([]);

    setDefaultStock(10);
    setSelectedColorForImages(null);

    setFormData({
      name: "",
      category: 0,
      description: "",
      status: 0,
      long_description: "",
      price: 0,
      variants: [],
      images: [],
    });

    form.resetFields();
  };

  const [importPrice, setImportPrice] = useState<any>(0);
  const [sellingPrice, setSellingPrice] = useState<any>(0);
  const [percent, setPercent] = useState<any>(0);

  const [uploadImagesMap, setUploadImagesMap] = useState<{
    [colorId: string]: UploadFile[];
  }>({});

  const [selectedColors, setSelectedColors] = useState<any>([]);
  const [selectedColorsId, setSelectedColorsId] = useState<any>([]);

  const [selectedSizes, setSelectedSizes] = useState<any>([]);
  const [selectedSizesId, setSelectedSizesId] = useState<any>([]);

  const [defaultStock, setDefaultStock] = useState<any>(10);
  const [selectedColorForImages, setSelectedColorForImages] =
    useState<any>(null);

  // const onSearch = () => {};

  const onClose = () => {
    setOpenDrawerAdd(false);
  };

  const { data: colors } = useList({ resource: "admin/variations/color" });
  const { data: sizes } = useList({ resource: "admin/variations/size" });

  const validateColorsWithImages = () => {
    const errors = selectedColors.filter((color: any) => {
      const files = uploadImagesMap[color.id];
      return !files || files.length === 0;
    });

    if (errors.length > 0) {
      const colorNames = errors.map((c: any) => c.name).join(", ");
      notification.error({
        message: `Vui lòng chọn ảnh cho các màu: ${colorNames}`,
      });
      return false;
    }

    return true;
  };

  const { mutate: createProduct, isLoading } = useCreate();

  const onFinish = (values: any) => {
    // console.log(values);
    if (formData.variants.length === 0) {
      notification.warning({ message: "Chọn ít nhất 1 cặp biến thể" });
      return;
    }
    if (!validateColorsWithImages()) return;

    const formDataRequest = new FormData();

    formDataRequest.append("name", values.name);
    formDataRequest.append(
      "category_id",
      values.category?.[values.category.length - 1]
    );
    formDataRequest.append("short_description", values.description);
    formDataRequest.append("description", values.long_description);
    // formDataRequest.append("variants", formData.variants);
    // formDataRequest.append("images", formData.images);

    formData.variants.forEach((variant: any, index: any) => {
      formDataRequest.append(`variants[${index}][color_id]`, variant.color.id);
      formDataRequest.append(`variants[${index}][size_id]`, variant.size.id);
      formDataRequest.append(
        `variants[${index}][sale_percent]`,
        variant.percent
      );
      formDataRequest.append(
        `variants[${index}][import_price]`,
        variant.importPrice
      );
      formDataRequest.append(`variants[${index}][price]`, variant.sellingPrice);
      formDataRequest.append(`variants[${index}][stock]`, variant.stock);
    });

    formData.images.forEach((image: any, index: any) => {
      formDataRequest.append(`images[${index}][color_id]`, image.colorId);
      formDataRequest.append(`images[${index}][url]`, image.image);
      // if (image.file?.originFileObj) {
      // }
    });

    createProduct(
      {
        resource: "admin/products",
        values: formDataRequest,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: (response) => {
          resetAllStates();
          onClose();
          refetch();
          notification.success({ message: response?.data?.message });
        },
        onError: (err) => {
          notification.error({ message: "Thêm sản phẩm thất bại" });
          console.log(err);
        },
      }
    );
  };

  const gia_nhap = useWatch("gia_nhap", form); // Giá bán
  const gia_ban = useWatch("gia_ban", form); // Giá nhập

  const updateVariantStock = (variantId: number, stock: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.map((variant: any) =>
        variant.id === variantId ? { ...variant, stock } : variant
      ),
    });
  };
  const updateImportPrice = (variantId: number, importPrice: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.map((variant: any) =>
        variant.id === variantId ? { ...variant, importPrice } : variant
      ),
    });
  };
  const updateSellingPrice = (variantId: number, sellingPrice: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.map((variant: any) =>
        variant.id === variantId ? { ...variant, sellingPrice } : variant
      ),
    });
  };
  const updatePercent = (variantId: number, percentSell: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.map((variant: any) =>
        variant.id === variantId
          ? { ...variant, percent: percentSell }
          : variant
      ),
    });
  };

  const handleColorToggle = (color: any, checked: any) => {
    let updatedColors: any;

    if (checked) {
      updatedColors = [...selectedColors, color];
      setSelectedColors(updatedColors);
      setSelectedColorsId((prev: any) => [...prev, color.id]);
      // console.log(updatedColors);

      if (selectedColors.length === 0) {
        setSelectedColorForImages(color);
      }
    } else {
      updatedColors = selectedColors?.filter((c: any) => c?.id !== color?.id);
      setSelectedColors(updatedColors);
      setSelectedColorsId((prev: any) =>
        prev.filter((id: any) => id !== color.id)
      );

      setUploadImagesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[color.id];

        syncImagesToFormData(newMap);

        return newMap;
      });

      if (selectedColorForImages?.id === color?.id) {
        setSelectedColorForImages(
          updatedColors.length > 0 ? updatedColors[0] : null
        );
      }
    }

    generateVariants(updatedColors, selectedSizes);
  };

  const handleSizeToggle = (size: any, checked: any) => {
    let updatedSizes: any;

    if (checked) {
      updatedSizes = [...selectedSizes, size];
      setSelectedSizesId((prev: any) => [...prev, size.id]);
    } else {
      updatedSizes = selectedSizes.filter((s: any) => s?.id !== size?.id);
      setSelectedSizesId((prev: any) =>
        prev.filter((id: any) => id !== size.id)
      );
    }

    // const updatedSizes = checked
    //   ? [...selectedSizes, size]
    //   : selectedSizes.filter((s: any) => s?.id !== size?.id);

    setSelectedSizes(updatedSizes);
    generateVariants(selectedColors, updatedSizes);
  };

  const syncImagesToFormData = (map: Record<string, UploadFile[]>) => {
    const imagesArray: any[] = [];

    Object.entries(map).forEach(([colorId, fileList]) => {
      fileList.forEach((file: UploadFile) => {
        if (file.originFileObj) {
          imagesArray.push({
            colorId: Number(colorId),
            image: file.originFileObj,
          });
        }
      });
    });

    setFormData((prev: any) => ({
      ...prev,
      images: imagesArray,
    }));
  };

  const handleUploadChange2 = (info: { fileList: UploadFile[] }) => {
    const colorId = selectedColorForImages?.id;
    if (!colorId) return;

    const updatedMap = {
      ...uploadImagesMap,
      [colorId]: info.fileList,
    };

    setUploadImagesMap(updatedMap);
    syncImagesToFormData(updatedMap); // cập nhật luôn formData.images
  };

  const handleRemoveFile = (file: UploadFile) => {
    if (!selectedColorForImages) return;

    const colorId = selectedColorForImages.id;

    const updatedList =
      uploadImagesMap[selectedColorForImages.id]?.filter(
        (f) => f.uid !== file.uid
      ) || [];

    const newMap = {
      ...uploadImagesMap,
      [colorId]: updatedList,
    };

    setUploadImagesMap(newMap);

    syncImagesToFormData(newMap);
  };

  const generateVariants = (colorsList: any, sizesList: any) => {
    if (colorsList.length === 0 || sizesList.length === 0) {
      setFormData({
        ...formData,
        variants: [],
      });
      return;
    }

    const newVariants: any = [];

    let variantId = 1;

    // Nếu đã có biến thể, lấy ID lớn nhất để tạo ID mới
    if (formData.variants.length > 0) {
      variantId = Math.max(...formData.variants.map((v: any) => v.id)) + 1;
    }

    colorsList.forEach((color: any) => {
      sizesList.forEach((size: any) => {
        const existingVariant = formData.variants.find(
          (v: any) => v?.color?.id === color?.id && v.size?.id === size?.id
        );

        if (existingVariant) {
          // Nếu đã tồn tại, giữ nguyên số lượng tồn kho
          newVariants.push(existingVariant);
        } else {
          // Nếu chưa tồn tại, tạo mới với số lượng tồn kho mặc định
          newVariants.push({
            id: variantId++,
            color,
            size,
            stock: defaultStock,
            importPrice: importPrice,
            sellingPrice: sellingPrice,
            percent: percent,
          });
        }
      });
    });

    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const contentStyle = {
    padding: 50,
    background: "transparent",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  return (
    <div>
      <Drawer
        width="60%"
        title="Thêm sản phẩm"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={openDrawerAdd}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button
              htmlType="submit"
              onClick={() => form.submit()}
              type="primary"
            >
              Lưu
            </Button>
          </div>
        }
      >
        {isLoading && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-white/50">
            <Spin tip="Đang tải dữ liệu" size="large">
              {content}
            </Spin>
          </div>
        )}

        <p className="text-xl font-semibold mb-5">Thông tin chung</p>
        <Form
          initialValues={{
            defaultStock: defaultStock,
            gia_ban: 0,
            gia_nhap: 0,
            percent: 0,
            status: "1",
          }}
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label={
                <span>
                  Tên sản phẩm<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="name"
              required={false}
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Danh mục<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="category"
              required={false}
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Cascader options={options} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Trạng thái<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="status"
              required={false}
              rules={[{ required: true }]}
            >
              <Select
                defaultValue={"1"}
                options={[
                  { value: "1", label: "Hiển thị" },
                  { value: "0", label: "Ẩn" },
                ]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label={
                <span>
                  Giá nhập<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="gia_nhap"
              required={false}
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                { pattern: /^[1-9]\d*$/, message: "Vui lòng nhập số dương!" },
              ]}
            >
              <InputNumber onChange={(value) => setImportPrice(value)} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Giá bán<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="gia_ban"
              required={false}
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                { pattern: /^[1-9]\d*$/, message: "Vui lòng nhập số dương!" },
              ]}
            >
              <InputNumber onChange={(value) => setSellingPrice(value)} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Phần trăm khuyến mãi
                  <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="percent"
              required={false}
              rules={[
                { pattern: /^[0-9]\d*$/, message: "Vui lòng nhập số dương!" },
              ]}
            >
              <InputNumber onChange={(value) => setPercent(value)} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label={
                <span>
                  Tồn kho<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="defaultStock"
            >
              <InputNumber
                className=""
                onChange={(value) => setDefaultStock(value)}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Mô tả<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="description"
              required={false}
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Mô tả dài<span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="long_description"
              required={false}
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea />
            </Form.Item>
          </div>
          <h3 className="text-2xl font-semibold mb-3">Biến thể sản phẩm</h3>
          <div className="grid grid-cols-2 gap-5 mb-3">
            <div className="border py-5 px-4 rounded-md">
              <p className="text-base mb-5 font-semibold">Màu sắc</p>
              <div className="grid grid-cols-2 gap-y-3 max-h-60 overflow-y-auto">
                {colors?.data?.map((color: any) => (
                  <div key={color?.id}>
                    <Tooltip
                      className="flex items-center gap-2"
                      title={
                        !gia_ban || !gia_nhap ? "Vui lòng nhập giá trước" : ""
                      }
                    >
                      <Checkbox
                        id={`${color?.id}`}
                        // value={color.id}
                        checked={selectedColorsId.includes(color.id)}
                        disabled={!gia_ban || !gia_nhap}
                        onChange={(e: CheckboxChangeEvent) =>
                          handleColorToggle(color, e.target.checked === true)
                        }
                      />
                      <label htmlFor={`${color?.id}`}>{color?.name}</label>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
            <div className="border py-5 px-4 rounded-md">
              <p className="text-base font-semibold mb-5">Kích cỡ</p>
              <div className="grid grid-cols-2 gap-y-3 max-h-60 overflow-y-auto">
                {sizes?.data?.map((size: any) => (
                  <div key={size?.id}>
                    <Tooltip
                      className="flex items-center gap-2"
                      title={
                        !gia_ban || !gia_nhap ? "Vui lòng nhập giá trước" : ""
                      }
                    >
                      <Checkbox
                        id={`${size?.id}`}
                        // value={size.id}
                        disabled={!gia_ban || !gia_nhap}
                        checked={selectedSizesId.includes(size.id)}
                        onChange={(e: CheckboxChangeEvent) =>
                          handleSizeToggle(size, e.target.checked === true)
                        }
                      />
                      <label htmlFor={`${size?.id}`}>{size?.name}</label>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Ảnh sản phẩm</h3>

            {selectedColors.length === 0 ? (
              <div className="text-center p-4 border rounded-md text-muted-foreground">
                Vui lòng chọn ít nhất một màu sắc trước khi thêm ảnh.
              </div>
            ) : (
              <>
                <div className="flex gap-3 mb-3">
                  {selectedColors?.map((color: any) => (
                    <Button
                      key={color?.id}
                      className={
                        selectedColorForImages?.id === color?.id
                          ? "!bg-black !text-white"
                          : ""
                      }
                      onClick={() => setSelectedColorForImages(color)}
                    >
                      {color?.name}
                      <span className="text-xs">
                        (
                        {
                          formData.images.filter(
                            (img: any) => img.colorId === color?.id
                          ).length
                        }{" "}
                        ảnh)
                      </span>
                    </Button>
                  ))}
                </div>

                {selectedColorForImages && (
                  <Upload
                    // key={uploadKey}
                    multiple
                    beforeUpload={() => false}
                    onChange={handleUploadChange2}
                    onRemove={handleRemoveFile}
                    listType="picture-card"
                    fileList={uploadImagesMap[selectedColorForImages?.id] || []}
                  >
                    <Button type="primary" icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                )}
              </>
            )}
          </div>

          {formData.variants.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Màu sắc</th>
                    <th className="text-left p-2">Kích thước</th>
                    <th className="text-left p-2">Số lượng tồn</th>
                    <th className="text-left p-2">Giá nhập</th>
                    <th className="text-left p-2">Giá bán</th>
                    <th className="text-left p-2">Phần trăm khuyến mãi</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.variants.map((variant: any) => (
                    <tr key={variant.id} className="border-t">
                      <td className="p-2">{variant.color?.name}</td>
                      <td className="p-2">{variant.size?.name}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariantStock(
                              variant.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant?.importPrice}
                          onChange={(e) =>
                            updateImportPrice(
                              variant.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant?.sellingPrice}
                          onChange={(e) =>
                            updateSellingPrice(
                              variant.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant?.percent}
                          onChange={(e) =>
                            updatePercent(
                              variant.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md text-muted-foreground">
              Chưa có biến thể nào. Vui lòng chọn ít nhất một màu sắc và một
              kích thước.
            </div>
          )}
        </Form>
      </Drawer>
    </div>
  );
};
export default DrawerAdd;
