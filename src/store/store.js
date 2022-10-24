import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./ChatList";

export default configureStore({
  reducer: {
    chatList: chatReducer,
  },
});
