import { Outlet } from "react-router";
import { Refine } from "@refinedev/core";
import simpleRestDataProvider from "@refinedev/simple-rest";
import PopupProvider from "./context/PopupMessageProvider";
import { ModalProvider } from "./context/ModalProvider";
import { AuthProvider } from "./context/AuthenProvider";
import axiosInstance from "./utils/axiosInstance";
import AttachAxios from "./components/AttachAxios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });
const dataProvider = simpleRestDataProvider(
  "http://localhost:8000/api",
  axiosInstance
);

function App() {
  return (
    <>
      <Refine dataProvider={dataProvider}>
        {/* <Refine dataProvider={dataProvider("http://127.0.0.1:8000/api")}> */}
        <AuthProvider>
          <AttachAxios />
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
