/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuthen } from "../hooks/useAuthen";
import { disconnectEcho, initEcho } from "../utils/echo";
import { useCustom } from "@refinedev/core";

interface NotificationUserType {
  userUnreadNotifications: any[];
  unread: number;
  refetchUserUnreadNotifications: () => void; // Optional refetch function
  isLoadingUserNotications: boolean; // Optional loading state
}

export const NotificationUserContext = createContext<NotificationUserType>({
  userUnreadNotifications: [],
  unread: 0,
  refetchUserUnreadNotifications: () => {}, // Default no-op function
  isLoadingUserNotications: false, // Default loading state
});

export const NotificationUserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { accessToken, user } = useAuthen();
  const [userUnreadNotifications, setUserUnreadNotifications] = useState<any>(
    []
  );
  const [unread, setUnread] = useState<any>(0);

  const {
    data: responseUserNotifications,
    refetch: refetchUserUnreadNotifications,
    isFetching: isLoadingUserNotications,
  } = useCustom({
    method: "get",
    url: "notifications/unread",
    config: {},
    queryOptions: {
      enabled: !!accessToken, // Chỉ chạy khi accessToken tồn tại
      onSuccess: (data) => {
        setUserUnreadNotifications(data.data?.notifications ?? []);
        setUnread(data.data?.unread_count ?? 0);
        // setUserAllNotifications(data?.data?.notifications ?? []);
      },
    },
  });

  // const {
  //   data: responseUserNotifications,
  //   refetch: refetchUserUnreadNotifications,
  //   isFetching: isLoadingUserNotications,
  // } = useList({
  //   resource: "notifications/unread",
  //   queryOptions: {
  //     enabled: !!accessToken, // Chỉ chạy khi accessToken tồn tại
  //     onSuccess: (data) => {
  //       setUserUnreadNotifications(data.data?.notifications ?? []);
  //       setUnread(data.data?.unread_count ?? 0);
  //     },
  //   },
  // });

  // console.log(userNotifications);

  useEffect(() => {
    if (!accessToken) return; // chưa login thì bỏ qua

    // Gọi API lấy userId (nếu chưa có sẵn từ hook useAuthen)
    const userId = user?.id;
    // console.log("userId:", userId);
    if (!userId) return;

    const echo = initEcho(accessToken);
    // echo
    //   .private(`App.Models.User.${userId}`)
    //   .listen(".order.updated", (e: any) => {
    //     refetchUserUnreadNotifications();
    //     // console.log("Thông báo đơn hàng:", e.message);
    //   });

    if (user?.role === "Admin") {
      echo.private("admin.notifications").listen(".order.updated", (e: any) => {
        console.log("Thông báo admin:", e.message);
        refetchUserUnreadNotifications();
      });
    }

    if (user?.role === "Customer") {
      echo
        .private(`App.Models.User.${userId}`)
        .listen(".order.updated", (e: any) => {
          refetchUserUnreadNotifications();
          // console.log("Thông báo đơn hàng:", e.message);
        });
    }

    return () => {
      disconnectEcho();
    };
  }, [accessToken, user]);

  return (
    <NotificationUserContext.Provider
      value={{
        userUnreadNotifications,
        unread,
        refetchUserUnreadNotifications,
        isLoadingUserNotications,
      }}
    >
      {/* Children components will go here */}
      {children}
    </NotificationUserContext.Provider>
  );
};
