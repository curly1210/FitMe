import { useContext } from "react";
import { ChatboxContext } from "../context/ChatboxProvider";

export const useChatbox = () => {
  const context = useContext(ChatboxContext);
  if (!context) {
    throw new Error("use searach panel must be used within a Chatbox provider");
  }
  return context;
};
