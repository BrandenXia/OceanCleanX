import { useEffect, useRef } from "react";
import { round, throttle } from "@/utils.ts";

const PRECISION = 3;
const UPDATE_INTERVAL = 100;

const _remote = (ws: WebSocket, speed_: number, direction_: number) => {
  if (ws.readyState === WebSocket.OPEN) {
    const speed = round(speed_, PRECISION);
    const direction = round(direction_, PRECISION);
    ws.send(JSON.stringify({ speed, direction }));
  }
};

const useRemote = (speed: number, direction: number) => {
  const ws = useRef<WebSocket | null>(null);

  const remote = useRef(throttle(_remote, UPDATE_INTERVAL));

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.8.174:9876");

    const wsCurrent = ws.current;

    wsCurrent.onopen = () => console.log("Remote control server connected");
    wsCurrent.onclose = () => console.log("Remote control server disconnected");

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (ws.current) remote.current(ws.current, speed, direction);
  }, [speed, direction]);
};

export default useRemote;
