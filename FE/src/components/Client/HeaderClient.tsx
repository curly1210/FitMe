/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EllipsisOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthen } from "../../hooks/useAuthen";
import ModalLogin from "../Modal/ModalLogin";
import { useModal } from "../../hooks/useModal";
import { Link } from "react-router";
import { useSearchPanel } from "../../hooks/useSearchPanel";

const HeaderClient = () => {
  /* Start dont-delete */

  const { openModal } = useModal();
  const { accessToken, user, logout } = useAuthen();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setIsOpenSearchPanel,
  } = useSearchPanel();

  return (
    <header className=" shrink-0 sticky top-0 bg-white  border-gray-200  px-4 mb-5">
      <div className="text-black w-7xl m-auto flex justify-between items-center py-5 px-4">
        <div className="flex gap-6 items-center">
          <SearchOutlined className="text-2xl" />
          <div className="list-none flex gap-3.5">
            {categories.map((category: any) => (
              <li
                key={category.id}
                className={`cursor-pointer   ${
                  selectedCategory?.id === category.id
                    ? "border-b-2 border-black font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsOpenSearchPanel(true);
                }}
              >
                {category.name}
              </li>
            ))}
            <Link to="/address">
              <li>Địa chỉ</li>
            </Link>
            <li>Khuyến mãi</li>
          </div>
        </div>
        <div>
          <img
            width={36}
            src="https://media.routine.vn/1920x0/prod/media/a31071fa-22a1-440b-a6d2-776d07fe0419.webp"
            alt=""
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {!accessToken ? (
              <>
                <UserOutlined className="text-2xl" />
                <p
                  className="cursor-pointer"
                  onClick={() => openModal(<ModalLogin />)}
                >
                  Đăng nhập
                </p>
              </>
            ) : (
              <>
                <p>Hello, {user?.name}</p>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    logout();
                  }}
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
          <ShoppingCartOutlined className="text-3xl" />
          <EllipsisOutlined className="text-3xl" />
        </div>
      </div>
    </header>
  );
};
export default HeaderClient;
