export default function getOpponentId(chatObject, currentUserId) {
  return chatObject.opponent_id === currentUserId
    ? chatObject.owner_id
    : chatObject.opponent_id;
}
