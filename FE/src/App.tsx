import { Outlet } from "react-router";
import { Refine } from "@refinedev/core";
import simpleRestDataProvider from "@refinedev/simple-rest";

import { ModalProvider } from "./context/ModalProvider";
import { AuthProvider } from "./context/AuthenProvider";
import axiosInstance from "./utils/axiosInstance";
import AttachAxios from "./components/AttachAxios";
import { PopupProvider } from "./context/PopupMessageProvider";
import { API_URL } from "./utils/constant";
import { NotificationUserProvider } from "./context/NotificationUserProvider";
import ScrollToTop from "./components/ScrollToTop";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });

const dataProvider = simpleRestDataProvider(API_URL, axiosInstance);

function App() {
  return (
    <>
      <Refine dataProvider={dataProvider}>
        <PopupProvider>
          <AuthProvider>
            <NotificationUserProvider>
              <AttachAxios />
              <ModalProvider>
                <ScrollToTop />
                <Outlet />
              </ModalProvider>
            </NotificationUserProvider>
          </AuthProvider>
        </PopupProvider>
      </Refine>
    </>
  );
}

export default App;
