/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { notification, Spin } from "antd";
import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

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
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: async () => null,
  user: null,
  setUser: () => {},
  setPersist: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [persist, setPersist] = useState<boolean>(
    localStorage.getItem("persist") === "true" || false
  );

  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/refresh`,
        {},
        { withCredentials: true }
      );
      // console.log(data);

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

    // return new Promise((resolve, reject) => {
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
    //         setUser(response?.data?.data?.user);
    //         // console.log(response?.data?.data?.access_token);
    //         setAccessToken(response?.data?.data?.access_token);
    //         setIsAppReady(true);
    //         resolve(response?.data?.data?.access_token); // ✅ để `await refreshToken()` lấy được token
    //         // const token = response?.data?.data?.access_token;
    //         // setAccessToken(token);
    //         return response?.data?.data?.access_token;
    //       },
    //       onError: (error) => {
    //         console.log("loi o day");
    //         setIsAppReady(true);
    //         reject(null);
    //         return null;
    //       },
    //     }
    //   );
    // });
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
      {/* {<Spin spinning={isLoading}>{children}</Spin>} */}
    </AuthContext.Provider>
  );
};
