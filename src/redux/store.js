import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./features/token/sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});
