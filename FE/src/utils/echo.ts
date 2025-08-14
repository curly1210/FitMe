/* eslint-disable @typescript-eslint/no-explicit-any */
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: any;
  }
}

let echoInstance: any = null;

export const initEcho = (token: any) => {
  window.Pusher = Pusher;
  Pusher.logToConsole = true; // bật log khi dev

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: "6566ceb036dfe6372962",
    cluster: "ap1",
    forceTLS: true,
    authEndpoint: "http://localhost:8000/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token || ""}`,
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
