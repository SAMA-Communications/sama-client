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

const selectAllConersations = (state) => state.conversations.entities;
const isDeepEqual = (object1, object2) => {
  const [objKeys1, objKeys2] = [Object.keys(object1), Object.keys(object2)];

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const [value1, value2] = [object1[key], object2[key]];
    const isObjects = isObject(value1) && isObject(value2);

    if (!isObjects) {
      return false;
    }
  }
  return true;
};

const isObject = (object) => {
  return object != null && typeof object === "object";
};

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = selectAllConersations(store.getState());

  if (!currentValue || !previousValue) {
    return;
  }

  if (!isDeepEqual(currentValue, previousValue)) {
    Object.keys(currentValue).length &&
      participantsService.syncDataFromChats(Object.keys(currentValue));
  }
}
store.subscribe(handleChange);

export default participantsService;
