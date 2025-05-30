import { Outlet } from "react-router";
import HeaderClient from "./Client/HeaderClient";
import { useSearchPanel } from "../hooks/useSearchPanel";
import { SearchOutlined } from "@ant-design/icons";
import SearchPanel from "./Client/SearchPanel";

const LayoutClient = () => {
  const { isOpenSearchPanel, setIsOpenSearchPanel } = useSearchPanel();
  return (
    <div>
      <HeaderClient />
      <main className="overflow-y-auto">
        <Outlet />
      </main>
      <footer>
        {isOpenSearchPanel && <SearchPanel />}
        {!isOpenSearchPanel && (
          <button
            onClick={() => setIsOpenSearchPanel(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            <SearchOutlined className="text-xl" />
          </button>
        )}
      </footer>
    </div>
  );
};
export default LayoutClient;
