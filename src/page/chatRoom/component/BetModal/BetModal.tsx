import 'animate.css';
import {
  openBetConfirmModal,
  setInitialSendBarData,
  setWalletBalance,
} from 'redux/chatRoom/slice';
import { Toast } from 'antd-mobile';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { loadBridge, isAndroid } from 'utils/tools/tool';
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
  betName: string;
  betAmount: string | number;
  visible?: boolean;
}
interface confrimProps {
  toAmount: string | number;
  toAddress: string;
}
const BetModal: React.FC<BetModalProps> = ({
  title,
  visible,
  betName,
  betAmount,
}) => {
  const dispatch = useAppDispatch();
  const walletInfo = useAppSelector((s) => s.chatData.walletInfo);
  // 安卓刷新余额回调
  const queryNativeBalanceCallback = (response: any) => {
    if (response) {
      dispatch(setWalletBalance(response));
      console.log('response');
    }
  };
  // 刷新余额
  const refreshBalance = () => {
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridge((bridge: any) => {
        bridge.callHandler(
          'queryNativeBalance',
          { key: 'value' },
          (response: any) => {
            console.log('ios,queryNativeBalance');
            // const { result } = response;
            dispatch(setWalletBalance(response));
            console.log(response);
            // setWalletInfo(result);
          }
        );
      });
    }

    if (isAndroid()) {
      (window as any).queryNativeBalanceCallback = queryNativeBalanceCallback;
      // loadBridege((bridge: any) => {
      //   bridge.jsCallScanID(JSON.stringify(josn));
      // });
      loadBridge((bridge: any) => {
        bridge.queryNativeBalance();
      });
    }
  };

  const confirmTransferInfoCallback = (response: any) => {
    if (response) {
      if (response === 'true') {
        // 要求清空sendBar数据
        refreshBalance();
        dispatch(setInitialSendBarData(true));
        Toast.show({ duration: 3000, content: '注单已提交' });
      } else {
        Toast.show({ duration: 3000, content: '注单提交失败' });
      }
    }
  };

  // 确认信息
  const confirmTransferInfo = (obj: confrimProps) => {
    const win = window as any;
    if (win.iOSLoadJSSuccess) {
      return loadBridge((bridge: any) => {
        bridge.callHandler(
          'confirmTransferInfo',
          { key: JSON.stringify(obj) },
          (response: any) => {
            console.log('ios,confirmTransferInfo');
            // const { result } = response;
            if (response === 'true') {
              refreshBalance();
              dispatch(setInitialSendBarData(true));
              Toast.show({ duration: 3000, content: '注单已提交' });
            } else {
              Toast.show({ duration: 3000, content: '注单提交失败' });
            }
            // setWalletInfo(result);
          }
        );
      });
    }
    if (isAndroid()) {
      (window as any).confirmTransferInfoCallback = confirmTransferInfoCallback;
      loadBridge((bridge: any) => {
        bridge.confirmTransferInfo(JSON.stringify(obj));
      });
    }
  };

  // 讨论了好久 还是前端H5写死..
  const toAddress = () => {
    switch (walletInfo.channelType) {
      case '1':
        return 'TJTg6ksYuk7RfbBg4rmYYDU5DtRVo88888';
      case '3':
        return 'TBwFhdYLkB8SViDSojkWzQK8jTXc5Z6666';
      case '4':
        return 'TKrSKwyJ85WYiENc2PJAzEN4Caa5Z11111';
      case '2':
        return 'TGH8CEvEiD5ptJNSzeRSxguKyymjv55555';
      default:
        return '';
    }
  };
  const handleSubmit = () => {
    const payload = {
      title,
      visible,
      betName,
    };
    console.log('payload:', payload);
    const transferInfo: confrimProps = {
      toAmount: betAmount,
      toAddress: toAddress(),
    };
    // 请求成功后的操作 。。。。。。

    // 提交转账
    confirmTransferInfo(transferInfo);
    // 关闭弹框
    dispatch(openBetConfirmModal(false));
  };

  return (
    <div
      className={`animate__animated ${styles.mask} ${
        visible && 'animate__bounceIn'
      } ${!visible && 'animate__bounceOut'}`}
    >
      <h3>{title}</h3>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.gamename}>
            <p>投注游戏：</p>
            <span>{walletInfo.groupName}</span>
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
            <span>{walletInfo.address}</span>
          </div>
          <div className={styles.address}>
            <p>投注地址</p>
            <span>{toAddress()}</span>
          </div>
        </div>
        <footer className={styles.footer}>
          <button onClick={() => dispatch(openBetConfirmModal(false))}>
            取消
          </button>
          <button onClick={handleSubmit}>提交注单</button>
        </footer>
      </div>
    </div>
  );
};
export default BetModal;
