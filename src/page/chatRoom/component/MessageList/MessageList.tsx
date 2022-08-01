import userAvatar from 'assets/images/icon-user.png';
import service from 'assets/images/icon-service.png';
import luckODD from 'assets/images/icon-luckodd.png';
import hashniuniu from 'assets/images/icon-hashniuniu.png';
import laohubaijiale from 'assets/images/icon-laohubaijiale.png';
import niuniu100 from 'assets/images/icon-niuniu100.png';
import { useAppSelector } from 'redux/hook';
import styles from './MessageList.module.scss';

interface ListType {
  list: { [key: string]: any };
}
function MessageList({ list }: ListType) {
  const { walletName, address } = useAppSelector((s) => s.chatData.walletInfo);

  const chooseAvatar = (
    type: number,
    userType: string,
    channelType: string
  ) => {
    // type: -1：普通用户，0：官方客服，1：欢乐单双，2：哈希牛牛，3：老虎百家乐，4：百人牛牛
    switch (+type) {
      case -1:
        switch (channelType) {
          case '1':
            return userType === '1' ? luckODD : userAvatar;
          case '2':
            return userType === '1' ? hashniuniu : userAvatar;
          case '3':
            return userType === '1' ? laohubaijiale : userAvatar;
          case '4':
            return userType === '1' ? niuniu100 : userAvatar;
          default:
            return userAvatar;
        }
      case 0:
        return service;
      case 1:
        return luckODD;
      case 2:
        return hashniuniu;
      case 3:
        return laohubaijiale;
      case 4:
        return niuniu100;
      default:
        return userAvatar;
    }
  };
  // 时间戳转为时间
  const getTime = (date: number | string | Date) => {
    return new Date(date).toLocaleString().split(' ')[1];
  };
  return (
    <div className={styles.container}>
      {list &&
        list.length > 0 &&
        list.map((item: any) => {
          return item.address === address ? (
            // 自己的聊天记录
            <div key={item.id} className={`${styles['chat-mySelf']}`}>
              <div className={styles.box}>
                <div className={styles['name-and-text']}>
                  <div className={styles.name}>
                    {walletName || '下载APP查看昵称'}
                    {item.userType === '1' ? (
                      <span className={styles['chat-service']}>(客服)</span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={styles.content}>
                    <p>{item.messageText}</p>
                    <span>{getTime(item.id)}</span>
                  </div>
                </div>
                <img
                  src={chooseAvatar(-1, item.userType, item.channelType)}
                  alt='avatar'
                />
              </div>
            </div>
          ) : (
            // 别人的聊天记录
            <div key={item.id} className={styles['chat-other']}>
              <div className={styles.box}>
                <img
                  src={chooseAvatar(
                    item.messageType,
                    item.userType,
                    item.channelType
                  )}
                  alt='avatar'
                />
                <div className={styles['name-and-text']}>
                  <div className={styles.name}>
                    {item.nickName}
                    {item.userType === '1' ? (
                      <span className={styles['chat-service']}>(客服)</span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={styles.content}>
                    <p>{item.messageText}</p>
                    <span>{getTime(item.id)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
export default MessageList;
