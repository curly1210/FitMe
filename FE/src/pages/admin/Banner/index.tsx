import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Image,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreate, useList, useUpdate } from "@refinedev/core";
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
  direct_value: string;
  sub_direct_value: string;
  updated_at: string;
  url_image: string;
  content?: string;
};

type Product = { id: number; name: string; slug: string };
type News = { id: number; name: string; slug: string };
type CategoryItem = { id: string; name: string; image: string };
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
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  const [previewImage, setPreviewImage] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [selectedLinkType, setSelectedLinkType] = useState<string>();
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const [selectedNews, setSelectedNews] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [directLink, setDirectLink] = useState<string>("#");

  const [categories, setCategories] = useState<Category[]>([]);
  const [updatingBannerLoading, setUpdatingBannerLoading] = useState(false);
  const {
    data: bannersData,
    isLoading,
    refetch,
  } = useList<Banner>({
    resource: "admin/banners",
  });
  const banners = bannersData?.data ?? [];

  const { data: productsData } = useList<Product>({
    resource: "admin/banners/products",
  });
  const products = productsData?.data ?? [];

  const { data: newsData } = useList<News>({
    resource: "admin/banners/posts",
  });
  const news = newsData?.data ?? [];

  const { data: categoriesData } = useList<Category>({
    resource: "admin/categories",
  });

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.data);
  }, [categoriesData]);

  // const { mutate: updateBanner, isLoading: updating } = useUpdate();
  const { mutate: updateBanner, isLoading: updating } = useCreate();

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setDrawerOpen(true);
    setPreviewImage(banner.url_image);
    setBannerImage(null); // reset ảnh

    const rawLink = banner.direct_link || "";
    let linkType = "#";
    let productSlug, newsSlug, categoryId, subCategoryId;

    if (rawLink.startsWith("/products/")) {
      linkType = "/products";
      productSlug = rawLink.replace("/products/", "");
      setSelectedProduct(productSlug);
    } else if (rawLink.startsWith("/post/")) {
      linkType = "/news";
      newsSlug = rawLink.replace("/post/", "");
      setSelectedNews(newsSlug);
    } else if (rawLink.startsWith("/category/")) {
      linkType = "/category";
      const parts = rawLink.replace("/category/", "").split("/");
      const catSlug = banner.direct_value;
      const subCatSlug = parts[1] ?? "";

      const category = categories.find((c) => slugify(c.name) === catSlug);
      categoryId = category?.id;
      const subCategory = category?.items.find(
        (item) => slugify(item.name) === subCatSlug
      );
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
    setBannerImage(null);
    setPreviewImage("");
  };

  const handleBeforeUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setBannerImage(file);
    message.success("Ảnh banner đã được chọn.");
    return false;
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
    setDirectLink(`/products/${slug}`);
  };

  const handleNewsChange = (slug: string) => {
    setSelectedNews(slug);
    setDirectLink(`/post/${slug}`);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubCategory(undefined);
    const category = categories.find((c) => c.id === id);
    const slug = category ? slugify(category.name) : "";
    setDirectLink(`/category/${slug}`);
  };

  const handleSubCategoryChange = (id: string) => {
    setSelectedSubCategory(id);
    const category = categories.find((c) => c.id === selectedCategory);
    const subCategory = category?.items.find((item) => item.id === id);
    const catSlug = category ? slugify(category.name) : "";
    const subCatSlug = subCategory ? slugify(subCategory.name) : "";
    setDirectLink(`/category/${catSlug}/${subCatSlug}`);
  };

  const onFinish = (values: any) => {
    if (!selectedBanner) {
      message.error("Không tìm thấy banner để cập nhật");
      return;
    }

    const formData = new FormData();
    const [_, type, value, sub] = directLink.split("/") || [];

    formData.append("title", values.title);
    formData.append("direct_type", type || "#");
    formData.append("direct_value", value || "");
    formData.append("sub_direct_value", sub ?? "");
    formData.append("direct_link", directLink);
    formData.append("_method", "PATCH");
    formData.append(
      "updated_at",
      dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss")
    );

    if (bannerImage) {
      formData.append("url_image", bannerImage);
    }

    setUpdatingBannerLoading(true);

    updateBanner(
      {
        resource: `admin/banners/${selectedBanner.id}`,
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          refetch();
          message.success("Cập nhật banner thành công");
          handleClose();
          setUpdatingBannerLoading(false);
        },
        onError: () => {
          message.error("Cập nhật banner thất bại");
          setUpdatingBannerLoading(false);
        },
      }
    );
  };

  const parentCategories = categories.filter((c) => c.parent_id === null);
  const subCategories =
    categories.find((cat) => cat.id === selectedCategory)?.items ?? [];

  return (
    <Spin spinning={updatingBannerLoading} tip="Đang cập nhật..." size="large">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-5">Danh sách banner</h2>
        <div className="grid grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded overflow-hidden shadow-md group hover:shadow-xl transition duration-300"
            >
              <img
                src={banner.url_image}
                alt={banner.title}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => handleEdit(banner)}
              />
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
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Kiểu liên kết"
              name="direct_link"
              rules={[{ required: true }]}
            >
              <Select onChange={handleLinkTypeChange}>
                <Option value="#">Không liên kết</Option>
                <Option value="/products">Sản phẩm</Option>
                <Option value="/news">Tin tức</Option>
                <Option value="/category">Danh mục</Option>
              </Select>
            </Form.Item>

            {selectedLinkType === "/products" && (
              <Form.Item
                label="Sản phẩm"
                name="product"
                rules={[{ required: true }]}
              >
                <Select onChange={handleProductChange}>
                  {products.map((p) => (
                    <Option key={p.id} value={p.slug}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {selectedLinkType === "/news" && (
              <Form.Item
                label="Tin tức"
                name="news"
                rules={[{ required: true }]}
              >
                <Select onChange={handleNewsChange}>
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
                <Form.Item
                  label="Danh mục cha"
                  name="category"
                  rules={[{ required: true }]}
                >
                  <Select onChange={handleCategoryChange}>
                    {parentCategories.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {subCategories.length > 0 && (
                  <Form.Item label="Danh mục con" name="sub_category">
                    <Select onChange={handleSubCategoryChange} allowClear>
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

            <label className="block font-medium mb-1">Ảnh banner</label>
            <Upload
              beforeUpload={handleBeforeUpload}
              listType="picture"
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh banner</Button>
            </Upload>
            {previewImage && (
              <div className="mt-4 mb-2">
                <Image
                  src={previewImage}
                  alt="Ảnh preview"
                  style={{ maxHeight: 150, borderRadius: 6 }}
                  preview
                />
              </div>
            )}
          </Form>
        </Drawer>

        <BannerDetailDrawer
          bannerId={selectedBannerId}
          visible={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
        />
      </div>
    </Spin>
  );
}
