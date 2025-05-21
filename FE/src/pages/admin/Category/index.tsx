import React, { useState } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Space,
  Typography,
  Dropdown,
  Menu,
} from 'antd';
import {
  MoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const Category: React.FC = () => {
  const grayBg = '#f5f6f8';
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form] = Form.useForm();

  const openAddDrawer = () => {
    setEditingCategory(null);
    form.resetFields();
    setOpenDrawer(true);
  };

  const handleEdit = () => {
    const category = { name: 'Áo phông' };
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpenDrawer(true);
  };

  const buttonStyle = {
    fontWeight: 500,
    borderRadius: 6,
    border: '1px solid #1e88e5',
    color: '#1e88e5',
    backgroundColor: grayBg,
    fontSize: 14,
    height: 32,
    padding: '0 14px',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const thinScrollbarStyle: React.CSSProperties = {
    scrollbarWidth: 'thin',
    msOverflowStyle: 'none',
  };

  const thinScrollbarCSS = `
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
  `;

  const renderItem = () => {
    const menu = (
      <Menu>
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEdit}>
          Sửa
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />}>
          Xóa
        </Menu.Item>
      </Menu>
    );

    return (
      <Card
        size="small"
        bodyStyle={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          borderRadius: 8,
        }}
        style={{
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        }}
      >
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text strong>Áo phông</Text>
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Space>
      </Card>
    );
  };

  const renderColumn = () => (
    <Card
      style={{
        width: 230,
        height: 500,
        backgroundColor: grayBg,
        borderRadius: 12,
        padding: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      bodyStyle={{
        padding: 0,
        backgroundColor: grayBg,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
      headStyle={{
        backgroundColor: grayBg,
        padding: '10px 12px 4px 12px',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            gap: 8,
          }}
        >
          <span style={{ flex: 1, wordWrap: 'break-word' }}>
            Đồ nam FitMe tuyệt vời dài loằng ngoằng đê dm
          </span>
          <MoreOutlined />
        </div>
      }
    >
      <div
        style={{
          overflowY: 'auto',
          maxHeight: 400,
          paddingRight: 4,
          ...thinScrollbarStyle,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>{renderItem()}</div>
          ))}
        </Space>
      </div>

      <div style={{ marginTop: 12 }}>
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={openAddDrawer}
          style={{
            ...buttonStyle,
            width: '100%',
          }}
        >
          Thêm danh mục con
        </Button>
      </div>
    </Card>
  );

  const renderEmptyColumn = () => (
    <Card
      style={{
        width: 230,
        height: 500,
        backgroundColor: grayBg,
        borderRadius: 12,
        padding: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
      bodyStyle={{ backgroundColor: grayBg, padding: 0 }}
    >
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={openAddDrawer}
        style={{ ...buttonStyle, width: '100%' }}
      >
        Thêm danh mục
      </Button>
    </Card>
  );

  return (
    <>
      <style>{thinScrollbarCSS}</style>

      <div
        style={{
          display: 'flex',
          gap: 20,
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 8,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          ...thinScrollbarStyle,
        }}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>{renderColumn()}</React.Fragment>
        ))}
        {renderEmptyColumn()}
      </div>

      <Drawer
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
        placement="right"
        width={360}
        onClose={() => {
          setOpenDrawer(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        open={openDrawer}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpenDrawer(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary">
              {editingCategory ? 'Lưu thay đổi' : '+ Thêm danh mục'}
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Sản xuất ống thép" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Category;
