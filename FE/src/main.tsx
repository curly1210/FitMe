import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import ModalProvider from "./context/ModalProvider.tsx";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import PopupProvider from "./context/PopupMessageProvider.tsx";

// const router = createBrowserRouter([...clientRoutes, ...adminRoutes]);

createRoot(document.getElementById("root")!).render(
  // <RouterProvider router={router}>
   <Refine dataProvider={dataProvider("http://127.0.0.1:8000")}>
  
     
    <PopupProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </PopupProvider>
  </Refine>
  // </RouterProvider>
);
