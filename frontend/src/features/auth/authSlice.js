import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loginTime: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loginTime = action.payload.loginTime;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loginTime = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
