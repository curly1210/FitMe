import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { clientRoutes } from "./routes/clientRoutes";
import { adminRoutes } from "./routes/adminRoutes";
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000",
// });

// const customDataProvider = dataProvider("http://localhost:3000", axiosInstance);

// const RefineProvider = () => {
//   return (
//     <Refine dataProvider={dataProvider("http://localhost:3000")}>
//       <Outlet />
//     </Refine>
//   );
// };

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
