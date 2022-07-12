import ReactDOM from 'react-dom/client';
import './utils/env';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { store } from 'redux/store';
import App from './App';
import './i18n/config';
import { loadBridege } from './utils/tools/tool';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
const win = window as any;
const androidLoadSuccessCallback = (response: any) => {
  if (response === '1') {
    // alert(111111111111);
    (win as any).androidLoadSucess = true;
    win.isAndroid = true;
  }
  // alert(222222222222);
};
const queryNativeWalletInfoCallback = (response: any) => {
  if (response) {
    // setWalletInfo(response);
    // alert(2222222222);
    console.log('queryNativeWalletInfoCallback1111111');
  }
  console.log('queryNativeWalletInfoCallback');
};

(window as any).queryNativeWalletInfoCallback = queryNativeWalletInfoCallback;
(window as any).androidLoadSuccessCallback = androidLoadSuccessCallback;
loadBridege((bridge: any) => {
  if (!win.androidLoadSucess) {
    console.log('response苹果DeviceLoadJSSuccess调用');
    bridge.callHandler(
      'DeviceLoadJSSuccess',
      { key: 'value' },
      (response: any) => {
        console.log('response', JSON.stringify(response));
        console.log(response);
        const { result } = response;
        if (result === 'iOS') {
          console.log('js 处在苹果的App中，并且被加载成功');
          win.iOSLoadJSSuccess = true;
        }
      }
    );
  }
});
