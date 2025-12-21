import store from "@store/store.js";

export default function useParticipants() {
  const getParticipantsByIds = (uids, asObject = true) => {
    if (!uids?.length) return asObject ? {} : [];

    const participants = store.getState()?.participants?.entities || {};

    return uids.reduce(
      (acc, uid) => {
        if (participants[uid]) {
          asObject
            ? (acc[uid] = participants[uid])
            : acc.push(participants[uid]);
        }
        return acc;
      },
      asObject ? {} : []
    );
  };

  const getParticipantsByIdsAsObject = (uids) => {
    return getParticipantsByIds(uids, true);
  };

  const getParticipantsByIdsAsList = (uids) => {
    return getParticipantsByIds(uids, false);
  };

  const getCurrentUser = () => {
    const currentUserId = store.getState()?.currentUserId.value.id;
    const currentUser = store.getState()?.participants?.entities[currentUserId];
    return currentUser;
  };

  const getUserById = (uid) => {
    const currentUser = store.getState()?.participants?.entities[uid];
    return currentUser;
  };

  return {
    getParticipantsByIdsAsObject,
    getParticipantsByIdsAsList,
    getCurrentUser,
    getUserById,
  };
}
