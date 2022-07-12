import { Divider, Mask } from 'antd-mobile';
import { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import {
  getChatHistory,
  openBetConfrmModal,
  sedMsg,
} from 'redux/chatRoom/slice';
import socket from 'utils/websocket/Websocket';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as ToBottom } from 'assets/images/icon-bottmo.svg';
import { RootState } from 'redux/store';
import styles from './ChatRoom.module.scss';
import MessageList from './component/MessageList/MessageList';
import LoadingStatu from './component/LoadingStatu/LoadingStatu';
import SendBar from './SendBar/SendBar';
import { loadBridege, isAndroid } from '../../utils/tools/tool';
import BetModal from './component/BetModal/BetModal';

interface walletInfoType {
  address: string;
  balance: string;
  groupName: string;
  walletName: string;
}
const ChatRoom: React.FC = (): ReactElement => {
  const betConfirmModal = useAppSelector(
    (s: RootState) => s.chatData.betConfirmModal
  );
  const showBet = useAppSelector((s: RootState) => s.chatData.showBet);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(true);
  const list = useAppSelector((s: any) => s.chatData.chatList);
  // 确认下注信息弹框的数据
  const betConfirmPayload = useAppSelector((s) => s.chatData.betConfirmPayload);
  const parmas: walletInfoType = {
    address: 'Trx0c0cf0er0fk4m3klkdsfkl2jnnljk',
    balance: '0',
    groupName: '',
    walletName: '',
  };
  const [walletInfo, setWalletInfo] = useState(parmas);
  const queryNativeWalletInfoCallback = (response: any) => {
    if (response) {
      // alert(response);
      // alert(JSON.parse(response));
      // alert(JSON.stringify(JSON.parse(response)));
      setWalletInfo(JSON.parse(response));
      console.log('queryNativeWalletInfoCallback1111111');
    }
    console.log('queryNativeWalletInfoCallback');
  };
  // alert((window as any).jsCallQRcodeCallback);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams([]);
  // 显示到底部的按钮
  const [showGoToBottom, setShowGoToBottom] = useState(false);
  // 订阅频道ID
  const { id } = Object.fromEntries(searchParams) || '1';
  const queryNativeWalletInfo = () => {
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridege((bridge: any) => {
        bridge.callHandler(
          'queryNativeWalletInfo',
          { key: 'value' },
          (response: any) => {
            console.log('ios,queryNativeWalletInfo');
            // const { result } = response;
            console.log(response);
            // setWalletInfo(result);
          }
        );
      });
    }

    if (isAndroid()) {
      (window as any).queryNativeWalletInfoCallback =
        queryNativeWalletInfoCallback;
      const josn = {
        type: 'type',
        token: 'this.$store.state.token',
      };
      // loadBridege((bridge: any) => {
      //   bridge.jsCallScanID(JSON.stringify(josn));
      // });
      loadBridege((bridge: any) => {
        bridge.queryNativeWalletInfo(JSON.stringify(josn));
      });
    }
  };
  // 挂载 是否在ios和 安卓中
  useEffect(() => {
    queryNativeWalletInfo();
  });
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
    // 只监听list 避免重复渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  // 查询历史记录
  useEffect(() => {
    let timer: any;
    dispatch(getChatHistory({ page: 1, size: 10 }))
      .unwrap()
      .then((arr: any): void => {
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
    if (finished) return;
    const scrolls = document.querySelector('.scroll') as HTMLDivElement;
    scrolls.style.scrollBehavior = 'unset';
    const getMore = async (): Promise<void> => {
      let timer: any = null;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const caclHeight =
          scrolls.scrollTop + scrolls.offsetHeight - scrolls.scrollHeight;
        if (caclHeight < -100) {
          setShowGoToBottom(true);
        } else {
          setShowGoToBottom(false);
        }
      }, 500);

      const beforeHeight = (document.querySelector('.scroll') as HTMLDivElement)
        .scrollHeight;
      if (scrolls.scrollTop === 0 && loading) {
        setLoading(false);
        setPage(page + 1);
        dispatch(getChatHistory({ page, size: 10, isPullDwon: true }))
          .unwrap()
          .then((obj: any): void => {
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

    scrolls.addEventListener('scroll', getMore);
    return (): void => {
      scrolls.removeEventListener('scroll', getMore);
    };
  }, [dispatch, finished, loading, page]);

  const goToBottom = () => {
    const scrolls = document.querySelector('.scroll') as HTMLDivElement;
    scrolls.scrollTop = scrolls.scrollHeight;
  };
  return (
    <div className={styles['background-color']}>
      <div className={`${styles.container}`}>
        <div
          className={`${styles.main} ${showBet && styles['move-main']} scroll`}
        >
          <LoadingStatu hasMore={hasMore} list={list} />
          <Divider
            style={{
              opacity: 0,
            }}
          />
          {/* 聊天记录 */}
          <MessageList list={list} />
        </div>
        {/* 发送栏 */}
        <SendBar walletInfo={walletInfo} />
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
        onMaskClick={() => dispatch(openBetConfrmModal(false))}
      >
        <BetModal
          title='投注确认'
          gameName={betConfirmPayload.gameName}
          visible={betConfirmModal}
          betName={betConfirmPayload.betName}
          betAmount={betConfirmPayload.betAmount}
          walletAddress={betConfirmPayload.walletAddress}
          betAddress={betConfirmPayload.betAddress}
        />
      </Mask>
    </div>
  );
};
export default ChatRoom;
