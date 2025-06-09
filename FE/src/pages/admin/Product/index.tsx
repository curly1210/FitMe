/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import {
  Cascader,
  Input,
  notification,
  Popconfirm,
  Select,
  Skeleton,
  Table,
  Tag,
} from "antd";

import { useMemo, useState } from "react";
import DrawerAdd from "./DrawerAdd";
import { useDelete, useList } from "@refinedev/core";
import { FaEdit, FaTrash } from "react-icons/fa";
import DrawerEdit from "./DrawerEdit";

const { Search } = Input;

const ListProducts = () => {
  const [openDrawerAdd, setOpenDrawerAdd] = useState(false);
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
  const [idProductEdit, setIdProductEdit] = useState(undefined);
  // const [uploadKey, setUploadKey] = useState(Date.now());

  const [searchText, setSearchText] = useState<any>(undefined);
  const [selectCategory, setSelectCategory] = useState<any>(undefined);
  const [selectStatus, setSelectStatus] = useState<any>(undefined);

  const { data: categories } = useList({
    resource: "client/categories",
  });

  const {
    data: productResponse,
    isLoading,
    refetch,
  } = useList({
    resource: "admin/products",
    filters: [
      { field: "search", operator: "eq", value: searchText },
      { field: "category_id", operator: "eq", value: selectCategory },
      { field: "is_active", operator: "eq", value: selectStatus },
    ],
  });

  const { mutate: deleteProduct } = useDelete();

  // useEffect(() => {
  //   console.log(searchText);
  //   refetch();
  // }, [searchText]);

  const products =
    productResponse?.data.map((product) => ({ ...product, key: product.id })) ||
    [];

  const handleDeleteProduct = (id: number) => {
    deleteProduct(
      { resource: "admin/products", id: id },
      {
        onSuccess: (_response) => {
          refetch();
          notification.success({ message: "Xóa sản phẩm thành công" });
        },
        onError: (_err) => {
          notification.error({ message: "Xóa sản phẩm thất bại" });
        },
      }
    );
  };

  const handleSearchText = (value: any) => {
    // console.log(value);
    if (!value) {
      setSearchText(undefined);
    } else {
      setSearchText(value);
    }
  };

  const handleSelectCategory = (value: any) => {
    // console.log(value);
    if (!value) {
      setSelectCategory(undefined);
    } else {
      setSelectCategory(value[value.length - 1]);
    }
  };

  const handleSelectStatus = (value: any) => {
    // console.log(value);
    if (!value) {
      setSelectStatus(undefined);
    } else {
      setSelectStatus(Number(value));
    }
  };

  const options = useMemo(() => {
    if (!categories?.data) return [];

    return categories?.data.map((category: any) => ({
      label: category?.name,
      value: category?.id,
      children: category?.children?.map((child: any) => ({
        label: child?.name,
        value: child?.id,
      })),
    }));
  }, [categories]);

  const showDrawer = () => {
    setOpenDrawerAdd(true);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      key: "name",
      dataIndex: "name",
      render: (_: any, product: any) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[60px] h-[60px]">
              <img
                src={product?.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <p>{product?.name}</p>
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      key: "category_name",
      dataIndex: "category_name",
    },
    {
      title: "Tồn kho",
      key: "total_inventory",
      dataIndex: "total_inventory",
    },
    {
      title: "Trạng thái",
      key: "is_active",
      dataIndex: "is_active",
      render: (status: boolean, _product: any) => {
        return !status ? (
          <Tag color="red">Đang ẩn</Tag>
        ) : (
          <Tag color="green">Đang hiển thị</Tag>
        );
      },
    },
    {
      title: "Hành động",
      render: (_: any, product: any) => {
        return (
          <div className="flex items-center gap-5">
            <FaEdit
              onClick={() => {
                setOpenDrawerEdit(true);
                setIdProductEdit(product?.id);
              }}
              className="text-2xl text-blue-400 cursor-pointer"
            />
            <Popconfirm
              okText="Đồng ý"
              cancelText="Không"
              title="Xóa sản phẩm"
              description="Bạn có muốn xóa sản phẩm này không?"
              onConfirm={() => handleDeleteProduct(product?.id)}
            >
              <FaTrash className="text-2xl text-red-400 cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="list-product">
      <h1 className="text-2xl font-semibold mb-3">Danh sách sản phẩm</h1>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-3">
          <Search
            placeholder="Tìm kiếm"
            onChange={(e: any) => handleSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Cascader
            style={{ width: 200 }}
            // value={selectCategory}
            onChange={(value) => handleSelectCategory(value)}
            placeholder="Lọc theo danh mục"
            options={options}
            allowClear
          />
          <Select
            style={{ width: 200 }}
            // value={selectStatus}
            onChange={(value) => handleSelectStatus(value)}
            placeholder="Lọc theo trạng thái"
            allowClear
            options={[
              { value: "1", label: "Đang hiển thị" },
              { value: "0", label: "Đang ẩn" },
            ]}
          ></Select>
        </div>
        <div
          onClick={showDrawer}
          className="flex gap-2 items-center bg-blue-600 text-white py-2 px-4 rounded-sm cursor-pointer"
        >
          <PlusOutlined className="!text-white" />
          <p>Thêm sản phẩm</p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table dataSource={products} columns={columns} />
        )}
      </div>

      <DrawerAdd
        refetch={refetch}
        options={options}
        openDrawerAdd={openDrawerAdd}
        setOpenDrawerAdd={setOpenDrawerAdd}
      />

      <DrawerEdit
        idProduct={idProductEdit}
        refetch={refetch}
        options={options}
        openDrawerEdit={openDrawerEdit}
        setOpenDrawerEdit={setOpenDrawerEdit}
      />
    </div>
  );
};
export default ListProducts;
