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
import { Link, useNavigate } from "react-router";
import { Badge, Dropdown, MenuProps } from "antd";
import { useCart } from "../../../hooks/useCart";
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
  const { cart } = useCart();

  const navigate = useNavigate();

  const handleClickToCartPage = () => {
    if (!accessToken) {
      openModal(<ModalLogin />);
      return;
    }
    // Nếu đã ở trang /carts thì không push thêm vào history
    if (location.pathname === "/carts") return;

    navigate("/carts");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        message: "Good morning",
        icon: "☀️", // hoặc import <SunIcon />
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        message: "Good afternoon",
        icon: "🌤️", // hoặc import <AfternoonIcon />
      };
    } else {
      return {
        message: "Good evening",
        icon: "🌙", // hoặc import <MoonIcon />
      };
    }
  };

  const { message, icon } = getGreeting();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "2") {
      navigate("/account/address");
    }

    if (key === "3") {
      navigate("/account/order");
    }

    if (key === "4") {
      logout();
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p className="text-base font-bold py-1">
          {message} {icon} {user?.name} !
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/3596/3596091.png"
            alt=""
          />
          <div className="flex flex-col">
            <p className="font-bold">Thông tin người dùng</p>
            <span className="text-xs">
              Tài khoản, Đơn hàng, Địa chỉ giao nhận
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="text-base flex items-center gap-4 py-1">
          <img
            width={35}
            src="https://cdn-icons-png.flaticon.com/512/846/846364.png"
            alt=""
          />
          <div className="flex flex-col">
            <p className="font-bold">Lịch sử đơn hàng</p>
            <span className="text-xs">Tra cứu đơn hàng đã đặt</span>
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: <div className="text-base font-bold py-1">Đăng xuất</div>,
    },
  ];

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
    infinite: true,
    autoplay: true, // ⭐ bật auto
    autoplaySpeed: 5000,
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
                  <Dropdown
                    // overlay={customMenu}
                    menu={{ items, onClick: handleMenuClick }}
                    placement="bottom"
                    trigger={["click"]}
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      <UserOutlined className="text-2xl" />
                      <p className="text-sm font-bold">{user?.name}</p>
                    </div>
                  </Dropdown>
                )}
              </div>
              <Badge count={cart?.totalItem ? cart?.totalItem : 0} showZero>
                <ShoppingCartOutlined
                  onClick={handleClickToCartPage}
                  className="text-3xl cursor-pointer !text-white"
                />
              </Badge>
              {/* <ShoppingCartOutlined className="text-3xl" /> */}
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
