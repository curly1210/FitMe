/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { IoIosChatboxes } from "react-icons/io";
import { useEffect, useRef } from "react";
import { useChatbox } from "../hooks/useChatbox";
import trashCan from "../assets/images/trash-can.png";

const LayoutClient = () => {
  const { isOpenSearchPanel, setIsOpenSearchPanel } = useSearchPanel();
  const navigate = useNavigate();

  const {
    isOpenChatbox,
    toggleChat,
    messages,
    isPending,
    input,
    sendMessage,
    setInput,
    resetChatbox,
  } = useChatbox();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <Tooltip placement="top" title={"Chat box"}>
          <button
            onClick={toggleChat}
            className="fixed cursor-pointer bottom-20 right-5 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            {/* <GiClothes className="text-3xl" /> */}
            <IoIosChatboxes className="text-3xl" />
          </button>
        </Tooltip>
        <Tooltip placement="top" title={"Phòng thử đồ"}>
          <button
            onClick={() => handleClickToTryClothesPage()}
            className="fixed cursor-pointer bottom-6 right-5 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            <GiClothes className="text-3xl" />
          </button>
        </Tooltip>

        {isOpenChatbox && (
          <div className="fixed bottom-20 right-20 w-80 h-96 bg-white rounded-l border border-gray-300 shadow-xl flex flex-col z-50 ">
            {/* <div className="absolute -top-7 right-8">
              <Popconfirm
                title="Xóa hội thoại"
                onConfirm={() => resetChatbox()}
                description="Bạn có chắc chắn muốn xóa không?"
                okText="Có"
                cancelText="Không"
              >
                <img
                  src={trashCan}
                  alt="Xóa cuộc trò chuyện"
                  className="w-6 h-6 cursor-pointer"
                />
              </Popconfirm>
            </div>
            <div className="absolute -top-7 right-0 ">
              <img
                src={close}
                alt="Đóng chat"
                onClick={() => toggleChat()}
                className="w-6 h-6 cursor-pointer"
              />
            </div> */}
            {/* Khung chat */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2">
              {messages.map((msg: any, index: any) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg text-sm inline-block max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                      className="[&>a]:underline [&>a]:text-blue-600 [&>a]:hover:text-blue-800"
                    />
                    {/* {msg.content} */}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {isPending && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm inline-block max-w-[75%] animate-pulse">
                    ...
                  </div>
                </div>
              )}
            </div>

            {/* Input + Gửi */}
            <div className="flex items-stretch border-t border-gray-200">
              <div className="px-2 border-r border-gray-200 flex items-center">
                <Tooltip placement="top" title={"Xóa cuộc trò chuyện"}>
                  <img
                    onClick={() => resetChatbox()}
                    src={trashCan}
                    alt="Xóa cuộc trò chuyện"
                    className="w-5 h-5 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-2 text-sm outline-none"
                placeholder="Bạn muốn hỏi gì ?"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 text-sm "
              >
                Gửi
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
export default LayoutClient;
