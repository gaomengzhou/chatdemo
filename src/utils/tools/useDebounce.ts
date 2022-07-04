import { useEffect, useState } from 'react';

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

export const sleep = (delay = 1000): Promise<boolean> =>
  new Promise((resolve): void => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
