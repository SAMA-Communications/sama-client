import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { selectCurrentUserId } from "./CurrentUserId.js";

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
    upsertUser: participantsAdapter.upsertOne,
    upsertUsers: participantsAdapter.upsertMany,
    setUsers: participantsAdapter.setAll,
  },
});

export const getCurrentUserFromParticipants = createSelector(
  [selectCurrentUserId, selectParticipantsEntities],
  (id, participants) => participants[id] || {}
);

export const { addUser, addUsers, setUsers, upsertUser, upsertUsers } =
  participants.actions;

export default participants.reducer;
