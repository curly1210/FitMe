import { useEffect } from "react";
import { useAuthen } from "../hooks/useAuthen";
import axiosInstance from "../utils/axiosInstance";

const AttachAxios = () => {
  const { accessToken, refreshToken } = useAuthen();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const reponseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,

      async (error) => {
        const prevRequest = error?.config;
        // console.log("cuong dep trai");
        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosInstance(prevRequest);
            }
          } catch (error) {
            console.error("Refresh token expired hoặc:", error);
            return Promise.reject(error); // Không retry tiếp
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(reponseIntercept);
    };
  }, [accessToken, refreshToken]);

  return null;
};
export default AttachAxios;
