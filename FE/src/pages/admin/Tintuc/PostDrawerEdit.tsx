import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Switch,
  Button,
  Upload,
  Image,
  message,
  Spin,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useCreate } from "@refinedev/core";
import { API_URL } from "../../../utils/constant";

interface PostDrawerAddProps {
  open: boolean;
  onClose: () => void;
  post: any;
}

const PostDrawerEdit: React.FC<PostDrawerAddProps> = ({ open, onClose, post }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadImgCkeditor, setUploadImgCkeditor] = useState<boolean>(false);
  const SafeEditor = ClassicEditor as any;
  const { mutate: createPost, isLoading } = useCreate();

  useEffect(() => {
    form.setFieldsValue({
      title: post?.title,
      content: post?.content,
      is_active: post?.is_active === 1, 
    });
    setPreviewImage(post?.thumbnail || "");
    setThumbnailFile(null);
  }, [post, form]);

  const handleBeforeUpload = (file: File) => {
    setThumbnailFile(file);
    setPreviewImage(URL.createObjectURL(file));
    return false;
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setPreviewImage("");
    message.info("Đã xoá ảnh thumbnail.");
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("is_active", values.is_active ? "1" : "0");

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else if (!previewImage) {
      formData.append("thumbnail_remove", "1"); 
    }

    createPost(
      {
        resource: `admin/posts/${post.id}`,
        values: formData,
        meta: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      },
      {
        onSuccess: () => {
          message.success("Sửa bài viết thành công!");
          form.resetFields();
          setThumbnailFile(null);
          setPreviewImage("");
          onClose();
        },
        onError: () => {
          message.error("Sửa bài viết thất bại!");
        },
      }
    );
  };

  function customUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return {
        upload: async () => {
          const file = await loader.file;
          const data = new FormData();
          data.append("upload", file);
          setUploadImgCkeditor(true);
          return fetch(API_URL + "/admin/posts/ckeditor-upload", {
            method: "POST",
            body: data,
            headers: {
              Accept: "application/json",
            },
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.url) throw new Error("Upload failed");
              return { default: res.url };
            })
            .finally(() => setUploadImgCkeditor(false));
        },
        abort: () => {},
      };
    };
  }

  const config = {
    language: "vi",
    extraPlugins: [customUploadAdapterPlugin],
  };

  return (
    <Drawer
      title="Sửa bài viết"
      open={open}
      onClose={onClose}
      destroyOnClose
      width={650}
      footer={
        <div className="text-right">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Huỷ
          </Button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ is_active: true }}
      >
        <Form.Item
          label="Tiêu đề bài viết"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item label="Ảnh Thumbnail">
          <Upload
            beforeUpload={handleBeforeUpload}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>

          {previewImage && (
            <div className="mt-4 mb-2 relative w-fit">
              <Image
                src={previewImage}
                alt="Ảnh preview"
                style={{ maxHeight: 150, borderRadius: 8 }}
              />
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                danger
                size="small"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                }}
                onClick={removeThumbnail}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Spin tip="Đang tải ảnh" spinning={uploadImgCkeditor}>
            <CKEditor
              editor={SafeEditor}
              data={form.getFieldValue("content")}
              config={config}
              onChange={(_, editor) => {
                const content = editor.getData();
                form.setFieldsValue({ content });
              }}
            />
          </Spin>
        </Form.Item>

        <Form.Item
          label="Trạng thái hiển thị"
          name="is_active"
          valuePropName="checked"
        >
          <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PostDrawerEdit;
