import { Outlet, useNavigate } from "react-router";
import HeaderClient from "./Client/HeaderClient";
import { useSearchPanel } from "../hooks/useSearchPanel";
import { SearchOutlined } from "@ant-design/icons";
import SearchPanel from "./Client/SearchPanel";
import FooterClient from "./Client/FooterClient";
import { GiClothes } from "react-icons/gi";
import { Tooltip } from "antd";
import { useAuthen } from "../hooks/useAuthen";
import ModalLogin from "./Modal/ModalLogin";
import { useModal } from "../hooks/useModal";

const LayoutClient = () => {
  const { isOpenSearchPanel, setIsOpenSearchPanel } = useSearchPanel();
  const navigate = useNavigate();

  const { accessToken } = useAuthen();
  const { openModal } = useModal();
  const handleClickToTryClothesPage = () => {
    if (!accessToken) {
      openModal(<ModalLogin />);
      return;
    }
    // Nếu đã ở trang /carts thì không push thêm vào history
    if (location.pathname === "/try-clothes") return;

    navigate("/try-clothes");
  };
  return (
    <div>
      <HeaderClient />
      <main className="w-7xl mx-auto px-4">
        <Outlet />
      </main>
      <footer>
        <FooterClient />
        {isOpenSearchPanel && <SearchPanel />}
        {!isOpenSearchPanel && (
          <button
            onClick={() => setIsOpenSearchPanel(true)}
            className="fixed cursor-pointer bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            <SearchOutlined className="text-xl" />
          </button>
        )}
        <Tooltip placement="top" title={"Phòng thử đồ"}>
          <button
            onClick={() => handleClickToTryClothesPage()}
            className="fixed cursor-pointer bottom-6 right-5 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            <GiClothes className="text-3xl" />
          </button>
        </Tooltip>
      </footer>
    </div>
  );
};
export default LayoutClient;
