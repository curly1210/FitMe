import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { clientRoutes } from "./routes/clientRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const RefineProvider = () => {
  return (
    <Refine dataProvider={dataProvider("http")}>
      <Outlet />
    </Refine>
  );
};

const router = createBrowserRouter([
  {
    element: <RefineProvider />,
    children: [...clientRoutes, ...adminRoutes],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
