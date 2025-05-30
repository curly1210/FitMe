/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  notification,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { useCreate, useUpdate } from "@refinedev/core";

interface ModalAddressProps {
  refetch: () => void;
  mode: "create" | "edit";
  record?: any;
}

const ModalAddress = ({ refetch, mode, record }: ModalAddressProps) => {
  const [isLoading, setIsLoading] = useState(true); // loading data dữ liệu các tỉnh thành
  const [data, setData] = useState<any>([]);
  const { closeModal } = useModal();
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json`
      );
      // console.log(data);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [form] = Form.useForm();

  const handleProvinceChange = (provinceName: string) => {
    // console.log(provinceId);
    const province = data.find((p: any) => p.Name === provinceName);
    setSelectedProvince(province?.Name);
    setDistricts(province?.Districts || []);

    if (mode === "create" || userInteracted) {
      form.setFieldsValue({ district: null });
      setSelectedDistrict(null);
      setSelectedWard(null);
    }

    setUserInteracted(true);

    // console.log("province", province);
  };

  const handleDistrictChange = (districtName: string) => {
    const district = districts.find((d) => d.Name === districtName);
    setSelectedDistrict(district?.Name);
    setWards(district?.Wards || []);
    if (mode === "create" || userInteracted) {
      form.setFieldsValue({ ward: null });
      setSelectedWard(null);
    }

    // console.log(userInteracted);

    setUserInteracted(true);
  };

  const handleWardChange = (wardName: string) => {
    const ward = wards.find((w) => w.Name === wardName);
    setSelectedWard(ward.Name);
  };

  useEffect(() => {
    setUserInteracted(false);
  }, [mode, record]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (mode === "edit" && record && data.length > 0) {
      form.setFieldsValue(record);
      handleProvinceChange(record.city);
      // setTimeout(() => {
      handleDistrictChange(record.district);
      setSelectedWard(record.ward);
      // }, 3000);
    }
  }, [mode, record, data]);

  const { mutate: createMutate, isLoading: isLoadingCreateAddress } = useCreate(
    {
      resource: "addresses",
      mutationOptions: {
        onSuccess: (response) => {
          refetch();
          // console.log(response);
          notification.success({ message: response?.data?.message });
          closeModal();
        },
        onError: (err) => {
          console.log(err);
        },
      },
    }
  );

  const { mutate: updateMutate, isLoading: isLoadingUpdateAddress } = useUpdate(
    {
      resource: "addresses",
      mutationOptions: {
        onSuccess: (response) => {
          refetch();
          // console.log(response);
          notification.success({ message: response?.data?.message });
          closeModal();
        },
        onError: (err) => {
          console.log(err);
        },
      },
    }
  );

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      country: "thanh hoa",
    };

    if (mode === "edit" && record) {
      updateMutate({ id: record?.id, values: payload });
    } else {
      createMutate({ values: payload });
    }
    // console.log({ ...value, country: "thanh hoa" });
  };

  // if (isLoading) return null;

  return (
    <div className="w-[500px] bg-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="font-bold text-xl">
          {mode === "edit" ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
        </div>
        <CloseOutlined
          onClick={() => closeModal()}
          className="text-xl cursor-pointer"
        />
      </div>
      <Form
        form={form}
        initialValues={{ is_default: false }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          className="!mb-[10px]"
          required={false}
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
          name="name_receive"
        >
          <Input className="!h-[48px] !rounded-none " placeholder="Họ và tên" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-x-2">
          <Form.Item
            required={false}
            name="email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập email!" },
            ]}
            className="!mb-[10px]"
          >
            <Input className="!h-[48px] !rounded-none " placeholder="Email" />
          </Form.Item>
          <Form.Item
            required={false}
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message: "Nhập đúng định dạng số điện thoại",
              },
            ]}
            className="!mb-[10px]"
          >
            <Input
              className="!h-[48px] !rounded-none "
              placeholder="Số điện thoại"
            />
          </Form.Item>
        </div>
        <Form.Item
          required={false}
          rules={[{ required: true, message: "Vui lòng chọn tỉnh" }]}
          className="!mb-[10px]"
          name="city"
        >
          <Select
            className="!h-full"
            placeholder="Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            options={data?.map((p: any) => ({ label: p.Name, value: p.Name }))}
            value={selectedProvince}
          />
        </Form.Item>
        <Form.Item
          required={false}
          rules={[{ required: true, message: "Vui lòng chọn quận" }]}
          className="!mb-[10px]"
          name="district"
        >
          <Select
            className="!h-full"
            placeholder="Quận/huyện"
            onChange={handleDistrictChange}
            options={districts?.map((d) => ({ label: d.Name, value: d.Name }))}
            value={selectedDistrict}
          />
        </Form.Item>
        <Form.Item
          required={false}
          rules={[{ required: true, message: "Vui lòng chọn huyện" }]}
          className="!mb-[10px]"
          name="ward"
        >
          <Select
            className="!h-full"
            placeholder="Phường/xã"
            onChange={handleWardChange}
            options={wards?.map((w) => ({ label: w.Name, value: w.Name }))}
            value={selectedWard}
          />
        </Form.Item>
        <Form.Item
          className="!mb-[10px]"
          required={false}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập chi tiết!",
            },
            {
              min: 6,
              message: "Chi tiết có ít nhất 6 ký tự!",
            },
          ]}
          name="detail_address"
        >
          <Input
            className="!h-[48px] !rounded-none "
            placeholder="Tòa nhà, số nhà, tên đường"
            // prefix={<UserOutlined className="text-gray-400 mr-2" />}
          />
        </Form.Item>
        <div className="flex gap-2 items-center mb-[10px]">
          <Form.Item
            name="is_default"
            valuePropName="checked"
            className="!mb-0"
          >
            <Checkbox className="!rounded-none" />
          </Form.Item>
          <p>Đặt làm địa chỉ mặc định</p>
        </div>
        <div className="flex justify-end">
          <Button
            className="!rounded-none !bg-black !text-white !py-4 !w-[140px] !h-[45px] !font-bold"
            htmlType="submit"
          >
            {mode === "create" ? "Lưu" : "Cập nhật"}
          </Button>
        </div>
      </Form>
      {isLoading || isLoadingCreateAddress || isLoadingUpdateAddress ? (
        <Spin
          className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center "
          style={{ textAlign: "center" }}
          size="large"
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default ModalAddress;
