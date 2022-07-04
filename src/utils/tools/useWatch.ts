import { useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
type Callback<T> = (prevData: T | undefined) => void;
interface Config {
  immediate: boolean;
}

const useWatch = <T>(
  dep: T,
  callback: Callback<T>,
  config: Config = { immediate: false }
) => {
  const { immediate } = config;

  const prev = useRef<T>();
  const inited = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    const execute = () => callback(prev.current);

    if (!stop.current) {
      if (!inited.current) {
        inited.current = true;
        if (immediate) {
          execute();
        }
      } else {
        execute();
      }
      prev.current = dep;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);

  return () => {
    stop.current = true;
  };
};
export default useWatch;
