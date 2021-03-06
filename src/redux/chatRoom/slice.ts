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
          // ?????????Loading?????????,????????????
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
      // ?????????????????????
      .addCase(
        getChatHistory.rejected,
        <P, S extends string = string, M = never>(
          state: ChatState,
          action: PayloadAction<P, S, M, SerializedError>
        ) => {
          Toast.show(action.error.message as string);
        }
      );
    // ?????????????????????
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
// ????????????????????? thunk?????????????????????????????????????????????
// ?????????????????????????????????????????????????????????????????????
export const exampleAction = (params: any): AppThunk => {
  /**
   * @param dispatch ???????????????????????????Action??????
   * @param getState ????????????store??????state
   */
  return (dispatch, getState) => {
    console.log(params);
    const msg = getState().chatData.notice || '';
    dispatch(sedMsg(msg));
  };
};

export default chatData.reducer;
