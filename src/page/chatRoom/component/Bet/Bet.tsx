import BetHeader from '../BetHeader/BetHeader';
import styles from './Bet.module.scss';

const Bet: React.FC<{
  showBet: boolean;
  children?: JSX.Element;
}> = ({ children, showBet }) => {
  return (
    <div
      className={`
        ${styles.container}
        ${showBet && styles['auto-height-universal']}
      } betbox`}
    >
      <BetHeader />
      {children}
    </div>
  );
};
export default Bet;
