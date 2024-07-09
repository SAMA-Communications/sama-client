import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { selectCurrentUserId } from "./CurrentUserId";

export const participantsAdapter = createEntityAdapter({
  selectId: ({ native_id }) => native_id,
  sortComparer: (a, b) => typeof a.native_id === 'string' ? a.native_id.localeCompare(b.native_id) : a.native_id - b.native_id,
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
