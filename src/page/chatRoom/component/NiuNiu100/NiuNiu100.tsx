import { useEffect, useState } from 'react';
import { useAppSelector } from 'redux/hook';
import QuickBet from '../QuickBet/QuickBet';
import styles from './NiuNiu100.module.scss';

function NiuNiu100() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  // 是否清除所选数据
  const initalsendBarData = useAppSelector(
    (s) => s.chatData.initialSendBarData
  );
  const [data, setData] = useState([
    { name: '上庄', id: 1, checked: false, bet: '.05' },
    { name: '闲A', id: 2, checked: false, bet: '.01' },
    { name: '闲B', id: 3, checked: false, bet: '.02' },
    { name: '闲C', id: 4, checked: false, bet: '.03' },
    { name: '闲D', id: 5, checked: false, bet: '.04' },
    { name: '吃A', id: 6, checked: false, bet: '.06' },
    { name: '吃B', id: 7, checked: false, bet: '.07' },
    { name: '吃C', id: 8, checked: false, bet: '.08' },
    { name: '吃D', id: 9, checked: false, bet: '.09' },
  ]);
  // 玩法赔率
  const [betInfo, setBetInfo] = useState({ gameName: '', bet: '' });

  useEffect(() => {
    if (!initalsendBarData) return;
    const arr = data.map((item) => {
      item.checked = false;
      return item;
    });
    setData(arr);
    setIsDisable(true);
    // 这里无需调用 dispatch(setInitialSendBarData(false))
    // 因为在QuickBet组件有调用，避免重复调用。

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalsendBarData]);

  const choose = (source: typeof data[0]) => {
    setBetInfo({ gameName: source.name, bet: source.bet });
    const arr = data.map((item) => {
      item.checked = item.id === source.id;
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
            onClick={() => choose(item)}
            className={`${styles.btn} ${item.checked && styles.active}`}
            key={item.id}
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
export default NiuNiu100;
