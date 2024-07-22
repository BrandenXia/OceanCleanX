import { useCallback, useEffect, useState } from "react";
import { round } from "@/utils.ts";

type SetFunc<T> = (_: T) => T;

const PRECISION = 3;

const RESET_FACTOR = 0.8;
const RESET_INTERVAL = 50;
const INC_SPEED = 0.1;

const MAX = 1;
const MIN = -1;

const reset = (prev: number) => {
  if (Math.abs(prev) < 0.01) return 0;
  return prev * RESET_FACTOR;
};

const _inc = (prev: number, inc: number) => {
  const next = prev + inc;

  if (next > MAX) return MAX;
  if (next < MIN) return MIN;

  return next;
};

const inc_positive = (prev: number) => _inc(prev, INC_SPEED);
const inc_negative = (prev: number) => _inc(prev, -INC_SPEED);

const useControl = () => {
  const [speed, _setSpeed] = useState(0);
  const [direction, _setDirection] = useState(0);
  const setSpeed = useCallback((func: SetFunc<number>) => {
    _setSpeed((prev) => round(func(prev), PRECISION));
  }, []);
  const setDirection = useCallback((func: SetFunc<number>) => {
    _setDirection((prev) => round(func(prev), PRECISION));
  }, []);

  const [keys, _setKeys] = useState(() => new Set<string>());
  const setKeys = (func: (_: string) => void, val: string) =>
    _setKeys((prev) => {
      const next = new Set(prev);
      func.call(next, val);
      return next;
    });

  const [id, setId] = useState<number | null>(null);
  const handler = useCallback(() => {
    setSpeed(reset);
    setDirection(reset);
  }, [setSpeed, setDirection]);
  const startReset = useCallback(() => {
    if (id) {
      clearInterval(id);
      setId(null);
    }

    const new_id = setInterval(handler, RESET_INTERVAL);
    setId(new_id);
  }, [handler, id]);

  const handleKeys = useCallback(() => {
    if (keys.has("ArrowUp") || keys.has("w")) setSpeed(inc_positive);
    if (keys.has("ArrowDown") || keys.has("s")) setSpeed(inc_negative);
    if (keys.has("ArrowLeft") || keys.has("a")) setDirection(inc_negative);
    if (keys.has("ArrowRight") || keys.has("d")) setDirection(inc_positive);

    startReset();
  }, [keys, setDirection, setSpeed, startReset]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      setKeys(Set.prototype.add, event.key);
      handleKeys();
    },
    [handleKeys],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      setKeys(Set.prototype.delete, event.key);
      handleKeys();
    },
    [handleKeys],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, id]);

  return { speed, direction };
};

export default useControl;
