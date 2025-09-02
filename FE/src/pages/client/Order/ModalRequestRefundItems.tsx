/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
import { useCreate, useList } from "@refinedev/core";
import {
  Button,
  Form,
  InputNumber,
  notification,
  Radio,
  RadioChangeEvent,
  Skeleton,
  Upload,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from "antd/lib";
import { useState } from "react";
import ImageWithFallback from "../../../components/ImageFallBack";
import { useModal } from "../../../hooks/useModal";

// const typeRefundOptions: CheckboxGroupProps<string>["options"] = [
//   "all",
//   "partial",
// ];

const typeRefundOptions: CheckboxGroupProps<string>["options"] = [
  { label: "Hoàn tất cả", value: "full", className: "label-1" },
  { label: "Hoàn một phần", value: "partial", className: "label-2" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const ModalRequestRefundItems = ({ idOrder, refetch }: any) => {
  const [typeRefund, setTypeRefund] = useState("full");
  const { closeModal } = useModal();

  const { data: responseOrderItems, isFetching: isFechingItems } = useList({
    resource: `order/order-details/${idOrder}`,
    queryOptions: { enabled: !!idOrder },
  });

  const { mutate: mutateCreateRequestRefund, isPending } = useCreate({
    resource: `order/${idOrder}/return-request/create`,
  });

  // console.log(responseOrderItems?.data);

  const onChangeRadioButton = ({ target: { value } }: RadioChangeEvent) => {
    // console.log("radio1 checked", value);
    setTypeRefund(value);
  };

  const items = responseOrderItems?.data || [];

  const onFinish = (values: any) => {
    const selectedItems =
      values?.items?.filter((i: any) => i.checked && i.quantity > 0) || [];

    console.log(values);

    const formData = new FormData();

    formData.append("reason", values?.reasonRefund);
    formData.append("type", typeRefund);
    values?.images.forEach((image: any, index: any) => {
      formData.append(`media_files[]`, image.originFileObj);
    });

    if (typeRefund === "partial") {
      selectedItems.forEach((item: any, index: any) => {
        formData.append(`items[${index}][id]`, item?.id);
        formData.append(`items[${index}][quantity]`, item?.quantity);
        formData.append(`items[${index}][price]`, item?.price);
      });
    }

    mutateCreateRequestRefund(
      {
        values: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onError: () => {
          notification.error({
            message: "Có lỗi xảy ra",
          });
        },
        onSuccess: () => {
          notification.success({
            message: "Gửi yêu cầu thành công",
          });
          refetch();
          closeModal();

          // openModal(<ReviewProducts orderId={review?.order_id} />);
        },
      }
    );
  };

  return (
    <div className="w-[700px] py-5 px-6">
      <h1 className="text-2xl font-semibold mb-5">Yêu cầu hoàn hàng</h1>

      <Radio.Group
        className="!mb-5"
        options={typeRefundOptions}
        onChange={onChangeRadioButton}
        value={typeRefund}
      />

      {isFechingItems ? (
        <Skeleton active />
      ) : (
        <Form onFinish={onFinish} layout="vertical">
          {typeRefund === "partial" && (
            <>
              <div className="border p-4 rounded-md my-4 space-y-3">
                {items.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-3"
                  >
                    {/* Checkbox */}
                    <Form.Item
                      name={["items", index, "checked"]}
                      valuePropName="checked"
                      initialValue={false}
                      noStyle
                    >
                      <Checkbox />
                    </Form.Item>

                    <div className="flex-1">
                      <div className="flex items-stretch">
                        <ImageWithFallback
                          src={item?.image_product}
                          width={60}
                          height={60}
                        />
                        <div className="flex flex-col gap-2">
                          <p className="font-medium">
                            {item.name_product}
                            <span className="font-medium ">
                              - {item?.color}/{item?.size}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng đã mua: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Số lượng hoàn */}
                    <Form.Item
                      name={["items", index, "quantity"]}
                      initialValue={1}
                    >
                      <InputNumber min={1} max={item.quantity} />
                    </Form.Item>

                    {/* ID */}
                    <Form.Item
                      name={["items", index, "id"]}
                      initialValue={item.id}
                      hidden
                    >
                      <input type="hidden" />
                    </Form.Item>

                    <Form.Item
                      name={["items", index, "price"]}
                      initialValue={item.sale_price}
                      hidden
                    >
                      <input type="hidden" />
                    </Form.Item>
                  </div>
                ))}
              </div>

              {/* ✅ Validator: ít nhất 1 checkbox */}

              <Form.Item noStyle shouldUpdate>
                {({ getFieldError, getFieldValue }) => {
                  const list = getFieldValue("items");
                  const safeList = Array.isArray(list) ? list : [];
                  const hasChecked = safeList.some((i) => i?.checked);

                  // force validation
                  if (!hasChecked) {
                    // set lỗi giả vào field __atLeastOneItem
                    return (
                      <Form.Item
                        noStyle
                        name="__atLeastOneItem"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ít nhất 1 sản phẩm",
                          },
                        ]}
                      >
                        <Form.ErrorList
                          className="text-red-400"
                          errors={["Vui lòng chọn ít nhất 1 sản phẩm"]}
                        />
                      </Form.Item>
                    );
                  }

                  return null; // không render gì, không chiếm height
                }}
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Lý do hoàn hàng:"
            name="reasonRefund"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <TextArea
              // value={failReason}
              // onChange={(e) => setFailReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do hoàn hàng..."
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh minh chứng:"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[
              { required: true, message: "Vui lòng tải lên ít nhất 1 ảnh" },
            ]}
          >
            <Upload
              maxCount={5}
              multiple
              listType="picture-card"
              beforeUpload={() => false} // không upload ngay, giữ file trong state
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Button
            loading={isPending}
            type="primary"
            htmlType="submit"
            className="!py-5 !px-7 !mt-5 "
          >
            Gửi
          </Button>
        </Form>
      )}
    </div>
  );
};
export default ModalRequestRefundItems;
