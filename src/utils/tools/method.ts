import { useEffect, useState } from 'react';

export const sleep = (delay = 1000): Promise<boolean> =>
  new Promise((resolve): void => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });

// 防抖
export const useDebounce = <T>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout((): void => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

// 函数节流
export const useThrottleFn = () => {
  const [flag, setFlag] = useState(true);
  return async (fn: () => unknown, delay = 1000) => {
    if (!flag) return;
    fn();
    setFlag(false);
    await sleep(delay);
    setFlag(true);
  };
};
