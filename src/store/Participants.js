import { createSlice } from "@reduxjs/toolkit";

export const participants = createSlice({
  name: "Participants",
  initialState: {
    value: {},
  },
  reducers: {
    setUsers: (state, action) => {
      action.payload.forEach((user) => {
        state.value[user._id] = user.login;
      });
    },
  },
});

export const { setUsers } = participants.actions;

export default participants.reducer;
