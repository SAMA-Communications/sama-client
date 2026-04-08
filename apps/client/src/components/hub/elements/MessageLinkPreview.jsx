import { MessageLinkPreview as UIMessageLinkPreview, PREVIEW_EXPAND_DIRECTION } from "@sama-communications.ui-kit";

import { SUPPORTED_DOCUMENT_PREVIEW_REGEX } from "@utils/constants.js";
import { formatFileSize } from "@utils/MediaUtils.js";

export default function MessageLinkPreview({ refreshFunc, urlData, color }) {
  if (!urlData) return null;

  const isDocument = SUPPORTED_DOCUMENT_PREVIEW_REGEX.test(urlData.url);
  const formattedFileSize = urlData.size != null ? formatFileSize(Number(urlData.size)) : undefined;

  return (
    <UIMessageLinkPreview
      urlData={urlData}
      color={color}
      onRefresh={refreshFunc}
      isDocument={isDocument}
      formattedFileSize={formattedFileSize}
      expandDirection={PREVIEW_EXPAND_DIRECTION}
    />
  );
}
