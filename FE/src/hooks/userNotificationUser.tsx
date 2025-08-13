import { useContext } from "react";
import { NotificationUserContext } from "../context/NotificationUserProvider";

export const useNotificationUser = () => {
  const context = useContext(NotificationUserContext);
  if (!context) {
    throw new Error("use searach panel must be used within a Chatbox provider");
  }
  return context;
};
