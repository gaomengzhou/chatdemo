import ChatRoom from 'page/chatRoom/ChatRoom';
// import WatchTest from 'page/chatRoom/WatchTest';
import { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

const App: React.FC = (): ReactElement => {
  return (
    <Routes>
      <Route path='/' element={<ChatRoom />} />
      {/* <Route path='watch' element={<WatchTest />} /> */}
    </Routes>
  );
};

export default App;
