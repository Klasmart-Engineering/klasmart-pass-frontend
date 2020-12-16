import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  // commentsByIssue: Record<number, Comment[] | undefined>;
  session: string | null;
  accId: string | null;
}

interface LoginPayload {
  session: string;
  accId: string;
}

const initialState: LoginState = {
  // commentsByIssue: {},
  session: localStorage.getItem('session'),
  accId: localStorage.getItem('accId'),
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setSessionInfo(state, action: PayloadAction<LoginPayload>) {
      const { session, accId } = action.payload;

      localStorage.setItem('session', session);
      localStorage.setItem('accId', accId);
      state.session = session;
      state.accId = accId;
    },
    logout(state) {
      state.session = null;
      state.accId = null;
      localStorage.removeItem('session');
      localStorage.removeItem('accId');
    },
  },
});

export const { setSessionInfo, logout } = loginSlice.actions;
export default loginSlice.reducer;

// export const fetchLogin = (id: string, password: string): AppThunk => async (
//   dispatch
// ) => {
//   try {
//     dispatch(getLoginStart());
//     const result = await login(id, password);

//     dispatch(
//       getLoginSuccess({ session: result.session!, accId: result.accId! })
//     );
//   } catch (err) {
//     dispatch(getLoginFailure(err));
//   }
// };
