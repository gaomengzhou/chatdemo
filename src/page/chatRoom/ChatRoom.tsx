import { Divider, Mask } from 'antd-mobile';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import {
  getChatHistory,
  openBetConfirmModal,
  sedMsg,
  setWalletInfo,
} from 'redux/chatRoom/slice';
import socket from 'utils/websocket/Websocket';
import { ReactComponent as ToBottom } from 'assets/images/icon-bottmo.svg';
import { RootState } from 'redux/store';
import styles from './ChatRoom.module.scss';
import MessageList from './component/MessageList/MessageList';
import LoadingStatus from './component/LoadingStatu/LoadingStatus';
import SendBar from './SendBar/SendBar';
import { isAndroid, loadBridge } from '../../utils/tools/tool';
import BetModal from './component/BetModal/BetModal';

const ChatRoom: React.FC = (): ReactElement => {
  // 判断频道是0条消息的时候的Flag标记
  const [emptyMsg, setEmptyMsg] = useState(false);
  // 分页请求后端需要的时间戳字符串
  const timeStamp = useRef('');
  const betConfirmModal = useAppSelector(
    (s: RootState) => s.chatData.betConfirmModal
  );
  const id = window.location.href.split('?id=')[1] || 1;
  const dispatch = useAppDispatch();
  const showBet = useAppSelector((s: RootState) => s.chatData.showBet);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(true);
  const list = useAppSelector((s: RootState) => s.chatData.chatList);
  // 确认下注信息弹框的数据
  const betConfirmPayload = useAppSelector((s) => s.chatData.betConfirmPayload);
  const queryNativeWalletInfoCallback = (response: any) => {
    if (response) {
      dispatch(setWalletInfo(JSON.parse(response)));
    }
  };

  // 显示到底部的按钮
  const [showGoToBottom, setShowGoToBottom] = useState(false);
  const queryNativeWalletInfo = () => {
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridge((bridge: any) => {
        bridge.callHandler(
          'queryNativeWalletInfo',
          { key: 'value' },
          (response: any) => {
            console.log('ios,queryNativeWalletInfo');
            // const { result } = response;
            dispatch(setWalletInfo(response));
            // setWalletInfo(result);
          }
        );
      });
    }
    if (isAndroid()) {
      (window as any).queryNativeWalletInfoCallback =
        queryNativeWalletInfoCallback;
      loadBridge((bridge: any) => {
        bridge.queryNativeWalletInfo();
      });
    }
  };
  // 挂载 是否在ios和 安卓中
  useEffect(() => {
    queryNativeWalletInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 接受的url发生变化在这里先退订
  useEffect(() => {
    socket.connect();
    return () => {
      socket.ws?.close();
      window.location.reload();
    };
  }, [id]);
  // 接收到的消息
  useEffect(() => {
    (socket.ws as WebSocket).onmessage = async (
      msg: MessageEvent
    ): Promise<void> => {
      await socket.reset();
      socket.start();
      if (msg.data === 'success') return;
      const data = JSON.parse(msg.data);
      console.log(data);
      if (emptyMsg) {
        setEmptyMsg(false);
        timeStamp.current = `${data.id}`;
      }
      dispatch(sedMsg(data));
    };
    const timer = setTimeout((): void => {
      const scroll = document.querySelector('.scroll') as HTMLDivElement;
      scroll.style.scrollBehavior = 'smooth';
      if (showGoToBottom) return;
      scroll.scrollTo(0, scroll.scrollHeight);
    }, 0);
    return (): void => {
      clearTimeout(timer);
    };
    // 只监听list emptyMsg避免重复渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, emptyMsg]);

  // 查询历史记录
  useEffect(() => {
    let timer: any;
    dispatch(getChatHistory({ page: 1, size: 10 }))
      .unwrap()
      .then((arr: any): void => {
        if (arr.data.records.length > 0) {
          timeStamp.current = `${arr.data.records[0].id}`;
        } else {
          setEmptyMsg(true);
        }
        if (arr.data.records.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        timer = setTimeout((): void => {
          const scroll = document.querySelector('.scroll') as HTMLDivElement;
          scroll.scrollTo(0, scroll.scrollHeight);
        }, 0);
      });
    return (): void => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  // 分页查询历史记录
  useEffect(() => {
    const scrolls = document.querySelector('.scroll') as HTMLDivElement;
    scrolls.style.scrollBehavior = 'unset';
    const getMore = async (): Promise<void> => {
      scrolls.onscroll = () => {
        const calcHeight =
          scrolls.scrollHeight - scrolls.scrollTop - scrolls.offsetHeight;
        if (calcHeight >= 65) {
          setShowGoToBottom(true);
        } else {
          setShowGoToBottom(false);
        }
        // 注意：不能写在calcHeight上面，calcHeight是用来显示隐藏到底部按钮的
        if (finished) return;
        const beforeHeight = (
          document.querySelector('.scroll') as HTMLDivElement
        ).scrollHeight;
        if (scrolls.scrollTop === 0 && loading) {
          setLoading(false);
          setPage(page + 1);
          dispatch(
            getChatHistory({
              page,
              size: 10,
              isPullDown: true,
              timeStamp: timeStamp.current,
            })
          )
            .unwrap()
            .then((obj: any): void => {
              if (obj.data.records.length > 0) {
                timeStamp.current = `${obj.data.records[0].id}`;
              }
              if (obj.data.records.length < 10) {
                setHasMore(false);
                setFinished(true);
              }
              setLoading(true);
              const afterHeight = (
                document.querySelector('.scroll') as HTMLDivElement
              ).scrollHeight;
              scrolls.scrollTo(0, afterHeight - beforeHeight);
            });
        }
      };
    };
    scrolls.addEventListener('touchmove', getMore);
    return (): void => {
      scrolls.removeEventListener('touchmove', getMore);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const goToBottom = () => {
    const scrolls = document.querySelector('.scroll') as HTMLDivElement;
    scrolls.style.scrollBehavior = 'smooth';
    scrolls.scrollTop = scrolls.scrollHeight - scrolls.offsetHeight;
  };
  return (
    <div className={styles['background-color']}>
      <div className={`${styles.container}`}>
        <div
          className={`${styles.main} ${showBet && styles['move-main']} scroll`}
        >
          <LoadingStatus hasMore={hasMore} list={list} />
          <Divider
            style={{
              opacity: 0,
            }}
          />
          {/* 聊天记录 */}
          <MessageList list={list} />
        </div>
        {/* 发送栏 */}
        <SendBar
          emptyMsg={emptyMsg}
          setEmptyMsg={setEmptyMsg}
          timeStamp={timeStamp}
        />
      </div>
      {showGoToBottom && (
        <ToBottom
          className={`${styles['to-bottom']} ${
            showBet && styles['to-bottom-betopen']
          }`}
          onClick={goToBottom}
        />
      )}
      <Mask
        visible={betConfirmModal}
        onMaskClick={() => dispatch(openBetConfirmModal(false))}
      >
        <BetModal
          title='投注确认'
          visible={betConfirmModal}
          betName={betConfirmPayload.betName}
          betAmount={betConfirmPayload.betAmount}
        />
      </Mask>
    </div>
  );
};
export default ChatRoom;
