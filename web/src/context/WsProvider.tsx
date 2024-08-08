import { createContext, ReactNode, useEffect, useRef, useState } from "react";

type WsData = {
  type: "control";
  direction: number;
  speed: number;
};

type SendWsData = <T extends WsData>(msg: T) => void;

type WsState = {
  ready: boolean;
  send: SendWsData;
  msg: string;
};

const WsContext = createContext<WsState>({
  ready: false,
  send: () => {},
  msg: "",
});

const WsProvider = ({ children }: { children?: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);

  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const socket = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}`,
    );

    socket.onopen = () => setReady(true);
    socket.onclose = () => setReady(false);
    socket.onmessage = (e) => setMsg(e.data);

    ws.current = socket;

    return () => socket.close();
  }, []);

  return (
    <WsContext.Provider
      value={{
        ready,
        msg,
        send: (val: WsData) => ws.current?.send(JSON.stringify(val)),
      }}
    >
      {children}
    </WsContext.Provider>
  );
};

export { WsContext, WsProvider };
export type { WsData, SendWsData, WsState };
