import messagesService from "@services/messagesService.js";

import { useConfirmWindow } from "@tools/useConfirmWindow.js";

import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { history } from "@utils/history.js";

export default function useMessages() {
  const { pathname, hash, search } = history.location;
  const url = pathname + hash + search;

  const confirmWindow = useConfirmWindow();

  const deleteSelectedMessages = async (selectedCID, mids) => {
    const { isConfirm, data } = await confirmWindow({
      title: `Delete selected message${mids.length > 1 ? "s" : ""}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      action: "messageDelete",
    });
    isConfirm && messagesService.sendMessageDelete(selectedCID, mids, data.type);
    removeAndNavigateLastSection(pathname + hash);
  };

  const getSelectedMessages = () => {
    const match = hash.match(/mids=\[([^\]]*)\]/);
    if (!match?.[1]) return null;
    const mids = match[1]
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    return {
      countOfSelectedMessages: mids.length,
      midsArrayOfSelectedMessages: mids,
    };
  };

  return {
    deleteSelectedMessages,
    getSelectedMessages,
  };
}
