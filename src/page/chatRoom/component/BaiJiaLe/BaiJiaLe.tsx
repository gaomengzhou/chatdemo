import { useEffect, useState } from 'react';
import { useAppSelector } from 'redux/hook';
import QuickBet from '../QuickBet/QuickBet';
import styles from './BaiJiaLe.module.scss';

function BaiJiaLe() {
  // 是否disable Input框
  const [isDisable, setIsDisable] = useState(true);
  // 是否清除所选数据
  const initialSendBarData = useAppSelector(
    (s) => s.chatData.initialSendBarData
  );
  const [data, setData] = useState([
    { name: '庄家', id: 1, checked: false, bet: '.01' },
    { name: '闲家', id: 2, checked: false, bet: '.02' },
    { name: '庄对子', id: 3, checked: false, bet: '.03' },
    { name: '闲对子', id: 4, checked: false, bet: '.04' },
    { name: '老虎', id: 5, checked: false, bet: '.07' },
    { name: '小老虎', id: 6, checked: false, bet: '.05' },
    { name: '大老虎', id: 7, checked: false, bet: '.06' },
    { name: '和局', id: 8, checked: false, bet: '.08' },
  ]);
  // 玩法赔率
  const [betInfo, setBetInfo] = useState({ gameName: '', bet: '' });

  useEffect(() => {
    if (!initialSendBarData) return;
    const arr = data.map((item) => {
      item.checked = false;
      return item;
    });
    setData(arr);
    setIsDisable(true);
    // 这里无需调用 dispatch(setInitalsendBarData(false))
    // 因为在QuickBet组件有调用，避免重复调用。

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSendBarData]);

  const choose = (source: typeof data[0]) => {
    setBetInfo({ gameName: source.name, bet: source.bet });
    const arr = data.map((item) => {
      if (item.id === source.id) {
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
export default BaiJiaLe;
