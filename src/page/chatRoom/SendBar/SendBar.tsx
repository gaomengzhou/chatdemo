import { Input, Toast } from 'antd-mobile';
import { useEffect, useLayoutEffect, useState } from 'react';
import { sedMsg, setBetStatu } from 'redux/chatRoom/slice';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import socket from 'utils/websocket/Websocket';
import { ReactComponent as SendMsg } from 'assets/images/icon-send.svg';
import styles from './SendBar.module.scss';
import Bet from '../component/Bet/Bet';
import ODD from '../component/ODD/ODD';
import BaiJiaLe from '../component/BaiJiaLe/BaiJiaLe';
import NiuNiu100 from '../component/NiuNiu100/NiuNiu100';
import HashNiuNiu from '../component/HashNiuNiu/HashNiuNiu';

const show = false;

function SendBar(props: any) {
  const { walletInfo } = props;
  console.log(walletInfo);
  // 聊天信息
  const [value, setValue] = useState<string>('');
  // 显示隐藏投注
  const showBet = useAppSelector((s) => s.chatData.showBet);

  const dispatch = useAppDispatch();
  const sendText = async (): Promise<void> => {
    if (!value) {
      Toast.show({
        content: '消息不能为空',
        afterClose: () => {
          console.log('after');
        },
      });
      return;
    }
    const params = {
      id: new Date().getTime(),
      messageText: value,
      type: 1,
      nickName: '自己',
    };
    dispatch(sedMsg(params));
    socket.send(JSON.stringify(params));
    setValue('');
  };

  useEffect(() => {
    const main = document.querySelector('.scroll') as HTMLDivElement;
    main.onclick = () => {
      dispatch(setBetStatu(false));
    };
  }, [dispatch]);

  useLayoutEffect(() => {
    const timer: any = null;
    const main = document.querySelector('.scroll') as HTMLDivElement;
    if (showBet) {
      // main.style.height = `calc(100% - 6rem - 35.5rem)`;
      // timer = setTimeout(() => {
      //   main.scrollTop = main.scrollHeight;
      // }, 1000 * 0.3);
    } else {
      main.style.height = `calc(100% - 6rem)`;
      main.scrollTop = main.scrollHeight;
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, showBet]);

  // 投注
  const toBet = async () => {
    dispatch(setBetStatu(!showBet));
  };

  return (
    <div
      className={`${styles.container} ${
        showBet && styles['auto-height-universal']
      }`}
    >
      <div className={styles['send-input']}>
        <div className={styles.bet} onClick={toBet}>
          {showBet ? '取消' : '投注'}
        </div>
        <Input
          style={{
            border: '1px solid #f1eeee',
            borderRadius: '0.3rem',
            padding: '0 0.5rem',
            backgroundColor: '#f6f6f6',
            height: '3rem',
            width: 'auto',
          }}
          value={value}
          onChange={setValue}
        />
        <SendMsg style={{ width: '3rem', height: '3rem' }} onClick={sendText} />
      </div>
      <Bet showBet={showBet}>
        <>
          {/* 单双 */}
          {show ? <ODD /> : undefined}
          {/* 百家乐 */}
          {show ? <BaiJiaLe /> : undefined}
          {/* 百人牛牛 */}
          {show ? <NiuNiu100 /> : undefined}
          {/* 哈希牛牛 */}
          {!show ? <HashNiuNiu /> : undefined}
        </>
      </Bet>
    </div>
  );
}
export default SendBar;
