import api from "./api";

export default async function getFileLinks(attachments) {
  const attIds = Object.keys(attachments);
  const mUpdate = {};

  for (let i = 0; i < attIds.length; i += 10) {
    const ids = attIds.slice(i, 10);
    const urls = await api.getDownloadUrlForFiles({ file_ids: ids });

    for (const fileId in urls) {
      const mid = attachments[fileId]._id;

      if (!mUpdate[mid]) {
        mUpdate[mid] = { _id: mid, attachments: [] };
      }
      mUpdate[mid].attachments.push({
        file_id: attachments[fileId].file_id,
        file_name: attachments[fileId].file_name,
        file_url: urls[fileId],
      });
    }

    return Object.values(mUpdate);
  }
}
