import api from "@api/api";

export default class DownloadManager {
  static async getDownloadFileLinks(attachments) {
    const attIds = Object.keys(attachments);
    const mUpdate = {};

    for (let i = 0; i < attIds.length; i += 10) {
      const ids = attIds.slice(i, i + 10);
      const urls = await api.getDownloadUrlForFiles({ file_ids: ids });

      for (const fileId in urls) {
        const mid = attachments[fileId]._id;

        if (!mUpdate[mid]) {
          mUpdate[mid] = { _id: mid, attachments: [] };
        }
        mUpdate[mid].attachments.push({
          ...attachments[fileId],
          file_url: urls[fileId],
        });
      }
    }

    return Object.values(mUpdate);
  }

  static async getFileObjects(files) {
    const attachments = [];

    const fileUploadUrls = await api.createUploadUrlForFiles({
      files: files.map((file) => {
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

  static async getFileObjectsFromUrls(filesInfo) {
    const files = await Promise.all(
      filesInfo.map(async ({ url, fileName, contentType }) => {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to fetch file from URL: ${url}`);
        const blob = await response.blob();
        return new File([blob], fileName, { type: contentType });
      })
    );

    const fileUploadUrls = await api.createUploadUrlForFiles({
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        content_type: file.type,
      })),
    });

    await Promise.all(
      fileUploadUrls.map((uploadInfo, i) => {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": uploadInfo.content_type },
          body: files[i],
        };
        return fetch(uploadInfo.upload_url, requestOptions);
      })
    );

    const fileDownloadUrl = await api.getDownloadUrlForFiles({
      file_ids: fileUploadUrls.map((obj) => obj.object_id),
    });

    return fileUploadUrls.map((uploadInfo) => ({
      file_id: uploadInfo.object_id,
      file_name: uploadInfo.name,
      file_url: fileDownloadUrl[uploadInfo.object_id],
    }));
  }
}
