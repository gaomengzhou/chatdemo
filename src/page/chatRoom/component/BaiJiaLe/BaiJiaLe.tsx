import { useState } from 'react';
import QuickBet from '../QuickBet/QuickBet';
import styles from './BaiJiaLe.module.scss';

function BaiJiaLe() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  const [data, setData] = useState([
    { name: '庄家', id: 1, checked: false },
    { name: '闲家', id: 2, checked: false },
    { name: '庄对子', id: 3, checked: false },
    { name: '闲对子', id: 4, checked: false },
    { name: '老虎', id: 5, checked: false },
    { name: '小老虎', id: 6, checked: false },
    { name: '大老虎', id: 7, checked: false },
    { name: '和局', id: 8, checked: false },
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
export default BaiJiaLe;
