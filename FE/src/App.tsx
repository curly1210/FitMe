import { Outlet } from "react-router";
import { Refine } from "@refinedev/core";
import simpleRestDataProvider from "@refinedev/simple-rest";
import PopupProvider from "./context/PopupMessageProvider";
import { ModalProvider } from "./context/ModalProvider";
import { AuthProvider } from "./context/AuthenProvider";
// import axiosInstance from "./utils/axiosInstance";
import axios from "axios";
// import dataProvider from "@refinedev/simple-rest";
// import axios from "axios";

// const router = createBrowserRouter([
//   {
//     element: <Outlet />,
//     children: [...clientRoutes, ...adminRoutes],
//   },
// ]);

// const customDataProvider = simpleRestDataProvider(
//   "http://127.0.0.1:8000/api",
//   axiosInstance
// );

// const httpClient = axios.create({
//   withCredentials: true,
// });

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});
const dataProvider = simpleRestDataProvider(
  "http://localhost:8000/api",
  axiosInstance
);

function App() {
  return (
    <>
      <Refine dataProvider={dataProvider}>
        {/* <Refine dataProvider={"http://127.0.0.1:8000/api"}> */}
        {/* <Refine dataProvider={dataProvider("http://127.0.0.1:8000/api")}> */}
        <AuthProvider>
          <PopupProvider>
            <ModalProvider>
              <Outlet />
            </ModalProvider>
          </PopupProvider>
        </AuthProvider>
      </Refine>
    </>
  );
}

export default App;
