import { Outlet } from "react-router";

const LayoutClient = () => {
  return (
    <div>
      <header>Header của client</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer của client</footer>
    </div>
  );
};
export default LayoutClient;
