import LayoutClient from "../components/LayoutClient";
import ProtectClient from "../components/ProtectClient";
import Address from "../pages/client/Address";
import Contact from "../pages/client/Contact";
import ProductDetail from "../pages/client/DetailProduct/indext";
import HomePage from "../pages/client/HomePage";

export const clientRoutes = [
  {
    path: "/",
    element: <HomePage />,
    index: true,
  },
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      {
        path: "contact",
        element: <Contact />,
      },
          {
        path: "detail",
        element: <ProductDetail />,
      },




      {
        element: <ProtectClient role="client" />,
        children: [
          {
            path: "address",
            element: <Address />,
          },
        ],
      },


    ],
  },
];
