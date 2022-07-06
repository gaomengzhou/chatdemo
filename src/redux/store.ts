import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import chatDataReducer from './chatRoom/slice';

// configureStore会自动调用combineReducers合并reducer,但只适用于一级reducer
// 如果想嵌套 reducer，需要自己调用 combineReducers 来处理嵌套。
// 这里用上combineReducers是为以后持久化或RTK Query配置做准备（需要用到combineReducers）
const rootReducer = combineReducers({
  chatData: chatDataReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
