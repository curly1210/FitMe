// const PopupMessage = () => {
//   return <div>PopupMessage</div>;
// };

import { notification } from "antd";
import { createContext, ReactNode, useContext } from "react";

// export default PopupMessage;
type NotificationType = "success" | "info" | "warning" | "error";

interface PopupContextProps {
  notify: (
    type: NotificationType,
    message: string,
    description?: string
  ) => void;
}

const PopupContext = createContext<PopupContextProps | null>(null);

const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  return (
    <PopupContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </PopupContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

export default PopupProvider;
