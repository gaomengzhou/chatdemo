import { useState } from 'react';
import QuickBet from '../QuickBet/QuickBet';
import styles from './HashNiuNiu.module.scss';

function HashNiuNiu() {
  // 是否disable Input框
  const [isDisable] = useState(false);
  const [data] = useState({ name: '哈希牛牛', id: 1, checked: true });
  // 玩法赔率
  const [betInfo, setBetInfo] = useState({ gameName: '哈希牛牛', bet: '' });
  return (
    <>
      <div className={styles.main}>
        <div className={`${styles.oddbtn} ${data.checked && styles.active}`}>
          {data.name}
        </div>
      </div>
      <QuickBet
        isDisable={isDisable}
        betInfo={betInfo}
        setBetInfo={setBetInfo}
      />
    </>
  );
}
export default HashNiuNiu;
