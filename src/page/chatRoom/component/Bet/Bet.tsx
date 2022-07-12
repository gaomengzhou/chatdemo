import BetHeader from '../BetHeader/BetHeader';
import styles from './Bet.module.scss';

const Bet: React.FC<{
  showBet?: boolean;
  children?: JSX.Element;
}> = ({ children }) => {
  return (
    <div
      className={`
        ${styles.container}
      } betbox`}
    >
      <BetHeader />
      {children}
    </div>
  );
};
export default Bet;
