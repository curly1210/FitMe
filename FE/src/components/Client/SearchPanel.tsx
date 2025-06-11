/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Spin } from "antd";
import HeaderClient from "./HeaderClient";
import { useSearchPanel } from "../../hooks/useSearchPanel";

// interface SearchPanelProps {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const SearchPanel = () => {
  const { isLoadingSearchPanel, selectedCategory, setIsOpenSearchPanel } =
    useSearchPanel();

  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute top-0 left-0 w-full h-full  bg-white flex flex-col">
        {isLoadingSearchPanel ? (
          <Spin
            className="!absolute z-100 backdrop-blur-[1px] !inset-0 !flex !items-center !justify-center"
            style={{ textAlign: "center" }}
            size="large"
          />
        ) : (
          <>
            {/* Header cố định trên cùng */}
            <HeaderClient />

            {/* Nội dung cuộn được ở giữa */}
            <div className="w-7xl flex-1 mx-auto  px-3 overflow-y-auto pt-4 pb-10  no-scrollbar ">
              {/* {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-100 rounded">
                  Gợi ý #{i + 1}
                </div>
              ))} */}
              <div className="pb-10 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-y-8 px-5">
                  {selectedCategory?.items.map((sub: any) => (
                    <Link
                      to={`category/${sub.slug}`}
                      state={{ categoryData: sub }}
                      key={sub.id}
                      className="flex gap-2 items-center"
                      // onClick={() => navigate(`/category/${sub.id}`)}
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
                <h2 className="text-xl font-bold  mb-5">
                  Các bộ sưu tập của Fitme
                </h2>
                <div className="flex items-start gap-[22px]">
                  <div className="overflow-hidden">
                    <div className="cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
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
                    <div className="cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
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
                    <div className="cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
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
                <h2 className="text-xl font-bold  mb-5">Tin tức</h2>
                <div className="flex items-center gap-[22px]">
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[198px]">
                        <img
                          src="https://media.routine.vn/600x400/prod/media/new-flagship-store-png-9bls.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold text-sm text-[#8C8C8C]">
                        Coffee Lovers 5
                      </p>
                      <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                        Routine Mở Rộng Không Gian Mua Sắm: Chào đón New
                        Flagship Store Tại Gò Vấp
                      </p>
                      <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                        Mọi thứ ở Nhật Bản trong lần đầu tiên luôn kỳ diệu và mê
                        hoặc. Giống như bạn bước chân vào một thế giới khác, vừa
                        đến từ tương lai, vừa bước ra từ quá khứ. Tokyo rộng lớn
                        như một mê cung khổng lồ nơi mà tất cả mọi phép màu đều
                        diễn ra trong cùng một lúc. Bạn biết rằng thời gian của
                        mình tại đây có hạn, và bạn có thể lướt đi thật nhanh
                        qua những địa điểm nổi tiếng nhất, sau đó nuối tiếc vì
                        biết rằng mình đã phải bỏ lỡ rất nhiều
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[198px]">
                        <img
                          src="https://media.routine.vn/600x400/prod/blog/vong-quay-may-man-png-96zk.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold text-sm text-[#8C8C8C]">
                        Coffee Lovers 5
                      </p>
                      <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                        Vòng Quay May Mắn - 100% Có Quà: Quay Đã Tay, Nhận Quà
                        Ngay
                      </p>
                      <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                        Mọi thứ ở Nhật Bản trong lần đầu tiên luôn kỳ diệu và mê
                        hoặc. Giống như bạn bước chân vào một thế giới khác, vừa
                        đến từ tương lai, vừa bước ra từ quá khứ. Tokyo rộng lớn
                        như một mê cung khổng lồ nơi mà tất cả mọi phép màu đều
                        diễn ra trong cùng một lúc. Bạn biết rằng thời gian của
                        mình tại đây có hạn, và bạn có thể lướt đi thật nhanh
                        qua những địa điểm nổi tiếng nhất, sau đó nuối tiếc vì
                        biết rằng mình đã phải bỏ lỡ rất nhiều
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[198px]">
                        <img
                          src="https://media.routine.vn/600x400/prod/blog/routine-binh-duong-1-jpg-y0ir.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold text-sm text-[#8C8C8C]">
                        Coffee Lovers 5
                      </p>
                      <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                        GRAND OPENING – ROUTINE CHÍNH THỨC CÓ MẶT TẠI BÌNH DƯƠNG
                      </p>
                      <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                        Mọi thứ ở Nhật Bản trong lần đầu tiên luôn kỳ diệu và mê
                        hoặc. Giống như bạn bước chân vào một thế giới khác, vừa
                        đến từ tương lai, vừa bước ra từ quá khứ. Tokyo rộng lớn
                        như một mê cung khổng lồ nơi mà tất cả mọi phép màu đều
                        diễn ra trong cùng một lúc. Bạn biết rằng thời gian của
                        mình tại đây có hạn, và bạn có thể lướt đi thật nhanh
                        qua những địa điểm nổi tiếng nhất, sau đó nuối tiếc vì
                        biết rằng mình đã phải bỏ lỡ rất nhiều
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pb-8 ">
                <h2 className="text-xl font-bold  mb-5">Về Fitme</h2>
                <div className="flex items-start gap-[22px]">
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumbnail-our-philosophy-400kb-jpg.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold ">Châm ngôn của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis  leading-6">
                        Chúng tôi giúp cho cuộc sống của bạn dễ dàng hơn
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumbnail-our-journey-3mb-jpg.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold ">Hành trình của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis  leading-6">
                        Những bước để vươn ra thế giới
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumb-our-collaboration-png.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold ">Bộ sưu tập của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis  leading-6">
                        Từ các đối tác của chúng tôi
                      </p>
                    </div>
                  </div>
                  {/* <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumbnail-our-journey-3mb-jpg.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold  ">
                        Hành trình của chúng tôi
                      </p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis  leading-6">
                        Những bước đầu để vươn ra thế giới
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden w-[298px]">
                    <div className="flex flex-col gap-[9px] cursor-pointer  transform transition-transform duration-400 hover:-translate-y-2">
                      <div className="h-[298px]">
                        <img
                          src="https://media.routine.vn/400x400/prod/media/thumb-our-collaboration-png.webp"
                          alt=""
                          className="object-cover block h-full w-full"
                        />
                      </div>
                      <p className="font-semibold">Bộ sưu tập của chúng tôi</p>
                      <p className="line-clamp-2 text-[18px] text-ellipsis  leading-6">
                        Từ các đối tác của chúng tôi
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Footer cố định dưới cùng */}
            <footer className="w-7xl mx-auto shrink-0 sticky bottom-0 bg-white z-10   px-4 flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Nhập để tìm kiếm..."
                className="w-full border border-gray-400 rounded px-4 py-2 mt-3"
              />
              <button
                onClick={() => setIsOpenSearchPanel(false)}
                className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center mb-3"
              >
                <CloseOutlined />
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
export default SearchPanel;
