import { Toast } from 'antd-mobile';
import { ReactComponent as Refresh } from 'assets/images/refresh.svg';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  openBetConfirmModal,
  setBetConfirmPayload,
  setInitialSendBarData,
  setWalletBalance,
} from 'redux/chatRoom/slice';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { useThrottleFn } from 'utils/tools/method';
import { getPosition, loadBridge, isAndroid } from 'utils/tools/tool';
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
  // 是否旋转初始值
  const [rotate, setRotate] = useState(false);
  const dispatch = useAppDispatch();
  // 安卓刷新余额回调
  const queryNativeBalanceCallback = (response: any) => {
    if (response) {
      setRotate(false);
      dispatch(setWalletBalance(response));
      console.log('response');
    }
  };
  // 是否清除所选数据
  const initalsendBarData = useAppSelector(
    (s) => s.chatData.initialSendBarData
  );
  // 从原生获取钱包余额
  const walletBalance = useAppSelector((s) => s.chatData.walletBalance);
  const walletInfo = useAppSelector((s) => s.chatData.walletInfo);
  // 节流
  const throttleFn = useThrottleFn();
  // 超出金额范围
  const [showError, setShowError] = useState({
    flag: false,
    text: '超出金额范围',
  });
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

  // 刷新按钮
  const refreshBtn = useRef(null);
  // 是否清除所选数据
  useEffect(() => {
    if (!initalsendBarData) return;
    const arr = dataSource.map((item) => {
      item.checked = false;
      return item;
    });
    setDataSource(arr);
    setAmount('');
    currAmount.current = 0;
    setBetInfo({ ...betInfo, bet: '' });
    dispatch(setInitialSendBarData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalsendBarData]);

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
    if (!amount) return;
    if (+amount && +amount > +walletBalance) {
      setShowError({
        flag: true,
        text: '余额不足',
      });
    } else if ((amount && +amount < 10) || (amount && +amount > 20100)) {
      setShowError({
        flag: true,
        text: '超出金额范围',
      });
    } else {
      setShowError({
        flag: false,
        text: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, walletBalance]);

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
    const val = e.target.value;
    const len = e.target.value.length;
    if (
      !/[0-9]/.test(e.nativeEvent.data) &&
      e.nativeEvent.data !== '' &&
      e.nativeEvent.data != null &&
      walletInfo.channelType !== '2'
    ) {
      // const len = e.target.value.length;
      // e.target.selectionStart = len - 3;
      // e.target.selectionEnd = len - 3;
      e.target.value = val.replace(/[^0-9]/g, '');
      return;
    }
    if (walletInfo.channelType === '2') {
      e.target.value = val
        .replace(/[^\d^.]+/g, '')
        .replace(/\.{6,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(-)*(\d+)\.(\d\d\d\d\d\d).*$/, '$1$2.$3')
        .replace(/^\./g, '');
    }

    if (
      !isDisable &&
      e.target.selectionStart > len - 3 &&
      walletInfo.channelType !== '2'
    ) {
      e.target.selectionStart = len - 3;
      e.target.selectionEnd = len - 3;
      return;
    }

    setAmount(e.target.value);
    currAmount.current = 0;
    const arr = dataSource.map((item) => {
      item.checked = false;
      return item;
    });
    setDataSource(arr);
  };

  // 聚焦输入框获取光标位置
  const onFocusPosition = (e: any) => {
    setIsOnFocus(true);
    if (isDisable) return;
    const pos = getPosition(e);
    console.log(pos);
  };
  // 点击获取光标位置
  const onClickPosition = (e: any) => {
    if (isDisable) return;
    const pos = getPosition(e);
    console.log(pos);
  };

  const controlDelete = (e: any) => {
    if (isDisable) return;
    // const { value } = e.target;
    if (+e.keyCode === 8 && walletInfo.channelType !== '2') {
      const len = e.target.value.length;
      e.target.selectionStart = len - 3;
      e.target.selectionEnd = len - 3;
    }
  };

  // 确认提交
  const modalAlert = () => {
    if (showError.flag) return Toast.show(showError.text);
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
    dispatch(openBetConfirmModal(true));
  };

  // 刷新余额
  const refreshBalance = () => {
    setRotate(true);
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridge((bridge: any) => {
        bridge.callHandler(
          'queryNativeBalance',
          { key: 'value' },
          (response: any) => {
            console.log('ios,queryNativeBalance');
            // const { result } = response;
            setRotate(false);
            dispatch(setWalletBalance(response));
            console.log(response);
            // setWalletInfo(result);
          }
        );
      });
    }

    if (isAndroid()) {
      (window as any).queryNativeBalanceCallback = queryNativeBalanceCallback;
      // loadBridege((bridge: any) => {
      //   bridge.jsCallScanID(JSON.stringify(josn));
      // });
      loadBridge((bridge: any) => {
        bridge.queryNativeBalance();
      });
    }
  };

  useEffect(() => {
    refreshBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalsendBarData]);

  return (
    <div className={`${styles['quick-bet']}`}>
      <div className={styles.inpdiv}>
        <input
          className={`${isOnFocus && styles.onFocus} ${
            showError.flag && styles.onwrong
          }`}
          type='number'
          value={amount}
          onInput={onChangeAmount}
          placeholder='USDT限额 10-20100'
          onFocus={(element: any) => onFocusPosition(element)}
          onBlur={() => setIsOnFocus(false)}
          onClick={(element: any) => onClickPosition(element)}
          onKeyDown={(element: any) => controlDelete(element)}
        />
        <span className={`${showError.flag && styles['show-text']}`}>
          {showError.text}
        </span>
      </div>

      <div className={styles.title}>
        <div className={styles.left}>选择快捷投注金额</div>
        <div className={styles.right}>
          <p>
            钱包余额(USDT)<span>：{walletBalance}</span>
          </p>
          <Refresh
            className={`${rotate && styles.transitionRotate} ${
              styles.iconRefresh
            }`}
            ref={refreshBtn}
            onClick={refreshBalance}
          />
        </div>
      </div>
      <div className={styles.amount}>
        {dataSource.map((item) => {
          return (
            <div
              className={`${item.checked && styles.active}`}
              onClick={() => throttleFn(() => selectAmount(item), 300)}
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
