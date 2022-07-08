import { useState } from 'react';
import QuickBet from '../QuickBet/QuickBet';
import styles from './ODD.module.scss';

function ODD() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  const [items, setItems] = useState([
    { name: '单', id: 1, checked: false },
    { name: '双', id: 2, checked: false },
  ]);

  const selectdOne = (id: any) => {
    const arr = items.map((item) => {
      if (item.id === id) {
        if (!item.checked) item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    });
    setIsDisable(false);
    setItems(arr);
  };
  return (
    <>
      <div className={styles.main}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => selectdOne(item.id)}
            className={`${styles.oddbtn} ${item.checked && styles.active}`}
          >
            {item.name}
          </div>
        ))}
      </div>
      <QuickBet isDisable={isDisable} />
    </>
  );
}
export default ODD;
