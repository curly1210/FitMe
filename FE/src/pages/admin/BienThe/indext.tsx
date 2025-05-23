import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Dropdown, Button, Menu, Drawer, Space } from "antd";
import { useState } from "react";

const Bienthe = () => {
  const colors = [
    { name: 'Màu đen', color: 'bg-black' },
    { name: 'Màu xanh', color: 'bg-blue-700' },
    { name: 'Màu đỏ', color: 'bg-red-600' },
    { name: 'Màu trắng', color: 'bg-white border border-gray-300' },
    { name: 'Màu xám', color: 'bg-gray-400' },
    { name: 'Màu vàng', color: 'bg-yellow-400' },
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const actionMenu = (
    <Menu
      items={[
        { key: '1', label: 'Sửa' },
        { key: '2', label: 'Xoá' },
      ]}
    />
  );
  //đây là hàm sử lý khi click nút thêm sẽ mở ra sile bên tay trái
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return <div>
    <h1 className="text-2xl font-bold">Quản lý biến thể</h1><div className="flex gap-4 p-4 items-start">

      

      {/* From nút thêm */}
      <Drawer
           title="Thêm màu sắc"
           placement="right"
          onClose={onClose}
          open={open}
          className="custom-class"
          rootClassName="root-class-name"
          styles={{ body: { paddingBottom: 80 } }}
          //nút thao tác
        footer={
          <div className="text-right">
            <Space >
              <Button onClick={onClose}>Cancel</Button>
              <Button  block icon={<PlusOutlined />} className="text-white" style={{ backgroundColor: '#22689B', color: '#fff' }} >Thêm mới sản phẩm</Button>
            </Space>
          </div>
        }
      >
        {/* Nội dung trong Ô thêm*/}
        <p>Form thêm màu sắc hoặc nội dung khác...</p>
        <p>Ví dụ: ô nhập, chọn màu, v.v.</p>
      </Drawer>   


      {/* Card Màu sắc */}
      <Card
        title={<span className="font-semibold text-base">Màu sắc</span>}
        className="w-64 rounded-2xl border border-gray-200 !bg-gray-200"
        bodyStyle={{ padding: 12 }}
        extra={
          <Dropdown overlay={actionMenu} trigger={['click']}>
            <MoreOutlined className="text-gray-500" />
          </Dropdown>
        }
      >
        <div className="flex flex-col gap-2">
          {colors.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${item.color}`} />
                <span className="font-medium">{item.name}</span>
              </div>
              <Dropdown overlay={actionMenu} trigger={['click']}>
                <MoreOutlined className="text-gray-500 cursor-pointer" />
              </Dropdown>
            </div>
          ))}

          <Button
            icon={<PlusOutlined />}
            onClick={showDrawer}
           className="justify-start rounded-xl mt-2 " style={{ color: '#22689B',textAlign: 'left' }}
           
          >
            Thêm
          </Button>
        </div>
      </Card>

      {/* Card Kích thước */}
      <Card
        title={<span className="font-semibold text-base">Kích thước</span>}
        className="w-64 rounded-2xl border border-gray-200 !bg-gray-200"
        bodyStyle={{ padding: 12 }}
        extra={
          <Dropdown overlay={actionMenu} trigger={['click']}>
            <MoreOutlined className="text-gray-500" />
          </Dropdown>
        }
      >
        <div className="flex flex-col gap-2">
          {sizes.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <span className="font-medium">{size}</span>
              <Dropdown overlay={actionMenu} trigger={['click']}>
                <MoreOutlined className="text-gray-500 cursor-pointer" />
              </Dropdown>
            </div>
          ))}

          <Button
            icon={<PlusOutlined />}
            onClick={showDrawer}
           className="justify-start rounded-xl mt-2 " style={{ color: '#22689B',textAlign: 'left' }}
          >
            Thêm
          </Button>
        </div>
      </Card>

      {/* Thêm biến thể */}
      <div className="pt-2">
        <Button
          type="default"
          icon={<PlusOutlined />}
           className="justify-start rounded-xl mt-2 " style={{ color: '#22689B',textAlign: 'left' }}
          onClick={showDrawer}
        >
          Thêm biến thể
        </Button>
      </div>
    </div>
    </div>
  ;
};

export default Bienthe;
