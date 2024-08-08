import { useEffect, useRef } from "react";
import { throttle } from "@/utils.ts";
import useWs from "@/hook/useWs.ts";
import type { WsState } from "@/context/WsProvider";

const UPDATE_INTERVAL = 100;

const _remote = (ws: WsState, speed: number, direction: number) => {
  if (ws.ready) ws.send({ type: "control", speed, direction });
};

const useRemote = (speed: number, direction: number) => {
  const wsState = useWs();

  const remote = useRef(throttle(_remote, UPDATE_INTERVAL));

  useEffect(
    () => remote.current(wsState, speed, direction),
    [speed, direction, wsState],
  );
};

export default useRemote;
