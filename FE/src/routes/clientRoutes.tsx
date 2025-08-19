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
import DetailOrder from "../pages/client/Order/DetailOrder";
import ProductLike from "../pages/client/ProductLike";
import LayoutInforUser from "../components/Client/LayoutInforUser";
import InformationUser from "../pages/client/InformationUser";
import ChangePassword from "../pages/client/ChangePassword";
import PostDetail from "../pages/client/Tintuc";
import ListPost from "../pages/client/Tintuc/ListPost";
import TryClothes from "../pages/client/TryClothes";
import { ChatboxProvider } from "../context/ChatboxProvider";
import ProtectRole from "../components/ProtectRole";

import ModalChangePass from "../components/Modal/ModalChangePassword";
import Notification from "../pages/client/Notification";
import ActiveEmail from "../pages/client/ActiveEmail";

export const clientRoutes = [
  {
    path: "/",
    element: (
      <ProtectRole role="Customer">
        {/* <NotificationUserProvider> */}
        <SearchPanelProvider>
          <ChatboxProvider>
            <CartProvider>
              <Outlet />
            </CartProvider>
          </ChatboxProvider>
        </SearchPanelProvider>
        {/* </NotificationUserProvider> */}
      </ProtectRole>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
        index: true,
      },
      {
        path: "verify-email",
        element: <ActiveEmail />,
      },
      {
        path: "/",
        element: <LayoutClient />,
        children: [
          {
            path: "change-password",
            element: <ModalChangePass />,
          },
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
            path: "post/:slug",
            element: <PostDetail />,
          },
          {
            path: "post",
            element: <ListPost />,
          },
          {
            path: "search",
            element: <ListProducts />,
          },
          {
            path: "contact",
            element: <Contact />,
          },

          {
            element: <ProtectClient role="Customer" />,
            children: [
              {
                // path: "address",
                path: "account",
                element: <LayoutInforUser />,
                children: [
                  {
                    path: "user-info",
                    element: <InformationUser />,
                  },
                  {
                    path: "order",
                    element: <Order />,
                  },
                  {
                    path: "address",
                    element: <Address />,
                  },
                  {
                    path: "product-like",
                    element: <ProductLike />,
                  },
                  {
                    path: "change-password",
                    element: <ChangePassword />,
                  },
                  {
                    path: "notifications",
                    element: <Notification />,
                  },
                ],
              },
              {
                path: "try-clothes",
                element: <TryClothes />,
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
                path: "order/:id",
                element: <DetailOrder />,
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
];
