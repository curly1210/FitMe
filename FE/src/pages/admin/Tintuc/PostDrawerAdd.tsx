import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Switch,
  Button,
  Upload,
  Image,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { Editor } from "@ckeditor/ckeditor5-core";
import { useCreate } from "@refinedev/core";

interface PostDrawerAddProps {
  open: boolean;
  onClose: () => void;
}

const PostDrawerAdd: React.FC<PostDrawerAddProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const { mutate: createPost, isLoading } = useCreate();

  // Xử lý khi chọn ảnh
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
    if (!thumbnailFile) {
      message.error("Vui lòng chọn ảnh thumbnail!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("is_active", values.is_active ? "1" : "0");
    formData.append("thumbnail", thumbnailFile);

    createPost(
      {
        resource: "admin/posts",
        values: formData,
        meta: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      },
      {
        onSuccess: () => {
          message.success("Thêm bài viết thành công!");
          form.resetFields();
          setThumbnailFile(null);
          setPreviewImage("");
          onClose();
        },
        onError: () => {
          message.error("Thêm bài viết thất bại!");
        },
      }
    );
  };

  return (
    <Drawer
      title="Thêm bài viết mới"
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
          <CKEditor<Editor>
            editor={ClassicEditor}
            data=""
            onChange={(_, editor) => {
              const content = editor.getData();
              form.setFieldsValue({ content });
            }}
          />
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

export default PostDrawerAdd;
