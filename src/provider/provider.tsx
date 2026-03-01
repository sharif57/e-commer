"use client";

import store from "@/redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { initSocket } from "@/lib/socket";

function SocketInitializer() {
  useEffect(() => {
    initSocket();
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketInitializer />
      {children}
    </Provider>
  );
}