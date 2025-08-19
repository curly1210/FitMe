/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, UploadFile, notification, Image } from "antd";
import { useState, useEffect } from "react";
import { useCreate } from "@refinedev/core";

interface UploadProofFormProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const UploadProofForm: React.FC<UploadProofFormProps> = ({
  open,
  orderId,
  onClose,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // useCreate từ Refine
  const { mutate: createProof } = useCreate();

  useEffect(() => {
    if (open) {
      setFileList([]);
      setPreviewUrls([]);
    }
  }, [open]);
  
  // tạo URl để xem ảnh
  useEffect(() => {
    const urls = fileList.map((file) =>
      file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""
    );
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [fileList]);

  const handleChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList.slice(-2)); // max 2 ảnh
  };

  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleUpload = () => {
    // if (!orderId) {
    //   return notification.error({ message: "Order ID không hợp lệ" });
    // }
    if (fileList.length === 0) {
      return notification.warning({
        message: "Vui lòng chọn ảnh trước khi upload",
      });
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      if (file.originFileObj) formData.append("images[]", file.originFileObj);
    });

    setLoading(true);

    createProof(
      {
        resource: `admin/orders/proof-images/${orderId}`,
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Upload ảnh thành công" });
          setFileList([]);
          onClose();
          onSuccess?.();
        },
        onError: () => {
          notification.error({ message: "Upload ảnh thất bại" });
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <Modal
      title="Upload ảnh giao hàng"
      open={open}
      onCancel={onClose}
      onOk={handleUpload}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {previewUrls.map((url, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <Image src={url} width={100} height={100} />
            <Button
              size="small"
              type="primary"
              danger
              style={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => handleRemove(fileList[idx])}
            >
              X
            </Button>
          </div>
        ))}
      </div>

      <Upload
        multiple
        beforeUpload={() => false}
        onChange={handleChange}
        onRemove={handleRemove}
        fileList={fileList}
        listType="picture"
        showUploadList={false}
      >
        {fileList.length < 2 && (
          <Button icon={<UploadOutlined />}>Chọn ảnh </Button>
        )}
      </Upload>
    </Modal>
  );
};

export default UploadProofForm;
