import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';
import { AppThunk, RootState } from 'redux/store';
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

const chatData = createSlice({
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
  extraReducers: (builder) => {
    builder
      .addCase(
        getChatHistory.pending,
        // eslint-disable-next-line no-unused-vars
        (state) => {
          // 可以写Loading的逻辑,加载等等
        }
      )
      .addCase(
        getChatHistory.fulfilled,
        (
          state,
          action: PayloadAction<{
            page: number;
            size: number;
            isPullDwon?: boolean;
            data?: any;
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

export const { sedMsg } = chatData.actions;

export const MsgList = (state: RootState) => state.chatData.chatList;
// 也可以手动编写 thunk，其中可能包含同步和异步逻辑。
// 下面是一个基于当前状态有条件地调度动作的例子。
export const exampleAction = (params: any): AppThunk => {
  /**
   * @param dispatch 字面意义，就是发送Action用的
   * @param getState 获取整个store里的state
   */
  return (dispatch, getState) => {
    console.log(params);
    const msg = getState().chatData.notice || '';
    dispatch(sedMsg(msg));
  };
};

export default chatData.reducer;
