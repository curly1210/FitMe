import LayoutClient from "../components/LayoutClient";
import ProtectClient from "../components/ProtectClient";
import { CartProvider } from "../context/CartProvider";
import Address from "../pages/client/Address";
import Carts from "../pages/client/Carts";
import CheckOut from "../pages/client/CheckOut";
import Contact from "../pages/client/Contact";
import ProductDetail from "../pages/client/DetailProduct/indext";
import HomePage from "../pages/client/HomePage";
import ListProducts from "../pages/client/Products";

export const clientRoutes = [
  {
    path: "/",
    element: <HomePage />,
    index: true,
  },
  {
    path: "/",
    element: (
      <CartProvider>
        <LayoutClient />
      </CartProvider>
    ),
    children: [
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "category/:categorySlug",
        element: <ListProducts />,
      },
      {
        path: "products/:slug",
        element: <ProductDetail />,
      },
      {
        path: "checkout",
        element: <CheckOut />,
      },

      {
        element: <ProtectClient role="client" />,
        children: [
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "carts",
            element: <Carts />,
          },
        ],
      },
    ],
  },
];
