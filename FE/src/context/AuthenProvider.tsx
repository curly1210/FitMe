/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCreate } from "@refinedev/core";
import { Spin } from "antd";
import { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // có thể có hoặc không
}

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { mutate: create } = useCreate();

  const refreshToken = async () => {
    return new Promise((resolve, reject) => {
      create(
        {
          resource: "refresh",
          meta: {
            requestOptions: {
              withCredentials: true,
            },
          },
          values: {},
        },
        {
          onSuccess: (response) => {
            setUser(response?.data?.data?.user);
            // console.log(response?.data?.data?.access_token);
            setAccessToken(response?.data?.data?.access_token);
            setIsAppReady(true);
            resolve(response?.data?.data?.access_token); // ✅ để `await refreshToken()` lấy được token
            // const token = response?.data?.data?.access_token;
            // setAccessToken(token);
            return response?.data?.data?.access_token;
          },
          onError: (error) => {
            setIsAppReady(true);
            reject(error);
          },
        }
      );
    });
    // try {
    //   create(
    //     {
    //       resource: "refresh",
    //       meta: {
    //         requestOptions: {
    //           withCredentials: true,
    //         },
    //       },
    //       values: {},
    //     },
    //     {
    //       onSuccess: (response) => {
    //         // console.log(response?.data?.data?.user);
    //         setUser(response?.data?.data?.user);
    //         // console.log(response?.data?.data?.access_token);
    //         setAccessToken(response?.data?.data?.access_token);
    //         setIsAppReady(true);
    //         return response?.data?.data?.access_token;
    //       },
    //       onError: (error) => {
    //         console.log(error);
    //         setIsAppReady(true);
    //       },
    //     }
    //   );
    // } catch (error) {
    //   console.error("Refresh failed", error);
    //   setAccessToken(null);
    // }
  };

  useEffect(() => {
    refreshToken(); // Refresh ngay khi app load
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, user, setUser }}
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
      {/* {<Spin spinning={isLoading}>{children}</Spin>} */}
    </AuthContext.Provider>
  );
};
