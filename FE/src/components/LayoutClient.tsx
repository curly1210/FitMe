import { Outlet } from "react-router";
import HeaderClient from "./Client/HeaderClient";

const LayoutClient = () => {
  return (
    <div>
      <HeaderClient />
      <main>
        <Outlet />
      </main>
      <footer>Footer của client</footer>
    </div>
  );
};
export default LayoutClient;
