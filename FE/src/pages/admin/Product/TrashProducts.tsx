/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreate, useDelete, useList } from "@refinedev/core";
import {
  Cascader,
  Input,
  notification,
  Popconfirm,
  Skeleton,
  Table,
  Tag,
} from "antd";
import { useMemo, useState } from "react";
import { FaTrash, FaTrashRestoreAlt } from "react-icons/fa";

const { Search } = Input;

const TrashProducts = () => {
  const [searchText, setSearchText] = useState<any>(undefined);
  const [selectCategory, setSelectCategory] = useState<any>(undefined);

  const { data: categories } = useList({
    resource: "client/categories",
  });

  const {
    data: productDeletedResponse,
    isLoading,
    refetch,
  } = useList({
    resource: "admin/products/trash",
    filters: [
      { field: "search", operator: "eq", value: searchText },
      { field: "category_id", operator: "eq", value: selectCategory },
    ],
  });

  const { mutate: restoreProduct } = useCreate();
  const { mutate: destroyProduct } = useDelete();

  const productsDeleted =
    productDeletedResponse?.data.map((product) => ({
      ...product,
      key: product?.id,
    })) || [];

  console.log(productsDeleted);

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

  const handleRestoreProduct = (id: number) => {
    restoreProduct(
      { resource: `admin/products/restore/${id}`, values: {} },
      {
        onSuccess: (response) => {
          console.log(response);
          notification.success({ message: response?.data?.message });
          refetch();
        },
        onError: (_err) => {
          notification.error({ message: "Xóa sản phẩm thất bại" });
        },
      }
    );
    // console.log(id);
  };

  const handleDestroyProduct = (id: number) => {
    destroyProduct(
      { resource: `admin/products/destroy`, id: id },
      {
        onSuccess: (response) => {
          console.log(response);
          notification.success({ message: response?.data?.message });
          refetch();
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
      title: "Ngày xóa",
      key: "deleted_at",
      dataIndex: "deleted_at",
      render: (date: string) => {
        if (!date) return "-";

        const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return formattedDate;
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
      render: (status: boolean) => {
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
            <Popconfirm
              okText="Đồng ý"
              cancelText="Không"
              title="Khôi phục sản phẩm"
              description="Bạn có muốn khôi phục sản phẩm này không?"
              onConfirm={() => handleRestoreProduct(product.id)}
            >
              <FaTrashRestoreAlt className="text-2xl text-blue-400 cursor-pointer" />
            </Popconfirm>
            <Popconfirm
              okText="Đồng ý"
              cancelText="Không"
              title="Xóa sản phẩm"
              description="Bạn có muốn xóa vĩnh viễn sản phẩm này không?"
              onConfirm={() => handleDestroyProduct(product.id)}
            >
              <FaTrash className="text-2xl text-red-400 cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="trash-products">
      <h1 className="text-2xl font-semibold mb-3">Thùng rác sản phẩm</h1>
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
        </div>
      </div>

      <div>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table dataSource={productsDeleted} columns={columns} />
        )}
      </div>
    </div>
  );
};
export default TrashProducts;
