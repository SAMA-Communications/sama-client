import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "@store/reducer";

export default configureStore({ reducer: rootReducer });

