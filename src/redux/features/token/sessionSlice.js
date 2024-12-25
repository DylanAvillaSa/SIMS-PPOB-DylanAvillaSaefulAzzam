import { createSlice } from "@reduxjs/toolkit";

const savedSession = JSON.parse(localStorage.getItem("session"));

const initialState = savedSession || {
  isAuthenticated: false,
  token: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem("session", JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("session");
    },
  },
});

export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
