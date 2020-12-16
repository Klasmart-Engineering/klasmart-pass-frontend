import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalDialogState {
  // commentsByIssue: Record<number, Comment[] | undefined>;
  term: boolean;
  privacy: boolean;
}

const initialState: GlobalDialogState = {
  // commentsByIssue: {},
  term: false,
  privacy: false,
};

const GlobalDialogSlice = createSlice({
  name: 'GlobalDialog',
  initialState,
  reducers: {
    setTermDialog(state, action: PayloadAction<{ open: boolean }>) {
      state.term = action.payload.open;
    },
    setPrivacyDialog(state, action: PayloadAction<{ open: boolean }>) {
      state.privacy = action.payload.open;
    },
  },
});

export const { setTermDialog, setPrivacyDialog } = GlobalDialogSlice.actions;

export default GlobalDialogSlice.reducer;
