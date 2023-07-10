import api from "../api/api";
import store from "../store/store";
import { setUsers } from "../store/Participants";

class ParticipantsService {
  async syncDataFromChats(chatsIds) {
    api
      .getParticipantsByCids(chatsIds)
      .then((users) => store.dispatch(setUsers(users)));
  }
}

const participantsService = new ParticipantsService();

const select = (state) => state.conversations.entities;

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = select(store.getState());

  if (
    JSON.stringify(currentValue) !== JSON.stringify(previousValue) &&
    Object.keys(currentValue).length
  ) {
    participantsService.syncDataFromChats(Object.keys(currentValue));
  }
}
store.subscribe(handleChange);

export default participantsService;
