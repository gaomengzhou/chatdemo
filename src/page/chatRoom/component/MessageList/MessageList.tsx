import avatar from 'assets/images/avatar.png';
import { ReactComponent as ToBottom } from 'assets/images/icon-bottmo.svg';
import { useAppSelector } from 'redux/hook';
import { RootState } from 'redux/store';
import styles from './MessageList.module.scss';

function MessageList({
  list,
  showGoToBottom,
}: {
  list: { [key: string]: any }[];
  showGoToBottom: boolean;
}) {
  const showBet = useAppSelector((s: RootState) => s.chatData.showBet);

  const goToBottom = () => {
    const scrolls = document.querySelector('.scroll') as HTMLDivElement;
    console.log(scrolls.scrollTop, scrolls.scrollHeight, scrolls.offsetHeight);
  };

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
      {showGoToBottom && (
        <div
          className={`${styles['to-bottom']} ${
            showBet && styles['to-bottom-betopen']
          }`}
          onClick={goToBottom}
        >
          <ToBottom
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}
    </div>
  );
}
export default MessageList;
