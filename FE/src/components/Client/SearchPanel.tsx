/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";

import { Spin, Tooltip } from "antd";
import HeaderClient from "./HeaderClient";
import { useSearchPanel } from "../../hooks/useSearchPanel";
import { useList } from "@refinedev/core";
import { Link, useNavigate } from "react-router";
import { GiClothes } from "react-icons/gi";
import ModalLogin from "../Modal/ModalLogin";
import { useAuthen } from "../../hooks/useAuthen";
import { useModal } from "../../hooks/useModal";
import { useEffect, useRef, useState } from "react";
import { useChatbox } from "../../hooks/useChatbox";
import { IoIosChatboxes } from "react-icons/io";

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const SearchPanel = () => {
  const { isLoadingSearchPanel, selectedCategory, setIsOpenSearchPanel } =
    useSearchPanel();

  const { data, isLoading } = useList({
    resource: "client/posts",
  });

  const {
    isOpenChatbox,
    toggleChat,
    messages,
    isPending,
    input,
    sendMessage,
    setInput,
  } = useChatbox();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const navigate = useNavigate();
  const { accessToken } = useAuthen();
  const { openModal } = useModal();

  const handleClickToTryClothesPage = () => {
    if (!accessToken) {
      openModal(<ModalLogin />);
      return;
    }
    if (location.pathname === "/try-clothes") return;

    navigate("/try-clothes");
  };

  const newsList = data?.data?.slice(0, 4) ?? [];

  const [searchValue, setSearchValue] = useState("");
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setIsOpenSearchPanel(false);
      const encoded = encodeURIComponent(searchValue);
      navigate(`/search?searchValue=${encoded}`);
    }
  };

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col">
        {isLoadingSearchPanel ? (
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <>
            <HeaderClient />

            <div className="w-7xl flex-1 mx-auto px-3 overflow-y-auto pt-4 pb-10 no-scrollbar">
              <div className="pb-10 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-y-8 px-5">
                  {selectedCategory?.items.map((sub: any) => (
                    <Link
                      to={`category/${sub.slug}`}
                      state={{ categoryData: sub }}
                      key={sub.id}
                      className="flex gap-2 items-center"
                    >
                      <div className="w-10 h-11">
                        <img
                          src={sub?.image}
                          width={40}
                          alt=""
                          className="object-cover h-full"
                        />
                      </div>
                      <p>{sub.name}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-5">
                  Các bộ sưu tập của Fitme
                </h2>
                <div className="flex items-start gap-[22px]">
                  <div className="overflow-hidden">
                    <div className="cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="w-[248px] h-[248px] mb-2">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumb-copy-png-5o81.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Coffee Lovers 5</p>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="w-[248px] h-[248px] mb-2">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/1-png-zjme-1-png-mwmb.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Coffee Lovers 4</p>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="w-[248px] h-[248px] mb-2">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/476229736-1074507978046092-3929017900147860215-n-jpg-orfd.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Smart Shirt</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-5">Tin tức</h2>
                {isLoading ? (
                  <Spin size="large" />
                ) : (
                  <div className="flex flex-nowrap gap-[22px] overflow-x-auto">
                    {newsList.map((item: any) => (
                      <Link
                        to={`/post/${item.slug}`}
                        key={item.id}
                        className="overflow-hidden w-[298px]"
                      >
                        <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                          <div className="h-[198px]">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="object-cover block h-full w-full"
                            />
                          </div>
                          <p className="font-semibold text-sm text-[#8C8C8C]">
                            {item.created_at}
                          </p>
                          <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                            {item.title}
                          </p>
                          <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                            {stripHtml(item.content)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pb-8">
                <h2 className="text-xl font-bold mb-5">Về Fitme</h2>
                <div className="flex items-start gap-[22px]">
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumbnail-our-philosophy-400kb-jpg.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Châm ngôn của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis leading-6">
                        Chúng tôi giúp cho cuộc sống của bạn dễ dàng hơn
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumbnail-our-journey-3mb-jpg.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Hành trình của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis leading-6">
                        Những bước để vươn ra thế giới
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumb-our-collaboration-png.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Bộ sưu tập của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis leading-6">
                        Từ các đối tác của chúng tôi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="w-7xl mx-auto shrink-0 sticky bottom-0 bg-white z-10 px-4 flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Nhập để tìm kiếm..."
                className="w-full border border-gray-400 rounded px-4 py-2 mt-3"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={() => setIsOpenSearchPanel(false)}
                className="bg-black cursor-pointer text-white rounded-full w-10 h-10 flex items-center justify-center mb-3"
              >
                <CloseOutlined />
              </button>
            </footer>
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
                        {msg.content}
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
                <div className="flex border-t border-gray-200">
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
                    className="bg-blue-500 text-white px-4 text-sm"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
