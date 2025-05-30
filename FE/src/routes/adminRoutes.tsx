import LayoutAdmin from "../components/LayoutAdmin";
import Banner from "../pages/admin/Banner";
import Category from "../pages/admin/Category";

import Bienthe from "../pages/admin/BienThe/indext";
import Dashboard from "../pages/admin/Dashboard";
import ProtectAdmin from "../components/ProtectAdmin";
import User from "../pages/admin/User/indext";

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
            element: <Banner />,
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
        ],
      },
    ],
  },
];
