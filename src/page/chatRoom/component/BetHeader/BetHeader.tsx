import { ReactComponent as AddIcon } from 'assets/images/add.svg';

const BetHeader = () => {
  return (
    <header>
      <div className='left'>
        <p>
          钱包：<span>TRX钱包1</span>
        </p>
      </div>
      <AddIcon />
    </header>
  );
};
export default BetHeader;
