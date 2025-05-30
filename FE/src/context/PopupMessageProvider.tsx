/* eslint-disable react-refresh/only-export-components */

import { notification } from "antd";
import { createContext, ReactNode } from "react";

// export default PopupMessage;
type NotificationType = "success" | "info" | "warning" | "error";

interface PopupContextProps {
  notify: (
    type: NotificationType,
    message: string,
    description?: string
  ) => void;
}

export const PopupContext = createContext<PopupContextProps | null>(null);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
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
