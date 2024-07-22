import { useEffect, useRef } from "react";
import { throttle } from "@/utils.ts";

const UPDATE_INTERVAL = 100;

const _remote = (ws: WebSocket, speed: number, direction: number) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ speed, direction }));
  }
};

const useRemote = (speed: number, direction: number) => {
  const ws = useRef<WebSocket | null>(null);

  const remote = useRef(throttle(_remote, UPDATE_INTERVAL));

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}`,
    );

    const wsCurrent = ws.current;

    wsCurrent.onopen = () => console.log("Remote control server connected");
    wsCurrent.onclose = () => console.log("Remote control server disconnected");

    return () => wsCurrent.close();
  }, []);

  useEffect(() => {
    if (ws.current) remote.current(ws.current, speed, direction);
  }, [speed, direction]);
};

export default useRemote;
