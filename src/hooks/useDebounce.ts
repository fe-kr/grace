import { useRef, useCallback, useEffect } from "react";

const useDebounce = <T extends () => unknown>(func: T, wait: number) => {
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeout.current);
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(func, wait, ...args);
    },
    [func, wait],
  );
};

export default useDebounce;
