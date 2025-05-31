import LayoutClient from "../components/LayoutClient";
import ProtectClient from "../components/ProtectClient";
import Address from "../pages/client/Address";
import Contact from "../pages/client/Contact";
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
