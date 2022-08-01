import { Input, Toast } from 'antd-mobile';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { sedMsg, setBetStatus } from 'redux/chatRoom/slice';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import socket from 'utils/websocket/Websocket';
import { ReactComponent as SendMsg } from 'assets/images/icon-send.svg';
import styles from './SendBar.module.scss';
import Bet from '../component/Bet/Bet';
import ODD from '../component/ODD/ODD';
import TigerBaiJiaLe from '../component/TigerBaiJiaLe/TigerBaiJiaLe';
import NiuNiu100 from '../component/NiuNiu100/NiuNiu100';
import HashNiuNiu from '../component/HashNiuNiu/HashNiuNiu';

const SendBar: React.FC<{
  emptyMsg: boolean;
  setEmptyMsg: Dispatch<SetStateAction<boolean>>;
  timeStamp: MutableRefObject<string>;
}> = ({ emptyMsg, setEmptyMsg, timeStamp }) => {
  const { walletName, address } = useAppSelector((s) => s.chatData.walletInfo);
  const id = window.location.href.split('?id=')[1] || 1;
  const [showBtn, setShowBtn] = useState(true);
  // 聊天信息
  const [value, setValue] = useState<string>('');
  // 显示隐藏投注
  const showBet = useAppSelector((s) => s.chatData.showBet);
  const walletInfo = useAppSelector((s) => s.chatData.walletInfo);
  const currentGame = (channelType: string) => {
    // if (!groupName) return;
    switch (channelType) {
      case '1':
        return <ODD />;
      case '3':
        return <TigerBaiJiaLe />;
      case '4':
        return <NiuNiu100 />;
      case '2':
        return <HashNiuNiu />;
      default:
        return <NiuNiu100 />;
    }
  };
  // 为1是官方客服地址，0则不是
  // const userTypeFlag = walletInfo.userType === '1';
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
      address,
      nickName: walletName || '下载APP发消息才有名字',
      userType: walletInfo.userType, // 增加客服类型
      channelType: walletInfo.channelType,
      messageType: -1,
    };
    if (emptyMsg) {
      setEmptyMsg(false);
      timeStamp.current = `${params.id}`;
    }
    dispatch(sedMsg(params));
    socket.send(JSON.stringify(params));
    setValue('');
  };

  useEffect(() => {
    const main = document.querySelector('.scroll') as HTMLDivElement;
    main.onclick = () => {
      main.style.scrollBehavior = 'smooth';
      dispatch(setBetStatus(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id === 0 || +id === -1) {
      setShowBtn(false);
    } else {
      setShowBtn(true);
    }
  }, [id]);
  useLayoutEffect(() => {
    const main = document.querySelector('.scroll') as HTMLDivElement;
    if (!showBet) {
      main.style.height = `calc(100% - 6rem)`;
      main.scrollTop = main.scrollHeight;
    }
  }, [showBet]);

  // 投注
  const toBet = async () => {
    dispatch(setBetStatus(!showBet));
  };

  return (
    <div
      className={`${styles.container} ${
        showBet && styles['auto-height-universal']
      }`}
    >
      <div className={styles['send-input']}>
        {showBtn && (
          <div className={styles.bet} onClick={toBet}>
            {showBet ? '收起' : '投注'}
          </div>
        )}

        <Input
          style={{
            border: '1px solid #f1eeee',
            borderRadius: '0.3rem',
            padding: '0 0.5rem',
            backgroundColor: '#f6f6f6',
            height: '3rem',
            width: showBtn ? 'auto' : '85%',
          }}
          value={value}
          onChange={setValue}
        />
        <SendMsg style={{ width: '3rem', height: '3rem' }} onClick={sendText} />
      </div>
      <Bet showBet={showBet}>{currentGame(walletInfo.channelType)}</Bet>
    </div>
  );
};
export default SendBar;
