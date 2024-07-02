import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { selectCurrentUser } from "./CurrentUser";

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

export const getCurrentUserById = createSelector(
  [selectCurrentUser, selectParticipantsEntities],
  (currentUser, participants) =>
    currentUser._id
      ? { ...currentUser, ...participants[currentUser._id] }
      : currentUser || {}
);

export const { addUser, addUsers, setUsers, upsertUser, upsertUsers } =
  participants.actions;

export default participants.reducer;
