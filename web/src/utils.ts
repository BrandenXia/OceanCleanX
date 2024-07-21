const round = (num: number, precision: number): number =>
  Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

const throttle = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): ((...args: Parameters<F>) => void) => {
  let lastTime = 0;

  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (now - lastTime >= waitFor) {
      func(...args);
      lastTime = now;
    }
  };
};

export { round, debounce, throttle };
