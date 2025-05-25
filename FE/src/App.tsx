import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { clientRoutes } from "./routes/clientRoutes";
import { adminRoutes } from "./routes/adminRoutes";
// import axios from "axios";



const router = createBrowserRouter([
  {
    element: <Outlet />,
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
