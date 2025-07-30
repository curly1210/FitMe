/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreate } from "@refinedev/core";
import { createContext, ReactNode, useState } from "react";

interface ChatboxType {
  isOpenChatbox: boolean;
  toggleChat: () => void;
  isPending: boolean;
  messages: any[];
  sendMessage: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export const ChatboxContext = createContext<ChatboxType>({
  isOpenChatbox: false,
  toggleChat: () => {},
  isPending: false,
  messages: [],
  sendMessage: () => {},
  input: "",
  setInput: () => {},
});

export const ChatboxProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenChatbox, setIsOpenChatbox] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any>([]);

  const { mutate: createRequestForChatbox, isPending } = useCreate({
    resource: "chatbot",
  });

  const toggleChat = () => {
    setIsOpenChatbox(!isOpenChatbox);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    // setIsLoading(true);

    createRequestForChatbox(
      {
        values: { message: input },
      },
      {
        onSuccess: (response) => {
          console.log(response?.data);
          setMessages([
            ...newMessages,
            { role: "bot", content: response?.data?.reply },
          ]);
          // refetch();
          // notification.success({ message: response?.data?.message });
          // resolve(response); // return response
        },
        onError: (error) => {
          console.log(error);
          setMessages([
            ...newMessages,
            { role: "bot", content: "Lỗi kết nối đến server." },
          ]);
        },
      }
    );
  };

  return (
    <ChatboxContext.Provider
      value={{
        isOpenChatbox,
        toggleChat,
        isPending,
        messages,
        sendMessage,
        input,
        setInput,
      }}
    >
      {/* Children components will go here */}
      {children}
    </ChatboxContext.Provider>
  );
};
