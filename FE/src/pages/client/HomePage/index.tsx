/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Carousel } from "antd";
import { useRef } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  EllipsisOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SearchPanel from "../../../components/Client/SearchPanel";
import { useAuthen } from "../../../hooks/useAuthen";
import ModalLogin from "../../../components/Modal/ModalLogin";
import { useModal } from "../../../hooks/useModal";
import { useSearchPanel } from "../../../hooks/useSearchPanel";
import { Link } from "react-router";
// import HeaderClient from "../../../components/Client/HeaderClient";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "100vh",
  // height: "100vh",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const carousels = [
  "https://media.routine.vn/1920x0/prod/media/rou09543-03-jpg-01da.webp",
  "https://media.routine.vn/1920x0/prod/media/untitled-2-01-11-jpg-hwu3.webp",
  "https://media.routine.vn/1920x0/prod/media/banner-kv-landing-page-04-png-jl2j.webp",
  "https://media.routine.vn/1920x0/prod/media/smart-shirt-cover-web-copy-png-b369.webp",
];

const HomePage = () => {
  const sliderRef = useRef<Slider>(null);
  // const [isOpen, setIsOpen] = useState(false);
  const {
    isOpenSearchPanel,
    setIsOpenSearchPanel,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useSearchPanel();

  const { openModal } = useModal();
  const { accessToken, user, logout } = useAuthen();

  const handleWheel = (e: React.WheelEvent) => {
    if (!sliderRef.current) return;

    if (e.deltaY > 0) {
      sliderRef.current.slickNext();
    } else {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
  };

  return (
    <>
      <div
        className="custom-carousel-wrapper h-screen relative"
        onWheel={handleWheel}
      >
        <header className="absolute w-7xl top-0 left-1/2 -translate-x-1/2  z-10 px-6 py-10  text-white ">
          <div className="flex justify-between">
            <div>
              <img
                width={156}
                src="https://media.routine.vn/prod/media/f0c0d744-fa73-41f1-b4bd-bd352808fcec.webp"
                alt=""
                className="block mb-2"
              />
              <div className="flex gap-7">
                <SearchOutlined className="text-xl" />
                <div className="list-none flex gap-3.5">
                  {categories.map((category: any) => (
                    <li
                      key={category.id}
                      className={`cursor-pointer   ${
                        selectedCategory?.id === category.id
                          ? "border-b-2 border-white font-semibold"
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
            </div>
            <div className="flex gap-3">
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
        <Slider className="h-dvh" ref={sliderRef} {...settings}>
          {carousels.map((slide, index) => (
            <div className="h-dvh" key={index}>
              <div style={contentStyle}>
                <img src={slide} className="object-cover" alt="" />
              </div>
            </div>
          ))}
        </Slider>

        {isOpenSearchPanel && <SearchPanel />}

        {!isOpenSearchPanel && (
          <button
            onClick={() => setIsOpenSearchPanel(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-400 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          >
            <SearchOutlined className="text-xl" />
          </button>
        )}
      </div>
    </>
  );
};
export default HomePage;
