import { Outlet } from "react-router";
import { Refine } from "@refinedev/core";
import simpleRestDataProvider from "@refinedev/simple-rest";

import { ModalProvider } from "./context/ModalProvider";
import { AuthProvider } from "./context/AuthenProvider";
import axiosInstance from "./utils/axiosInstance";
import AttachAxios from "./components/AttachAxios";
import { SearchPanelProvider } from "./context/SearchPanelProvider";
import { PopupProvider } from "./context/PopupMessageProvider";
import { API_URL } from "./utils/constant";


// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });


const dataProvider = simpleRestDataProvider(
  "http://be.test/api",
  axiosInstance
);




function App() {
  return (
    <>
      <Refine dataProvider={dataProvider}>
        {/* <Refine dataProvider={dataProvider("http://127.0.0.1:8000/api")}> */}
        <PopupProvider>
          <SearchPanelProvider>
            <AuthProvider>
              <AttachAxios />
              <ModalProvider>
                <Outlet />
              </ModalProvider>
            </AuthProvider>
          </SearchPanelProvider>
        </PopupProvider>
      </Refine>
    </>
  );
}

export default App;
