import { useSelector } from "react-redux";

export default function useOpponentByCid(cid, currentUserId) {
  return useSelector((state) => {
    const conversation = state.conversations?.entities?.[cid];
    if (!conversation || conversation.type === "g") return null;

    const { owner_id, opponent_id } = conversation;
    const opponentKey = owner_id === currentUserId ? opponent_id : owner_id;
    return state.participants?.entities?.[opponentKey] ?? null;
  });
}
