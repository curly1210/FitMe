import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
// import ModalProvider from "./context/ModalProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { clientRoutes } from "./routes/clientRoutes.tsx";
import { adminRoutes } from "./routes/adminRoutes.tsx";
import { notFoundRoute } from "./routes/notFoundRoute.tsx";

// const router = createBrowserRouter([...clientRoutes, ...adminRoutes]);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [...clientRoutes, ...adminRoutes, ...notFoundRoute],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <RouterProvider router={router}>
  // <Refine dataProvider={dataProvider("http://localhost:3000")}>
  <RouterProvider router={router} />
  // <RouterProvider router={router}>
  //   <Refine dataProvider={dataProvider("http://127.0.0.1:8000/api")}>
  //     <PopupProvider>
  //       <ModalProvider>
  //         <App />
  //       </ModalProvider>
  //     </PopupProvider>
  //   </Refine>
  // </RouterProvider>
  // </RouterProvider>
);
