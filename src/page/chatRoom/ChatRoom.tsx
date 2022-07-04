import { Divider, DotLoading, NoticeBar } from 'antd-mobile';
import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'redux/hook';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';
import { chatData, getChatHistory } from 'redux/chatRoom/slice';
import avatar from 'assets/images/avatar.png';
import socket from 'utils/websocket/Websocket';
import { useSearchParams } from 'react-router-dom';
import styles from './ChatRoom.module.scss';
// test
interface NoticeState {
  marquee_content: string;
  marquee_show: boolean;
}

const ChatRoom: React.FC = (): ReactElement => {
  // const [value, setValue] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);

  const [loading, setLoading] = useState<boolean>(true);
  const [
    noticeState,
    // setNoticeState
  ] = useState<NoticeState>({
    marquee_content: '',
    marquee_show: false,
  });
  const list = useSelector((s) => s.chatData.chatList);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams([]);
  // 订阅频道ID
  const { id } = Object.fromEntries(searchParams) || '1';

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
      dispatch(chatData.actions.sedMsg(data));
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

  // 获取公告信息
  // useEffect(() => {
  //   const getNotice = async (): Promise<void> => {
  //     const res = await $fetch.post('/chat_room_config');
  //     if (!res.success) return Toast.show(res.message);
  //     const {
  //       data: { marquee_config },
  //     } = res;
  //     setNoticeState(marquee_config);
  //   };
  //   getNotice();
  // }, []);

  // const sendText = async (): Promise<void> => {
  //   if (!value) {
  //     Toast.show({
  //       content: '消息不能为空',
  //       afterClose: () => {
  //         console.log('after');
  //       },
  //     });
  //     return;
  //   }
  //   dispatch(
  //     chatData.actions.sedMsg({
  //       msg: value,
  //       type: 1,
  //       user_name: '',
  //     }),
  //   );
  //   socket.emit('message', value);
  //   setValue('');
  // };

  return (
    <div className={styles['background-color']}>
      <div className={`${styles.container}`}>
        {noticeState.marquee_show ? (
          <NoticeBar
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
            }}
            closeable
            content={noticeState.marquee_content}
            color='alert'
          />
        ) : null}

        <div className={`${styles.main} scroll`}>
          <div className={styles.loading}>
            <Divider
              style={{
                color: '#444',
                borderColor: '#444',
                borderStyle: 'dashed',
              }}
            >
              {hasMore && list && list.length
                ? '加载中'
                : !hasMore && list && list.length > 0
                ? '没有更多了'
                : hasMore && list && list.length === 0
                ? null
                : '暂无消息记录'}
              {hasMore && <DotLoading color='#444' />}
            </Divider>
          </div>
          <Divider
            style={{
              opacity: 0,
            }}
          />
          {list &&
            list.length > 0 &&
            list.map(
              (item) => (
                <div key={item.id} className={styles['chat-other']}>
                  <div className={styles.box}>
                    <img src={avatar} alt='avatar' />
                    <div className={styles['name-and-text']}>
                      <div className={styles.name}>{item.nickName}</div>
                      <div className={styles.content}>{item.messageText}</div>
                    </div>
                  </div>
                </div>
              )
              // item.type === 1 ? (
              //   // 自己的聊天记录
              //   <div key={item.id} className={styles["chat-mySelf"]}>
              //     <div className={styles.box}>
              //       <div className={styles.name}>{item.user_name}</div>
              //       <div className={styles.content}>{item.msg}</div>
              //     </div>
              //   </div>
              // ) : (
              //   // 别人的聊天记录
              //   <div key={item.id} className={styles["chat-other"]}>
              //     <div className={styles.box}>
              //       <div className={styles.name}>{item.user_name}</div>
              //       <div className={styles.content}>{item.msg}</div>
              //     </div>
              //   </div>
              // )
            )}
        </div>
        {/* <div className={styles["send-input"]}>
          <Input
            style={{
              border: "1px solid #e7e3e3",
              borderRadius: "0.3rem",
              padding: "0 0.5rem",
              backgroundColor: "#fff",
              boxShadow: "1px 0px 1px  #00000049",
              height: "4rem",
            }}
            value={value}
            onChange={setValue}
          />
          <Button
            style={{
              width: "6rem",
              marginLeft: "1rem",
              height: "4rem",
              fontSize: "12px",
            }}
            onClick={() => {}}
            color="primary"
          >
            发送
          </Button>
        </div> */}
      </div>
    </div>
  );
};
export default ChatRoom;
