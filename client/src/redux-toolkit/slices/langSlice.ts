import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  // commentsByIssue: Record<number, Comment[] | undefined>;
  langCode: 'kr' | 'en';
}

interface LanguagePayload {
  langCode: 'kr' | 'en';
}

const initialState: LanguageState = {
  // commentsByIssue: {},
  langCode: localStorage.getItem('langCode')
    ? (localStorage.getItem('langCode') as 'kr' | 'en')
    : 'en',
};

const LanguageSlice = createSlice({
  name: 'Language',
  initialState,
  reducers: {
    getLanguageCode(state, action: PayloadAction<LanguagePayload>) {
      state.langCode = action.payload.langCode;
      localStorage.setItem('langCode', action.payload.langCode);
    },
  },
});

export const { getLanguageCode } = LanguageSlice.actions;

export default LanguageSlice.reducer;
