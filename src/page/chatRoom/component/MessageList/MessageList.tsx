/* eslint-disable no-unused-vars */
import avatar from 'assets/images/avatar.png';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styles from './MessageList.module.scss';

function MessageList({
  list,
  showGoToBottom,
  setShowGoToBottom,
}: {
  list: { [key: string]: any }[];
  showGoToBottom: boolean;
  setShowGoToBottom: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    console.log(showGoToBottom);
  }, [showGoToBottom]);
  return (
    <div>
      {list &&
        list.length > 0 &&
        list.map((item) => {
          return item.type === 1 ? (
            // 自己的聊天记录
            <div key={item.id} className={styles['chat-mySelf']}>
              <div className={styles.box}>
                <div className={styles['name-and-text']}>
                  <div className={styles.name}>{item.nickName}</div>
                  <div className={styles.content}>{item.messageText}</div>
                </div>
                <img src={avatar} alt='avatar' />
              </div>
            </div>
          ) : (
            // 别人的聊天记录
            <div key={item.id} className={styles['chat-other']}>
              <div className={styles.box}>
                <img src={avatar} alt='avatar' />
                <div className={styles['name-and-text']}>
                  <div className={styles.name}>{item.nickName}</div>
                  <div className={styles.content}>{item.messageText}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
export default MessageList;
