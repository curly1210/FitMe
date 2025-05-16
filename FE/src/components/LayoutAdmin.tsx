import { Outlet } from "react-router";

const LayoutAdmin = () => {
  return (
    <div>
      <header>Header của admin</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer của admin</footer>
    </div>
  );
};
export default LayoutAdmin;
