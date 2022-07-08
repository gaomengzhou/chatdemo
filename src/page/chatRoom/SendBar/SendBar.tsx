import { Input, Toast } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { sedMsg } from 'redux/chatRoom/slice';
import { useAppDispatch } from 'redux/hook';
import socket from 'utils/websocket/Websocket';
import { ReactComponent as SendMsg } from 'assets/images/icon-send.svg';

import { sleep } from 'utils/tools/method';
import styles from './SendBar.module.scss';
import Bet from '../component/Bet/Bet';
import ODD from '../component/ODD/ODD';
import BaiJiaLe from '../component/BaiJiaLe/BaiJiaLe';
import NiuNiu from '../component/NiuNiu/NiuNiu';
import HashNiuNiu from '../component/HashNiuNiu/HashNiuNiu';

const show = false;

function SendBar() {
  // 聊天信息
  const [value, setValue] = useState<string>('');
  // 显示隐藏投注
  const [showBet, setShowBet] = useState(false);
  // 计算Bet组件高度
  const [betHeight, setBetHeight] = useState(0);
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
    dispatch(
      sedMsg({
        id: new Date().getTime(),
        messageText: value,
        type: 1,
        nickName: '自己',
      })
    );
    socket.send(value);
    setValue('');
  };

  useEffect(() => {
    const main = document.querySelector('.scroll') as HTMLDivElement;
    main.onclick = () => {
      setShowBet(false);
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector('.scroll') as HTMLDivElement;
    let timer: any = null;
    if (showBet && betHeight > 0) {
      console.log('betHeight', betHeight);
      main.style.height = `calc(100% - 6rem - ${betHeight / 10}rem)`;
      timer = setTimeout(() => {
        main.scrollTop = main.scrollHeight;
      }, 1000 * 0.1);
    } else {
      main.style.height = `calc(100% - 6rem)`;
      main.scrollTop = main.scrollHeight;
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showBet, betHeight]);

  // 投注
  const toBet = async () => {
    setShowBet(!showBet);
    await sleep(110);
    const height = (document.querySelector('.betbox') as HTMLDivElement)
      .offsetHeight;
    setBetHeight(height);
  };

  return (
    <div className={styles.container}>
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
        {/* <Emoji style={{ width: '3rem', height: '3rem' }} /> */}
        <SendMsg style={{ width: '3rem', height: '3rem' }} onClick={sendText} />
      </div>
      <Bet showBet={showBet} isHashNiuNiu={false}>
        <>
          {/* 单双 */}
          {show ? <ODD /> : undefined}
          {/* 百家乐 */}
          {show ? <BaiJiaLe /> : undefined}
          {/* 牛牛 */}
          {show ? <NiuNiu /> : undefined}
          {/* 哈希牛牛 */}
          {!show ? <HashNiuNiu /> : undefined}
        </>
      </Bet>
    </div>
  );
}
export default SendBar;
