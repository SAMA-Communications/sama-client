import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const participantsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
});

export const participantsSelectors = participantsAdapter.getSelectors(
  (state) => state.participants
);

const participants = createSlice({
  name: "Participants",
  initialState: participantsAdapter.getInitialState(),
  reducers: {
    setUser: participantsAdapter.addOne,
    setUsers: participantsAdapter.addMany,
  },
});

export const { setUser, setUsers } = participants.actions;

export default participants.reducer;
