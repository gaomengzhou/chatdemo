import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { chatData } from './chatRoom/slice';

const rootReducer = combineReducers({ chatData: chatData.reducer });
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});
// useSelector的类型定义
export type RootState = ReturnType<typeof store.getState>;
// dispatch
export type AppDispatch = typeof store.dispatch;
