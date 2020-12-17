import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

interface AccountState {
  pass?: any;
  passes?: any[];
  fakeNonce?: any;
  unstableConnection?: any;
  locale?: string;
  accessToken?: string;
  accessTokenExpire?: any;
  accountId?: string;
  email?: string;
  refreshToken?: string;
  refreshTokenExpire?: string;
  sessionId?: string;
  deviceId?: string;
  loginCount?: number;
}

const initialState: AccountState = {};

const AccountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AccountState>) {
      state = _.merge(state, action.payload);
    },
    setDeviceId(state, action: PayloadAction<{ deviceId: string }>) {
      state.deviceId = action.payload.deviceId;
    },
    updatePassAccesses(state, action: PayloadAction<{ passAccesses: any[] }>) {
      state.passes = action.payload.passAccesses;
    },
    refreshAccessToken(
      state,
      action: PayloadAction<{ accessToken: string; accessTokenExpire: number }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpire = action.payload.accessTokenExpire;
    },
    logout(state) {
      state.accountId = undefined;
      state.sessionId = undefined;
      state.email = undefined;
      state.accessToken = undefined;
      state.accessTokenExpire = undefined;
      state.refreshToken = undefined;
      state.refreshTokenExpire = undefined;
      state.loginCount = undefined;
    },
  },
});

export const {
  login,
  logout,
  setDeviceId,
  refreshAccessToken,
  updatePassAccesses,
} = AccountSlice.actions;

AccountSlice.actions.login;

export default AccountSlice.reducer;
