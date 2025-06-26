/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhoneOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useCreate, useList } from "@refinedev/core";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Image,
  Input,
  notification,
  Radio,
  Upload,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";
dayjs.locale("vi");

const InformationUser = () => {
  const [previewImage, setPreviewImage] = useState("");

  const { data: responseProfile } = useList({ resource: "profile" });
  // const { user } = useAuthen();

  const { mutate: updateInfor, isLoading } = useCreate();

  const profile = responseProfile?.data || [];

  // console.log(profile);

  const [form] = Form.useForm();

  const handleBeforeUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    return false;
  };

  useEffect(() => {
    if (responseProfile) {
      const userProfile = Array.isArray(profile) ? profile[0] : profile;
      const birthday = userProfile?.birthday
        ? dayjs(userProfile?.birthday, "YYYY-MM-DD")
        : null;

      if (userProfile?.avatar) {
        setPreviewImage(userProfile.avatar);
      }

      form.setFieldsValue({
        ...userProfile,
        birthday, // chuyển sang dayjs
      });
      console.log(userProfile);
    }
  }, [responseProfile]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const optionsWithDisabled: CheckboxGroupProps<any>["options"] = [
    { label: "Nam", value: "Nam", className: "label-1" },
    { label: "Nữ", value: "Nữ", className: "label-2" },
  ];

  const onFinish = (values: any) => {
    console.log(values);

    const formData = new FormData();

    formData.append("avatar", values?.avatar);

    // 👇 xử lý birthday đúng cách
    if (values.birthday) {
      formData.append("birthday", values.birthday.format("YYYY-MM-DD"));
    }

    if (values.gender) {
      formData.append("gender", values.gender);
    }

    // formData.append("gender", values?.gender);
    formData.append("name", values?.name);
    formData.append("phone", values?.phone);

    updateInfor(
      {
        resource: "profile",
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: (response) => {
          notification.success({ message: response?.data?.message });
        },
        onError: (error) => {
          const axiosError = error?.response || error;

          const errors = axiosError?.data?.errors;

          if (errors && typeof errors === "object") {
            const firstKey = Object.keys(errors)[0];
            const firstError = errors[firstKey]?.[0];

            notification.error({
              message: firstError || "Dữ liệu không hợp lệ.",
            });
          } else {
            notification.error({
              message: "Lỗi",
              description: axiosError?.data?.message || "Có lỗi xảy ra.",
            });
          }
        },
      }
    );
  };

  return (
    <div>
      <h1 className="font-semibold mb-8 text-3xl">Tài khoản</h1>

      <ConfigProvider locale={viVN}>
        <Form
          onFinish={onFinish}
          form={form}
          {...formItemLayout}
          layout="horizontal"
        >
          <div className="grid grid-cols-12">
            <div className="col-span-8 border-r border-gray-300">
              <Form.Item
                label={<span>Họ và tên</span>}
                // required={false}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên!",
                  },
                  {
                    min: 3,
                    message: "Tên phải có ít nhất 3 ký tự!",
                  },
                ]}
                name="name"
              >
                <Input
                  placeholder="Nhập họ tên"
                  prefix={<UserOutlined className="text-gray-400 mr-2" />}
                />
              </Form.Item>
              <Form.Item
                label={<span>Số điện thoại</span>}
                // required={false}
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message: "Nhập đúng định dạng số điện thoại",
                  },
                ]}
                className="!mb-5"
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                />
              </Form.Item>
              <Form.Item
                label={<span>Giới tính</span>}
                // required={false}
                name="gender"
                className="!mb-5"
              >
                <Radio.Group
                  options={optionsWithDisabled}
                  // onChange={onChange2}
                  // value={value2}
                />
              </Form.Item>
              <Form.Item
                label={<span>Ngày sinh</span>}
                name="birthday"
                className="!mb-5"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve(); // allow empty (nullable)
                      if (value.isBefore(dayjs(), "day")) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Ngày sinh phải trước hôm nay");
                    },
                  },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Ngày sinh"
                  className="!w-full"
                  allowClear
                />
              </Form.Item>
            </div>
            <div className="col-span-4 flex flex-col justify-center items-center gap-2">
              {previewImage ? (
                <Image
                  className="border border-gray-300 !rounded-full object-cover"
                  src={previewImage}
                  alt="Ảnh preview"
                  style={{ height: 150, width: 150, borderRadius: "50%" }}
                  preview
                />
              ) : (
                <div
                  className="flex items-center justify-center border border-gray-300 rounded-full text-gray-400"
                  style={{ height: 150, width: 150 }}
                >
                  Ảnh avatar
                </div>
              )}

              <Form.Item
                name="avatar"
                valuePropName="file" // optional, dùng để form hiểu field này là file
                getValueFromEvent={(e) => {
                  const file = e?.fileList?.[0]?.originFileObj || null;
                  return file;
                }}
              >
                <Upload
                  beforeUpload={handleBeforeUpload}
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn avatar</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          <Button
            loading={isLoading}
            className=" !bg-black !text-base !py-5 !rounded-none"
            type="primary"
            htmlType="submit"
          >
            Cập nhật
          </Button>
        </Form>
      </ConfigProvider>
    </div>
  );
};
export default InformationUser;
