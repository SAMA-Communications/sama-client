import api from "./api";

async function getDownloadFileLinks(attachments) {
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

async function getFileObjects(files) {
  const attachments = [];
  const filesParams = [...files];

  const fileUploadUrls = await api.createUploadUrlForFiles({
    files: filesParams.map((file) => {
      return {
        name: file.name,
        size: file.size,
        content_type: file.type,
      };
    }),
  });

  for (let i = 0; i < fileUploadUrls.length; i++) {
    const file = fileUploadUrls[i];
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": file.content_type },
      body: files[i],
    };
    await fetch(file.upload_url, requestOptions);

    attachments.push({
      file_id: file.object_id,
      file_name: file.name,
    });
  }

  const fileDownloadUrl = await api.getDownloadUrlForFiles({
    file_ids: fileUploadUrls.map((obj) => obj.object_id),
  });

  return attachments.map((att) => {
    return { ...att, file_url: fileDownloadUrl[att.file_id] };
  });
}

export { getDownloadFileLinks, getFileObjects };
