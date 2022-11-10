import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const unreadMessagesAdapter = createEntityAdapter({
  selectId: ({ cid }) => cid,
});

export const { selectEntities: selectUnreadMessagesEntities } =
  unreadMessagesAdapter.getSelectors((state) => state.unreadMessages);

export const unreadMessages = createSlice({
  name: "UnreadMessages",
  initialState: unreadMessagesAdapter.getInitialState(),
  reducers: {
    setIndicators: unreadMessagesAdapter.setAll,
    upsertIndicator: unreadMessagesAdapter.upsertOne,
    removeIndicator: unreadMessagesAdapter.removeOne,
    incrimment(state) {
      console.log(state, state.value);
      //state --> count+action.paylod.value
    },
  },
});

export const {
  setIndicators,
  upsertIndicator,
  removeIndicator,
  incrementCount,
  incrimment,
} = unreadMessages.actions;

export default unreadMessages.reducer;
