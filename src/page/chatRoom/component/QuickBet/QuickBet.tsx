import { Toast } from 'antd-mobile';
import { ReactComponent as Refresh } from 'assets/images/refresh.svg';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  openBetConfrmModal,
  setBetConfirmPayload,
  setInitalsendBarData,
} from 'redux/chatRoom/slice';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { useThrottleFn } from 'utils/tools/method';
import styles from './QuickBet.module.scss';

const QuickBet: React.FC<{
  isDisable?: boolean;
  betInfo: { gameName: string; bet: string };
  setBetInfo: Dispatch<
    SetStateAction<{
      gameName: string;
      bet: string;
    }>
  >;
}> = ({ isDisable = false, betInfo, setBetInfo }) => {
  // 是否清除所选数据
  const initialSendBarData = useAppSelector(
    (s) => s.chatData.initialSendBarData
  );
  const dispatch = useAppDispatch();
  // 节流
  const throttleFn = useThrottleFn();
  // 超出金额范围
  const [showError, setShowError] = useState(false);
  // 是否聚焦
  const [isOnFocus, setIsOnFocus] = useState(false);
  // Input框里的金额
  const [amount, setAmount] = useState<string | undefined | number>('');
  // 快捷金额
  const [dataSource, setDataSource] = useState([
    { num: 10, id: 1, checked: false },
    { num: 20, id: 2, checked: false },
    { num: 40, id: 3, checked: false },
    { num: 80, id: 4, checked: false },
    { num: 100, id: 5, checked: false },
  ]);

  // 快捷金额初始值
  const currAmount = useRef(0);

  // 是否清除所选数据
  useEffect(() => {
    if (!initialSendBarData) return;
    const arr = dataSource.map((item) => {
      item.checked = false;
      return item;
    });
    setDataSource(arr);
    setAmount('');
    currAmount.current = 0;
    setBetInfo({ ...betInfo, bet: '' });
    dispatch(setInitalsendBarData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSendBarData]);

  // 输入框监听传来的props赔率
  useEffect(() => {
    setAmount(betInfo.bet);
    currAmount.current = 0;
    const arr = dataSource.map((item) => {
      item.checked = false;
      return item;
    });
    setDataSource(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betInfo]);

  // 监听input状态,手动点击快捷金额只有在这里监听，顺便代替onInput Event。
  useEffect(() => {
    if ((amount && +amount < 10) || (amount && +amount > 20100)) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [amount]);

  // 选择金额
  const selectAmount = (data: {
    num: number;
    id: number;
    checked: boolean;
  }): void => {
    currAmount.current += data.num;
    setAmount(currAmount.current + (betInfo.bet || ''));

    const arr = dataSource.map((item) => {
      item.checked = item.id === data.id;
      return item;
    });
    setDataSource(arr);
  };

  // 输入金额
  const onChangeAmount = (e: any) => {
    setAmount(e.target.value);
    const arr = dataSource.map((item) => {
      item.checked = false;
      return item;
    });
    setDataSource(arr);
  };

  // 确认提交
  const modalAlert = () => {
    if (showError) return Toast.show('超出金额范围');
    /** 存储下注信息到Redux
     * @param gameName 投注游戏名称
     * @param betName 投注项
     * @param betAmount 投注金额
     * @param walletAddress 我的钱包地址
     * @param betAddress 投注地址
     */
    dispatch(
      setBetConfirmPayload({
        gameName: '百人牛牛',
        betName: betInfo.gameName,
        betAmount: amount,
        walletAddress: 'rwerwer23r32r',
        betAddress: 'werwerr33232323',
      })
    );
    // 打开确认下注弹框
    dispatch(openBetConfrmModal(true));
  };

  return (
    <div className={`${styles['quick-bet']}`}>
      <div className={styles.inpdiv}>
        <input
          className={`${isOnFocus && styles.onFocus} ${
            showError && styles.onwrong
          }`}
          type='number'
          value={amount}
          onInput={onChangeAmount}
          placeholder='输入投注金额(10-20100)'
          onFocus={() => setIsOnFocus(true)}
          onBlur={() => setIsOnFocus(false)}
        />
        <span className={`${showError && styles['show-text']}`}>
          超出金额范围
        </span>
      </div>

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
        {dataSource.map((item) => {
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
    </div>
  );
};
export default QuickBet;
