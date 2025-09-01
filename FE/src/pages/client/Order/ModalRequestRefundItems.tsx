import { PlusOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import {
  Button,
  Form,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Upload,
} from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from "antd/lib";
import { useState } from "react";

// const typeRefundOptions: CheckboxGroupProps<string>["options"] = [
//   "all",
//   "partial",
// ];

const typeRefundOptions: CheckboxGroupProps<string>["options"] = [
  { label: "Hoàn tất cả", value: "all", className: "label-1" },
  { label: "Hoàn một phần", value: "partial", className: "label-2" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const ModalRequestRefundItems = ({ idOrder }: any) => {
  const [typeRefund, setTypeRefund] = useState("all");

  const { data: responseOrderItems, isFetching: isFechingItems } = useList({
    resource: `order/order-details/${idOrder}`,
    queryOptions: { enabled: !!idOrder },
  });

  console.log(responseOrderItems?.data);

  const onChangeRadioButton = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio1 checked", value);
    setTypeRefund(value);
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const items = responseOrderItems?.data || [];

  return (
    <div className="w-[700px] py-5 px-6">
      <h1 className="text-2xl font-semibold mb-5">Yêu cầu hoàn hàng</h1>

      <Radio.Group
        options={typeRefundOptions}
        onChange={onChangeRadioButton}
        value={typeRefund}
      />

      <Form onFinish={onFinish} layout="vertical">
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

        {typeRefund === "partial" && (
          <Form.List name="items">
            {(fields) => (
              <div className="border p-4 rounded-md my-4 space-y-3">
                {items.map((item: any, index: number) => (
                  <Form.Item key={item.id} noStyle>
                    <div className="flex items-center gap-4 border-b pb-3">
                      {/* Checkbox chọn item */}
                      <Form.Item
                        name={[index, "checked"]}
                        valuePropName="checked"
                        initialValue={false}
                        noStyle
                        rules={[
                          {
                            validator: (_, value) => {
                              if (typeRefund === "partial" && !value) {
                                return Promise.reject();
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Checkbox />
                      </Form.Item>

                      {/* Tên sản phẩm */}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          Số lượng đã mua: {item.quantity}
                        </p>
                      </div>

                      {/* Input số lượng hoàn */}
                      <Form.Item
                        name={[index, "quantity"]}
                        initialValue={1}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value < 1 || value > item.quantity) {
                                return Promise.reject(
                                  `Số lượng phải từ 1 đến ${item.quantity}`
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber min={1} max={item.quantity} />
                      </Form.Item>

                      {/* Truyền id sản phẩm */}
                      <Form.Item
                        name={[index, "id"]}
                        initialValue={item.id}
                        hidden
                      >
                        <input type="hidden" />
                      </Form.Item>
                    </div>
                  </Form.Item>
                ))}
              </div>
            )}
          </Form.List>
        )}

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
          // loading={isloadingAddInforAccount}
          type="primary"
          htmlType="submit"
          className="!py-5 !px-7 !mt-5 "
        >
          Gửi
        </Button>
      </Form>
    </div>
  );
};
export default ModalRequestRefundItems;
