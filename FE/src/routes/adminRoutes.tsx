import Authenticate from "../components/Authenticate";
import LayoutAdmin from "../components/LayoutAdmin";
import Banner from "../pages/admin/Banner";
import Bienthe from "../pages/admin/BienThe/indext";
import Dashboard from "../pages/admin/Dashboard";

export const adminRoutes = [
  {
    element: <Authenticate />,
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
            path: "bienthe",
            element: <Bienthe />,
          },
        ],
      },
    ],
  },
];
