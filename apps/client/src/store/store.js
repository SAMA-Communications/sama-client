import { configureStore } from "@reduxjs/toolkit";

import { ensureSelectedConversationMiddleware } from "@store/middleware/ensureSelectedConversationMiddleware";
import rootReducer from "@store/reducer";

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ensureSelectedConversationMiddleware),
});

