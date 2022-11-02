import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const participantsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => a._id.localeCompare(b._id),
});

export const {
  selectAll: selectAllParticipants,
  selectById: selectParticipantById,
  selectEntities: selectParticipantsEntities,
  selectIds: selectParticipantsIds,
  selectTotal: selectTotalParticipantsIds,
} = participantsAdapter.getSelectors((state) => state.participants);

const participants = createSlice({
  name: "Participants",
  initialState: participantsAdapter.getInitialState(),
  reducers: {
    addUser: participantsAdapter.addOne,
    addUsers: participantsAdapter.addMany,
    setUsers: participantsAdapter.setAll,
  },
});

export const { addUser, addUsers, setUsers } = participants.actions;

export default participants.reducer;
