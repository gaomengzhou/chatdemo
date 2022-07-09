import { Divider } from 'antd-mobile';
import { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { getChatHistory, sedMsg } from 'redux/chatRoom/slice';
import socket from 'utils/websocket/Websocket';
import { useSearchParams } from 'react-router-dom';
import styles from './ChatRoom.module.scss';
import MessageList from './component/MessageList/MessageList';
import LoadingStatu from './component/LoadingStatu/LoadingStatu';
import SendBar from './SendBar/SendBar';
import { loadBridege } from '../../utils/tools/tool';

const androidLoadSuccessCallback = () => {
  console.log('androidLoadSuccessCallback');
};
const ChatRoom: React.FC = (): ReactElement => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(true);
  const list = useAppSelector((s: any) => s.chatData.chatList);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams([]);
  // 显示到底部的按钮
  const [showGoToBottom, setShowGoToBottom] = useState(false);
  // 订阅频道ID
  const { id } = Object.fromEntries(searchParams) || '1';
  // 挂载 是否在ios和 安卓中
  useEffect(() => {
    const win = window as any;
    (win as any).androidLoadSuccessCallback = androidLoadSuccessCallback;
    loadBridege((bridge: any) => {
      if (!win.Android) {
        bridge.callHandler(
          'DeviceLoadJSSuccess',
          { key: 'value' },
          (response: any) => {
            console.log('response', JSON.stringify(response));
            console.log(response);
            const { result } = response;
            if (result === 'iOS') {
              console.log('js 处在苹果的App中，并且被加载成功');
              win.iOSLoadJSSuccess = true;
            }
          }
        );
      }
    });
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
    let timer: any;
    (socket.ws as WebSocket).onmessage = async (
      msg: MessageEvent
    ): Promise<void> => {
      await socket.reset();
      socket.start();
      if (msg.data === 'success') return;
      const data = JSON.parse(msg.data);
      console.log(data);
      dispatch(sedMsg(data));
      timer = setTimeout((): void => {
        const scroll = document.querySelector('.scroll') as HTMLDivElement;
        scroll.style.scrollBehavior = 'smooth';
        scroll.scrollTo(0, scroll.scrollHeight);
      }, 0);
    };
    return (): void => {
      clearTimeout(timer);
    };
  }, [dispatch]);

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
      const caclHeight =
        scrolls.scrollTop + scrolls.offsetHeight - scrolls.scrollHeight;
      if (caclHeight < -60) {
        setShowGoToBottom(true);
      } else {
        setShowGoToBottom(false);
      }

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
  }, [list, page, loading, dispatch, finished]);

  return (
    <div className={styles['background-color']}>
      <div className={`${styles.container}`}>
        <div className={`${styles.main} scroll`}>
          <LoadingStatu hasMore={hasMore} list={list} />
          <Divider
            style={{
              opacity: 0,
            }}
          />
          {/* 聊天记录 */}
          <MessageList list={list} showGoToBottom={showGoToBottom} />
        </div>
        {/* 发送栏 */}
        <SendBar />
      </div>
    </div>
  );
};
export default ChatRoom;
