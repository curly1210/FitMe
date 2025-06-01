import React, { useState, useEffect } from "react";
import { useList, useUpdate } from "@refinedev/core";
import { Drawer, Form, Input, Select, Upload, Button, message, Image } from "antd";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import BannerDetailDrawer from "./BannerDetail";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

type Banner = {
  id: number;
  title: string;
  direct_link: string;
  updated_at: string;
  url_image: string;
  content?: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
};

type News = {
  id: number;
  name: string;
  slug: string;
};

type CategoryItem = {
  id: string;
  name: string;
  image: string;
};

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  items: CategoryItem[];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function BannerList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedLinkType, setSelectedLinkType] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
  const [selectedNews, setSelectedNews] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [directLink, setDirectLink] = useState<string>("#");
  const [categories, setCategories] = useState<Category[]>([]);

  const { data: bannersData, isLoading, isError } = useList<Banner>({ resource: "admin/banners" });
  const banners = bannersData?.data ?? [];

  const { data: productsData } = useList<Product>({ resource: "admin/banners/products" });
  const products = productsData?.data ?? [];

  const { data: newsData } = useList<News>({ resource: "admin/banners/posts" });
  const news = newsData?.data ?? [];

  const { data: categoriesData } = useList<Category>({ resource: "admin/categories" });

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.data);
  }, [categoriesData]);

  const { mutate: updateBanner, isLoading: updating } = useUpdate({
    resource: `admin/banners/${selectedBanner?.id}`,
  });

  const handleEdit = (banner: Banner) => {
    console.log(banner);
    
    setSelectedBanner(banner);
    setDrawerOpen(true);
    setFileList([]);
    setPreviewImage(banner.url_image);

    let linkType = "#";
    let productSlug: string | undefined;
    let newsSlug: string | undefined;
    let categoryId: string | undefined;
    let subCategoryId: string | undefined;

    let rawLink = (banner.direct_link || "") as string;

    if (rawLink?.startsWith("/san-pham/")) {
      linkType = "/products";
      productSlug = rawLink.replace("/san-pham/", "");
      setSelectedProduct(productSlug);
    } else if (rawLink?.startsWith("/tin-tuc/")) {
      linkType = "/news";
      newsSlug = rawLink.replace("/tin-tuc/", "");
      setSelectedNews(newsSlug);
    } else if (rawLink?.startsWith("/danh-muc/")) {
      linkType = "/category";
      const parts = rawLink.replace("/danh-muc/", "").split("/");
      const catSlug = parts[0];
      const subCatSlug = parts[1];
      const category = categories.find((c) => slugify(c.name) === catSlug);
      categoryId = category?.id;
      const subCategory = category?.items.find((item) => slugify(item.name) === subCatSlug);
      subCategoryId = subCategory?.id;
      setSelectedCategory(categoryId);
      setSelectedSubCategory(subCategoryId);
    }

    setDirectLink(rawLink);
    setSelectedLinkType(linkType);

    form.setFieldsValue({
      title: banner.title,
      direct_link: linkType,
      product: productSlug,
      news: newsSlug,
      category: categoryId,
      sub_category: subCategoryId,
    });
    console.log(form);
  };

  const handleViewDetail = (id: number) => {
    setSelectedBannerId(id);
    setDetailDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    form.resetFields();
    setSelectedBanner(null);
    setSelectedLinkType(undefined);
    setSelectedProduct(undefined);
    setSelectedNews(undefined);
    setSelectedCategory(undefined);
    setSelectedSubCategory(undefined);
    setDirectLink("#");
    setFileList([]);
    setPreviewImage(undefined);
  };

  const handleImageChange = (info: any) => {
    if (info.fileList.length > 0) {
      const latestFile = info.fileList.slice(-1);
      setFileList(latestFile);

      const file = latestFile[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFileList([]);
      setPreviewImage(selectedBanner?.url_image);
    }
  };

  const handleLinkTypeChange = (value: string) => {
    setSelectedLinkType(value);
    setSelectedProduct(undefined);
    setSelectedNews(undefined);
    setSelectedCategory(undefined);
    setSelectedSubCategory(undefined);
    setDirectLink("#");
  };

  const handleProductChange = (slug: string) => {
    setSelectedProduct(slug);
    setDirectLink(`/san-pham/${slug}`);
  };

  const handleNewsChange = (slug: string) => {
    setSelectedNews(slug);
    setDirectLink(`/tin-tuc/${slug}`);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubCategory(undefined);

    const category = categories.find((c) => c.id === id);
    const slug = category ? slugify(category.name) : "";
    setDirectLink(`/danh-muc/${slug}`);
  };

  const handleSubCategoryChange = (id: string) => {
    setSelectedSubCategory(id);
    const category = categories.find((c) => c.id === selectedCategory);
    const subCategory = category?.items.find((item) => item.id === id);
    const catSlug = category ? slugify(category.name) : "";
    const subCatSlug = subCategory ? slugify(subCategory.name) : "";
    setDirectLink(`/danh-muc/${catSlug}/${subCatSlug}`);
  };

  const onFinish = (values: any) => {
    if (!selectedBanner) {
      message.error("Không tìm thấy banner để cập nhật");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    // formData.append("_method", 'PUT');
    formData.append("direct_link", directLink === "#" ? "#" : directLink);
 const vnTime = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
  formData.append("updated_at", vnTime); // 
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      formData.append("image", file);
    }

    updateBanner(
      {
        resource: "admin/banners",
        id: selectedBanner.id,
        values: formData,
        meta: {
          isFormData: true,
        },
      },
      {
        onSuccess: () => {
          message.success("Cập nhật banner thành công");
          handleClose();
        },
        onError: () => {
          message.error("Cập nhật banner thất bại");
        },
      }
    );
  };

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const subCategories = categories.find((cat) => cat.id === selectedCategory)?.items ?? [];

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Đã xảy ra lỗi khi tải dữ liệu.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Danh sách banner</h2>
      <div className="grid grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative rounded overflow-hidden shadow-md group hover:shadow-xl transition duration-300"
          >
            <div className="overflow-hidden relative">
              <img
                src={banner.url_image}
                alt={banner.title}
                className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                onClick={() => handleEdit(banner)}
              />
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm px-4 py-2 rounded opacity-0 group-hover:opacity-100 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                onClick={() => handleEdit(banner)}
              >
                Chỉnh sửa
              </button>
            </div>
            <div
              className="bg-blue-950 text-white text-center py-2 text-sm font-medium cursor-pointer"
              onClick={() => handleViewDetail(banner.id)}
            >
              {banner.title}
            </div>
          </div>
        ))}
      </div>

      <Drawer
        title="Chỉnh sửa banner"
        placement="right"
        width={500}
        onClose={handleClose}
        open={drawerOpen}
        footer={
          <div className="text-right">
            <Button onClick={handleClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button
              type="primary"
              loading={updating}
              onClick={() => form.submit()}
            >
              Lưu
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Kiểu liên kết" name="direct_link"  {...form.getFieldValue('title')} rules={[{ required: true }]}>
            <Select onChange={handleLinkTypeChange} placeholder="Chọn kiểu liên kết">
              <Option value="#">Không liên kết</Option>
              <Option value="/products">Sản phẩm</Option>
              <Option value="/news">Tin tức</Option>
              <Option value="/category">Danh mục</Option>
            </Select>
          </Form.Item>

          {selectedLinkType === "/products" && (
            <Form.Item label="Sản phẩm" name="product" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Chọn sản phẩm"
                onChange={handleProductChange}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {products.map((p) => (
                  <Option key={p.id} value={p.slug}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {selectedLinkType === "/news" && (
            <Form.Item label="Tin tức" name="news" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Chọn tin tức"
                onChange={handleNewsChange}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {news.map((n) => (
                  <Option key={n.id} value={n.slug}>
                    {n.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {selectedLinkType === "/category" && (
            <>
              <Form.Item label="Danh mục cha" name="category" rules={[{ required: true }]}>
                <Select
                  placeholder="Chọn danh mục cha"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  {parentCategories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {subCategories.length > 0 && (
                <Form.Item label="Danh mục con" name="sub_category">
                  <Select
                    placeholder="Chọn danh mục con"
                    onChange={handleSubCategoryChange}
                    value={selectedSubCategory}
                    allowClear
                  >
                    {subCategories.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </>
          )}

         \<Form.Item label="Ảnh banner">
  <Upload
    listType="picture"
    maxCount={1}
    beforeUpload={() => false}
    onChange={handleImageChange}
    fileList={fileList}
    accept="image/*"
    showUploadList={false} // Tắt mặc định hiển thị danh sách upload
  >
    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
  </Upload>

  {previewImage && (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 200,
        marginTop: 12,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Image
        src={previewImage}
        alt="Preview"
        width="100%"
        height="100%"
        style={{ objectFit: "cover" }}
        preview={{
          mask: (
            <Button icon={<EyeOutlined />} type="primary" ghost>
              Preview
            </Button>
          ),
        }}
      />
      <Button
        danger
        shape="circle"
        size="small"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          background: "rgba(255,255,255,0.9)",
        }}
        onClick={() => {
          setFileList([]);
          setPreviewImage(undefined);
        }}
      >
        X
      </Button>
    </div>
  )}
</Form.Item>
        </Form>
      </Drawer>

      <BannerDetailDrawer
        bannerId={selectedBannerId}
        visible={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      />
    </div>
  );
}
