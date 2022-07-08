import { useState } from 'react';
import QuickBet from '../QuickBet/QuickBet';
import styles from './NiuNiu.module.scss';

function NiuNiu() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  const [data, setData] = useState([
    { name: '上庄', id: 1, checked: false },
    { name: '闲A', id: 2, checked: false },
    { name: '闲B', id: 3, checked: false },
    { name: '闲C', id: 4, checked: false },
    { name: '闲D', id: 5, checked: false },
    { name: '吃A', id: 6, checked: false },
    { name: '吃B', id: 7, checked: false },
    { name: '吃C', id: 8, checked: false },
    { name: '吃D', id: 9, checked: false },
  ]);

  const choose = (id: number) => {
    const arr = data.map((item) => {
      if (item.id === id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    });
    setIsDisable(false);
    setData(arr);
  };

  return (
    <>
      <div className={styles.main}>
        {data.map((item) => (
          <div
            onClick={() => choose(item.id)}
            className={`${styles.btn} ${item.checked && styles.active}`}
            key={item.id}
          >
            {item.name}
          </div>
        ))}
      </div>
      <QuickBet isDisable={isDisable} />
    </>
  );
}
export default NiuNiu;
