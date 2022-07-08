import BetHeader from '../BetHeader/BetHeader';
import styles from './Bet.module.scss';

const Bet: React.FC<{
  showBet: boolean;
  children?: JSX.Element;
  isHashNiuNiu?: boolean;
}> = ({ children, showBet, isHashNiuNiu }) => {
  return (
    <div
      className={`
        ${styles.container}
        ${showBet && !isHashNiuNiu && styles['auto-height-hash-universal']} ${
        showBet && isHashNiuNiu && styles['auto-height-hashniuniu']
      } betbox`}
    >
      <BetHeader />
      {children}
    </div>
  );
};
export default Bet;
