/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { notification, Spin } from "antd";
import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { API_URL } from "../utils/constant";
import { usePopupMessage } from "../hooks/usePopupMessage";

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // có thể có hoặc không
}

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => Promise<string | null>;
  user: User | null;
  setUser: (user: User | null) => void;
  setPersist: (val: boolean) => void;
  logout: () => void;
  channelAuth: BroadcastChannel;
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: async () => null,
  user: null,
  setUser: () => {},
  setPersist: () => {},
  logout: () => {},
  channelAuth: new BroadcastChannel("auth"),
});

const channelAuth = new BroadcastChannel("auth");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [persist, setPersist] = useState<boolean>(
    localStorage.getItem("persist") === "true" || false
  );
  const { notify } = usePopupMessage();
  const navigate = useNavigate();

  const { mutate: signout } = useCreate({
    resource: "logout",
    mutationOptions: {
      onSuccess: (response) => {
        notify("success", "Đăng xuất", response?.data?.message);
        channelAuth.postMessage({ type: "logout" });
        setAccessToken(null);
        setUser(null);
        setPersist(false);
        localStorage.removeItem("persist");
        // openPopup(<ModalLogin />);
      },
      onError: (error) => {
        console.log(error);
        notify("error", "Đăng xuất", error.message);
      },
    },
  });

  useEffect(() => {
    // Nhận message từ các tab khác
    channelAuth.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === "logout") {
        setAccessToken(null);
        setUser(null);
        setPersist(false);
        localStorage.removeItem("persist");
      }

      if (type === "login") {
        setAccessToken(payload.accessToken);
        setUser(payload.user);
        // setPersist(true);
        // localStorage.setItem("persist", "true");
      }
    };

    return () => {
      channelAuth.onmessage = null;
    };
  }, [navigate]);

  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true }
      );

      setUser(data?.data?.user);
      setAccessToken(data?.data?.access_token);
      setIsAppReady(true);
      return data?.data?.access_token;
    } catch (error) {
      localStorage.removeItem("persist");
      setPersist(false);
      setUser(null);
      setAccessToken(null);

      notification.error({ message: "Bạn không có quyền truy cập" });
      navigate("/");
      setIsAppReady(true);
      return null;
    }
  };

  const logout = () => {
    signout({ values: {} });
  };

  useEffect(() => {
    let isMounted = true;

    persist === true ? refreshToken() : setIsAppReady(true);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        user,
        setUser,
        setPersist,
        logout,
        channelAuth,
      }}
    >
      {!isAppReady ? (
        <div style={{ textAlign: "center" }}>
          <Spin
            // size="large"
            fullscreen
            // className="bg-amber-600 "
            tip="Đang xác thực phiên..."
          />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
