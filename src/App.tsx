import ChatRoom from 'page/chatRoom/ChatRoom';
// import WatchTest from 'page/chatRoom/WatchTest';
import { ReactElement, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

const App: React.FC = (): ReactElement => {
  useEffect(() => {
    document.addEventListener('gesturestart', (event: Event): void => {
      event.preventDefault();
    });
    return () => {
      document.removeEventListener('gesturestart', (event: Event): void => {
        event.preventDefault();
      });
    };
  });
  return (
    <Routes>
      <Route path='/' element={<ChatRoom />} />
      {/* <Route path='watch' element={<WatchTest />} /> */}
    </Routes>
  );
};

export default App;
