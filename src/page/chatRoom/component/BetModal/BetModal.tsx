import 'animate.css';
import { openBetConfrmModal, setInitalsendBarData } from 'redux/chatRoom/slice';
import { useAppDispatch } from 'redux/hook';
import styles from './BetModal.module.scss';
/**
 * @param title 标题名称
 * @param gameName 投注游戏名称
 * @param betName 投注项
 * @param betAmount 投注金额
 * @param walletAddress 我的钱包地址
 * @param betAddress 投注地址
 * @param visible 显示/关闭弹框和控制动画的类属性需要的依赖
 */
interface BetModalProps {
  title: string;
  gameName: string;
  betName: string;
  betAmount: string | number;
  walletAddress: string;
  betAddress: string;
  visible?: boolean;
}
const BetModal: React.FC<BetModalProps> = ({
  title,
  gameName,
  visible,
  betName,
  betAmount,
  walletAddress,
  betAddress,
}) => {
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    const payload = {
      title,
      gameName,
      visible,
      betName,
      betAmount,
      walletAddress,
      betAddress,
    };
    console.log('payload:', payload);

    // 请求成功后的操作 。。。。。。
    // 要求清空sendBar数据
    dispatch(setInitalsendBarData(true));
    // 关闭弹框
    dispatch(openBetConfrmModal(false));
  };
  return (
    <div
      className={`${styles.mask} ${visible && 'animate__bounceIn'} ${
        !visible && 'animate__bounceOut'
      }`}
    >
      <h3>{title}</h3>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.gamename}>
            <p>投注游戏：</p>
            <span>{gameName}</span>
          </div>
          <div className={styles.options}>
            <div>
              <p>投注项</p>
              <span>{betName}</span>
            </div>
            <div>
              <p>投注金额</p>
              <span>{betAmount}</span>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.address}>
            <p>我的钱包地址</p>
            <span>{walletAddress}</span>
          </div>
          <div className={styles.address}>
            <p>投注地址</p>
            <span>{betAddress}</span>
          </div>
        </div>
        <footer className={styles.footer}>
          <button onClick={() => dispatch(openBetConfrmModal(false))}>
            取消
          </button>
          <button onClick={handleSubmit}>提交注意</button>
        </footer>
      </div>
    </div>
  );
};
export default BetModal;
