import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// const router = createBrowserRouter([...clientRoutes, ...adminRoutes]);

createRoot(document.getElementById("root")!).render(
  // <RouterProvider router={router}>
  <App />
  // </RouterProvider>
);
