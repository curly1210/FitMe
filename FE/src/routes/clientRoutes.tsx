import LayoutClient from "../components/LayoutClient";
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
    ],
  },
];
