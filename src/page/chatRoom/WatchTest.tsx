import { useState } from 'react';
import useWatch from 'utils/tools/useWatch';

function WatchTest() {
  const [count, setCount] = useState(0);

  const stop = useWatch(
    count,
    (prevCount) => {
      console.log('上一个计数: ', prevCount);
      console.log('当前计数: ', count);
    },
    { immediate: false }
  );

  const add = () => setCount(count + 1);
  return (
    <div>
      <button
        type='button'
        style={{ width: 50, margin: 20 }}
        onClick={add}
        className='btn'
      >
        ADD
      </button>
      <button type='button' onClick={stop} className='btn'>
        STOP
      </button>
    </div>
  );
}
export default WatchTest;
