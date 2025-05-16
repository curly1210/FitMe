import LayoutClient from "../components/LayoutClient";
import Contact from "../pages/client/Contact";
import HomePage from "../pages/client/HomePage";

export const clientRoutes = [
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
];
