import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { account } from "../../store/reducers";

interface AccountState {
  pass?: any;
  passes?: any[];
  fakeNonce?: any;
  unstableConnection?: any;
  accessTokenExpire?: any;
  locale?: string;
  accessToke?: string;
  accessToken?: string;
  accountId?: string;
  email?: string;
  refreshToken?: string;
  refreshTokenExpire?: string;
  sessionId?: string;
  deviceId?: string;
}

const initialState: AccountState = {};

const AccountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AccountState>) {
      state = action.payload;
    },
    setDeviceId(state, action: PayloadAction<{ deviceId: string }>) {
      state.deviceId = action.payload.deviceId;
    },
    logout(state) {
      state = {};
    },
  },
});

export const { login, logout, setDeviceId } = AccountSlice.actions;

AccountSlice.actions.login;

export default AccountSlice.reducer;
