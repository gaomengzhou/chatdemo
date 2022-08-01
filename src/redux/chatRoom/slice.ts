import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { Toast } from 'antd-mobile';
import { AppThunk, RootState } from 'redux/store';

interface betConfirmPayloadProps {
  gameName: string;
  betName: string;
  betAmount: string | number;
  walletAddress: string;
  betAddress: string;
}
interface walletInfoType {
  address: string;
  balance: string;
  groupName: string;
  walletName: string;
  toAddress: string;
  channelType: string;
  userType: string;
  TrxWalletName: string;
}
interface ChatState<T = any> {
  chatList: T[];
  notice?: string;
  showBet: boolean;
  betConfirmModal: boolean;
  betConfirmPayload: betConfirmPayloadProps;
  initialSendBarData: boolean;
  walletBalance: string;
  walletInfo: walletInfoType;
}
const initialState: ChatState = {
  chatList: [],
  showBet: false,
  betConfirmModal: false,
  betConfirmPayload: {
    gameName: '-',
    betName: '-',
    betAmount: '-',
    walletAddress: '-',
    betAddress: '-',
  },
  walletInfo: {
    address: '',
    balance: '0',
    groupName: '',
    walletName: '',
    toAddress: '',
    channelType: '',
    userType: '',
    TrxWalletName: '',
  },
  initialSendBarData: false,
  walletBalance: '0',
};

export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (payload: {
    page: number;
    size: number;
    isPullDown?: boolean;
    timeStamp?: string | undefined;
  }): Promise<any> => {
    const result = await $fetch.post(
      '/wallet-decentralized-api/chat-client/h5ChatHistory/list',
      {
        body: {
          pageNo: 1,
          pageSize: payload.size,
          gameType: window.location.href.split('?id=')[1] || 1,
          startTimes: payload.timeStamp || '',
        },
      }
    );
    if (payload.isPullDown) return { ...result, isPullDown: true };
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
    setBetStatus: (state, action) => {
      state.showBet = action.payload;
    },
    openBetConfirmModal: (state, action) => {
      state.betConfirmModal = action.payload;
    },
    setBetConfirmPayload: (state, { payload }) => {
      state.betConfirmPayload = payload;
    },
    setInitialSendBarData: (state, { payload }) => {
      state.initialSendBarData = payload;
    },
    setWalletBalance: (state, { payload }) => {
      state.walletBalance = payload;
    },
    setWalletInfo: (state, { payload }) => {
      state.walletInfo = payload;
      state.walletBalance = payload.balance;
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
            isPullDown?: boolean;
            data?: any;
          }>
        ) => {
          if (action.payload.isPullDown) {
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

export const {
  sedMsg,
  setBetStatus,
  openBetConfirmModal,
  setBetConfirmPayload,
  setInitialSendBarData,
  setWalletBalance,
  setWalletInfo,
} = chatData.actions;

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
