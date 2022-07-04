import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';
// import logo from "assets/images/logo.svg";
interface ChatState<T = any> {
  chatList: T[];
  notice?: string;
}
const initialState: ChatState = {
  chatList: [],
};

export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (payload: {
    page: number;
    size: number;
    isPullDwon?: boolean;
  }): Promise<any> => {
    const result = await $fetch.post('/chat/query/history', {
      body: {
        pageNo: payload.page,
        pageSize: payload.size,
        gameType: window.location.href.split('?id=')[1] || 1,
      },
    });
    if (payload.isPullDwon) return { ...result, isPullDwon: true };
    return result;
  }
);

export const chatData = createSlice<
  ChatState,
  SliceCaseReducers<ChatState>,
  string
>({
  name: 'chat',
  initialState,
  reducers: {
    sedMsg: <T>(
      state: ChatState,
      action: PayloadAction<string | { [key: string]: T }>
    ) => {
      if (state.chatList.length > 500) {
        state.chatList.shift();
      }
      state.chatList.push(action.payload);
    },
  },
  extraReducers(build: ActionReducerMapBuilder<ChatState>): void | undefined {
    build
      .addCase(
        getChatHistory.pending,
        // eslint-disable-next-line no-unused-vars
        (state: ChatState, action: PayloadAction) => {
          // 可以写Loading的逻辑,加载等等
        }
      )
      .addCase(
        getChatHistory.fulfilled,
        <T>(
          state: typeof initialState,
          action: PayloadAction<{
            isPullDwon: boolean;
            data: { [key: string]: Array<T> };
          }>
        ) => {
          if (action.payload.isPullDwon) {
            state.chatList.unshift(...action.payload.data.records);
          } else {
            state.chatList = action.payload.data.records;
          }
        }
      )
      // 类型定义写法一
      .addCase(
        getChatHistory.rejected,
        <P, S extends string = string, M = never>(
          state: ChatState,
          action: PayloadAction<P, S, M, SerializedError>
        ) => {
          Toast.show(action.error.message as string);
        }
      );
    // 类型定义写法二
    // .addCase(
    //   getChatHistory.rejected,
    //   (state: ChatState, { error }: { error: SerializedError }) => {
    //     Toast.show(error.message!);
    //   }
    // );
  },
});
