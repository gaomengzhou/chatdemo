import avatar from 'assets/images/avatar.png';
import styles from './MessageList.module.scss';

function MessageList({ list }: { list: { [key: string]: any }[] }) {
  return (
    <div className={styles.container}>
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
