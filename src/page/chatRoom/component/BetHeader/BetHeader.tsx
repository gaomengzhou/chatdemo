import { ReactComponent as AddIcon } from 'assets/images/add.svg';
import { loadBridge, isAndroid } from 'utils/tools/tool';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { setWalletInfo } from 'redux/chatRoom/slice';

const BetHeader = () => {
  const dispatch = useAppDispatch();
  const walletInfo = useAppSelector((s) => s.chatData.walletInfo);
  // 安卓添加trx回调
  const chooseNativeTrxCallback = (response: any) => {
    if (response) {
      dispatch(setWalletInfo(JSON.parse(response)));
    }
  };
  // 刷新余额
  const chooseNativeTrx = () => {
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridge((bridge: any) => {
        bridge.callHandler(
          'chooseNativeTrx',
          { key: 'value' },
          (response: any) => {
            console.log('ios,chooseNativeTrx');
            dispatch(setWalletInfo(response));
            // setWalletInfo(result);
          }
        );
      });
    }

    if (isAndroid()) {
      (window as any).chooseNativeTrxCallback = chooseNativeTrxCallback;
      // loadBridege((bridge: any) => {
      //   bridge.jsCallScanID(JSON.stringify(josn));
      // });
      loadBridge((bridge: any) => {
        bridge.chooseNativeTrx();
      });
    }
  };
  return (
    <header>
      <div className='left'>
        <p>
          钱包：<span>{`TRX ${walletInfo.TrxWalletName}`}</span>
        </p>
      </div>
      <AddIcon onClick={chooseNativeTrx} />
    </header>
  );
};
export default BetHeader;
