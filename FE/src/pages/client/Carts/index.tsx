import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router";

const Carts = () => {
  return (
    <div>
      <div className="flex gap-3 border border-gray-300 items-center py-5 px-4 mb-5">
        <Link className="text-gray-500" to={"/"}>
          Trang chủ
        </Link>

        <RightOutlined className="text-sm text-gray-500" />
        <p className="font-bold">Giỏ hàng của tôi</p>

        {/* {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="p-4  rounded">
          Gợi ý #{i + 1}
        </div>
      ))} */}
      </div>
    </div>
  );
};
export default Carts;
