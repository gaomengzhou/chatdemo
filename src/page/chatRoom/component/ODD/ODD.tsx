import { useEffect, useState } from 'react';
import { useAppSelector } from 'redux/hook';
import QuickBet from '../QuickBet/QuickBet';
import styles from './ODD.module.scss';

function ODD() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  // 是否清除所选数据
  const initialisedBarData = useAppSelector(
    (s) => s.chatData.initialSendBarData
  );
  const [items, setItems] = useState([
    { name: '单', id: 1, checked: false, bet: '.01' },
    { name: '双', id: 2, checked: false, bet: '.02' },
  ]);
  // 玩法赔率
  const [betInfo, setBetInfo] = useState({ gameName: '', bet: '' });

  useEffect(() => {
    if (!initialisedBarData) return;
    const arr = items.map((item) => {
      item.checked = false;
      return item;
    });
    setItems(arr);
    setIsDisable(true);
    // 这里无需调用 dispatch(setInitialSendBarData(false))
    // 因为在QuickBet组件有调用，避免重复调用。

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialisedBarData]);

  const selectOne = (data: typeof items[0]) => {
    setBetInfo({ gameName: data.name, bet: data.bet });
    const arr = items.map((item) => {
      if (item.id === data.id) {
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
            onClick={() => selectOne(item)}
            className={`${styles.oddbtn} ${item.checked && styles.active}`}
          >
            {item.name}
          </div>
        ))}
      </div>
      <QuickBet
        isDisable={isDisable}
        betInfo={betInfo}
        setBetInfo={setBetInfo}
      />
    </>
  );
}
export default ODD;
