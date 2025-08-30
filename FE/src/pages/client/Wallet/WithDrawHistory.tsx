import { RightOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { Collapse, Skeleton, Tag } from "antd";
import { CollapseProps } from "antd/lib";

const WithDrawHistory = () => {
  const { data: responseTransaction, isLoading } = useList({
    resource: "wallet/transaction",
  });

  // console.log(responseTransaction);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex justify-between items-center w-full">
          <div className="grid grid-cols-2 w-2/3">
            <span className="font-bold text-lg ">1.250.000 ₫</span>
            <span className="text-gray-500">25 tháng 7, 2024</span>
          </div>
          <Tag color="green">Đã duyệt</Tag>
        </div>
      ),
      children: <p>cuong</p>,
    },
    {
      key: "2",
      label: (
        <div className="flex justify-between items-center w-full">
          <div className="grid grid-cols-2 w-2/3">
            <span className="font-bold text-lg ">9.000 ₫</span>
            <span className="text-gray-500">25 tháng 7, 2024</span>
          </div>
          <Tag color="green">Đã duyệt</Tag>
        </div>
      ),
      children: <p>cuong</p>,
    },
    {
      key: "3",
      label: (
        <div className="flex justify-between items-center w-full">
          <div className="grid grid-cols-2 w-2/3">
            <span className="font-bold text-lg ">1.250.000 ₫</span>
            <span className="text-gray-500">25 tháng 7, 2024</span>
          </div>
          <Tag color="green">Đã duyệt</Tag>
        </div>
      ),
      children: <p>cuong</p>,
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch sử rút tiền</h3>

      {isLoading ? (
        <div className="relative">
          <Skeleton active />
          {/* <Spin
            className="!absolute z-[100] backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          /> */}
        </div>
      ) : // ) : responseTransaction?.data?.data.length > 0 ? (
      true ? (
        <div>
          <Collapse
            items={items}
            defaultActiveKey={["0"]}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <RightOutlined
                rotate={isActive ? 270 : 90} // Xoay icon khi mở
                style={{ fontSize: "14px" }}
              />
            )}
          />
        </div>
      ) : (
        <div className="text-center py-10 px-4 border border-gray-300 rounded-lg">
          <p className="text-gray-500">Không tìm thấy yêu cầu nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};
export default WithDrawHistory;
