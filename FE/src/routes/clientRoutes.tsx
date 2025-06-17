import { Outlet } from "react-router";
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
import { SearchPanelProvider } from "../context/SearchPanelProvider";
import CheckoutSuccess from "../pages/client/CheckOut/success";
import Order from "../pages/client/Order";
import CheckPayment from "../pages/client/Checkpayment";

export const clientRoutes = [
  {
    path: "/",
    element: (
      <SearchPanelProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </SearchPanelProvider>
    ),
    children: [
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
            path: "category/:categorySlug",
            element: <ListProducts />,
          },
          {
            path: "products/:slug",
            element: <ProductDetail />,
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
              {
                path: "checkout",
                element: <CheckOut />,
              },
              {
                path: "checkout/success",
                element: <CheckoutSuccess />,
              },
              {
                path: "order",
                element: <Order />,
              },
              {
                path: "payment-result",
                element: <CheckPayment />,
              },
            ],
          },
        ],
      },
    ],
  },

  // {
  //   path: "/",
  //   element: <HomePage />,
  //   index: true,
  // },
  // {
  //   path: "/",
  //   element: (
  //     <CartProvider>
  //       <LayoutClient />
  //     </CartProvider>
  //   ),
  //   children: [
  //     {
  //       path: "contact",
  //       element: <Contact />,
  //     },
  //     {
  //       path: "category/:categorySlug",
  //       element: <ListProducts />,
  //     },
  //     {
  //       path: "products/:slug",
  //       element: <ProductDetail />,
  //     },
  //     {
  //       path: "checkout",
  //       element: <CheckOut />,
  //     },

  //     {
  //       element: <ProtectClient role="client" />,
  //       children: [
  //         {
  //           path: "address",
  //           element: <Address />,
  //         },
  //         {
  //           path: "carts",
  //           element: <Carts />,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
