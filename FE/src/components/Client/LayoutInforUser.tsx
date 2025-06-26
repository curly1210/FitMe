import { RightOutlined } from "@ant-design/icons";
import { Link, NavLink, Outlet, useLocation } from "react-router";

const LayoutInforUser = () => {
  const location = useLocation();
  const path = location.pathname;

  let pageTitle = "";
  if (path.includes("address")) {
    pageTitle = "Địa chỉ";
  } else if (path.includes("product-like")) {
    pageTitle = "Sản phẩm yêu thích";
  } else if (path.includes("order")) {
    pageTitle = "Đơn hàng";
  } else if (path.includes("user-info")) {
    pageTitle = "Thông tin tài khoản";
  } else {
    pageTitle = "Đổi mật khẩu";
  }
  return (
    <div>
      <div className="flex gap-3 border border-gray-400 items-center py-5 px-4 mb-5">
        <Link to={"/"}>Trang chủ</Link>
        <RightOutlined />
        <p className="font-bold">{pageTitle}</p>
      </div>

      <div className="grid grid-cols-12 gap-x-[10px] pt-5">
        <div className="col-span-4 flex flex-col gap-7">
          {/* <Link to={""}>Tài khoản</Link> */}
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/user-info"}
          >
            Tài khoản
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/order"}
          >
            Đơn hàng
          </NavLink>
          <NavLink
            to={`/account/address`}
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
          >
            Địa chỉ
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/product-like"}
          >
            Sản phẩm yêu thích
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : ""
            }
            to={"/account/change-password"}
          >
            Đổi mật khẩu
          </NavLink>
        </div>
        <div className="col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default LayoutInforUser;
