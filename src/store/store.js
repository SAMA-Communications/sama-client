import chatReducer from "./ChatList";
import messageReducer from "./MessageArray";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    chatList: chatReducer,
    messageArr: messageReducer,
  },
});
