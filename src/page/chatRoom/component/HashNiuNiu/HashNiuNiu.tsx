import { useState } from 'react';
import QuickBet from '../QuickBet/QuickBet';
import styles from './HashNiuNiu.module.scss';

function HashNiuNiu() {
  // 是否disable Input框
  const [isDisable] = useState(false);
  const [data] = useState({ name: '闲家', id: 1, checked: true });

  return (
    <>
      <div className={styles.main}>
        <p>投注项：</p>
        <div className={`${styles.oddbtn} ${data.checked && styles.active}`}>
          {data.name}
        </div>
      </div>
      <QuickBet isDisable={isDisable} />
    </>
  );
}
export default HashNiuNiu;
