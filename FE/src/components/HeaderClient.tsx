import { useModalContext } from "../context/ModalProvider";
import ModalLogin from "./Modal/ModalLogin";
import ModalRegister from "./Modal/ModalRegister";

const HeaderClient = () => {
  const { openPopup } = useModalContext();

  return (
    <div>
      <header>
        <button onClick={() => openPopup(<ModalLogin />)}>Đăng nhập</button>
        <button onClick={() => openPopup(<ModalRegister />)}>Đăng ký</button>
      </header>
    </div>
  );
};
export default HeaderClient;
