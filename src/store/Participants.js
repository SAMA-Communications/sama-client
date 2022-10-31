import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const participantsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
});

export const participantsSelectors = participantsAdapter.getSelectors(
  (state) => state.participants
);

const participants = createSlice({
  name: "Participants",
  initialState: participantsAdapter.getInitialState(),
  reducers: {
    addUser: participantsAdapter.addOne,
    setUsers: participantsAdapter.setAll,
  },
});

export const { addUser, setUsers } = participants.actions;

export default participants.reducer;
