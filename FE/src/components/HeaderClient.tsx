import { useCreate } from "@refinedev/core";
import { useAuthen } from "../hooks/useAuthen";
import { useModal } from "../hooks/useModal";
import ModalLogin from "./Modal/ModalLogin";
import { usePopup } from "../context/PopupMessageProvider";

const HeaderClient = () => {
  const { openPopup } = useModal();
  const { accessToken, user, setAccessToken, setUser } = useAuthen();
  const { notify } = usePopup();

  const { mutate } = useCreate({
    resource: "logout",
    mutationOptions: {
      onSuccess: (response) => {
        notify("success", "Đăng xuất", response?.data?.message);
        setAccessToken(null);
        setUser(null);
        // openPopup(<ModalLogin />);
      },
      onError: (error) => {
        console.log(error);
        notify("error", "Đăng xuất", error.message);
      },
    },
  });

  // console.log(accessToken);
  console.log(user);

  return (
    <div>
      <header>
        {!accessToken ? (
          <button onClick={() => openPopup(<ModalLogin />)}>Đăng nhập</button>
        ) : (
          <div>
            <p>Hello, {user?.name}</p>
            <button
              className="cursor-pointer"
              onClick={() => {
                mutate({ values: {} });
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </header>
    </div>
  );
};
export default HeaderClient;
