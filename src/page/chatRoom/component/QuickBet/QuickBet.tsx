import { Input, Mask } from 'antd-mobile';
import { ReactComponent as Refresh } from 'assets/images/refresh.svg';
import { useState } from 'react';
import { useThrottleFn } from 'utils/tools/method';
import BetModal from '../BetModal/BetModal';
import styles from './QuickBet.module.scss';

const QuickBet: React.FC<{ isDisable?: boolean }> = ({ isDisable = false }) => {
  const throttleFn = useThrottleFn();
  // Input框里的金额
  const [amount, setAmount] = useState<string | undefined>('');
  // 快捷金额
  const [money, setMoney] = useState([
    { num: 10, id: 1, checked: false },
    { num: 20, id: 2, checked: false },
    { num: 40, id: 3, checked: false },
    { num: 80, id: 4, checked: false },
    { num: 100, id: 5, checked: false },
  ]);
  const [visible, setVisible] = useState(false);
  // 选择金额
  const selectAmount = (data: {
    num: number;
    id: number;
    checked: boolean;
  }): void => {
    setAmount(data.num.toString());
    const arr = money.map((item) => {
      if (item.id === data.id) {
        item.checked = !item.checked;
        if (!item.checked) {
          setAmount('');
        }
      } else {
        item.checked = false;
      }
      return item;
    });
    setMoney(arr);
  };
  // 输入金额
  const onChangeAmount = (val: string) => {
    setAmount(val);
    const arr = money.map((item) => {
      item.checked = false;
      return item;
    });
    setMoney(arr);
  };

  // 确认提交
  const modalAlert = () => {
    setVisible(true);
  };

  return (
    <div className={`${styles['quick-bet']}`}>
      <div className={styles.title}>
        <div className={styles.left}>选择快捷投注金额</div>
        <div className={styles.right}>
          <p>
            钱包余额：<span>{1022.32234561}</span>
          </p>
          <Refresh />
        </div>
      </div>
      <div className={styles.amount}>
        {money.map((item) => {
          return (
            <div
              className={`${item.checked && styles.active}`}
              onClick={() => throttleFn(() => selectAmount(item), 500)}
              style={{ width: '6.5rem' }}
              key={item.id}
            >
              {item.num}
            </div>
          );
        })}
      </div>
      <div className={styles.payInput}>
        <Input
          value={amount}
          onChange={onChangeAmount}
          style={{
            backgroundColor: '#f6f6f6',
            width: '25rem',
            height: '3rem',
            border: '0.1rem solid #e9e9e9',
            fontSize: '1rem',
            paddingLeft: '0.5rem',
          }}
          type='number'
          min={10}
          max={20100}
          placeholder='输入投注金额(10-20100)'
        />
        <button
          onClick={modalAlert}
          disabled={isDisable || !amount}
          className={`${
            (isDisable && styles.disable) || (!amount && styles.disable)
          }`}
        >
          提交
        </button>
      </div>
      <Mask
        visible={visible}
        afterClose={() => console.log('关闭')}
        onMaskClick={() => setVisible(false)}
      >
        <BetModal
          title='投注确认'
          gameName='欢乐单双'
          visible={visible}
          betItem='双'
          betAmount='100.02'
          walletAddress='0xwefi23jio32jdioj32iojd2o3id'
          betAddress='0xwefi23sdfsdfsd3id'
          setVisible={setVisible}
        />
      </Mask>
    </div>
  );
};
export default QuickBet;
