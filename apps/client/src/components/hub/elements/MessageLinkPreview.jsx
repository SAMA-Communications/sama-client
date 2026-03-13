import { MessageLinkPreview as UIMessageLinkPreview } from "@sama-communications.ui-kit";

import { formatFileSize } from "@utils/MediaUtils.js";
import { SUPPORTED_DOCUMENT_PREVIEW_REGEX } from "@utils/constants.js";

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
    />
  );
}
