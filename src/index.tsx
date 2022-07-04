import ReactDOM from 'react-dom/client';
import './utils/env';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { store } from 'redux/store';
import App from './App';

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
