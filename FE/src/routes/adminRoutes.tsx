import LayoutAdmin from "../components/LayoutAdmin";
import Category from "../pages/admin/Category";

import Bienthe from "../pages/admin/BienThe/indext";
import Dashboard from "../pages/admin/Dashboard";

import BannerList from "../pages/admin/Banner";
import ProtectAdmin from "../components/ProtectAdmin";
import User from "../pages/admin/User/indext";
import ListProducts from "../pages/admin/Product";
import TrashProducts from "../pages/admin/Product/TrashProducts";
import CouponsList from "../pages/admin/Khuyenmai/indext";
import Oder from "../pages/admin/Oder/indext";


export const adminRoutes = [
  {
    element: <ProtectAdmin role="Quản trị viên" />,
    children: [
      {
        path: "/admin",
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "banner",
            element: <BannerList />,
          },
          {
            path: "category",
            element: <Category />,
          },
          {
            path: "bienthe",
            element: <Bienthe />,
          },
          {
            path: "users",
            element: <User />,
          },
          {
            path: "products",
            element: <ListProducts />,
          },
          {
            path: "products/trash",
            element: <TrashProducts />,
          },
               {
            path: "coupons",
            element: <CouponsList />,
          },
                  {
            path: "oders",
            element: <Oder />,
          },
      
        ],
      },
    ],
  },
];
