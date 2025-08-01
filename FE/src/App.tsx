import { Outlet } from "react-router";
import { Refine } from "@refinedev/core";
import simpleRestDataProvider from "@refinedev/simple-rest";

import { ModalProvider } from "./context/ModalProvider";
import { AuthProvider } from "./context/AuthenProvider";
import axiosInstance from "./utils/axiosInstance";
import AttachAxios from "./components/AttachAxios";
import { PopupProvider } from "./context/PopupMessageProvider";
import { API_URL } from "./utils/constant";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });

const dataProvider = simpleRestDataProvider(API_URL, axiosInstance);

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: true, // hoặc true tùy bạn
//       // staleTime: 1000 * 60 * 5,
//     },
//   },
// });

function App() {
  return (
    <>
      {/* <QueryClientProvider client={queryClient}> */}
      <Refine
        dataProvider={dataProvider}
        // options={{
        //   syncWithLocation: true,
        // }}
      >
        <PopupProvider>
          <AuthProvider>
            <AttachAxios />
            <ModalProvider>
              <Outlet />
            </ModalProvider>
          </AuthProvider>
        </PopupProvider>
      </Refine>
      {/* </QueryClientProvider> */}
    </>
  );
}

export default App;
