const updateNeedToUploadAvatar = (userObject, array) => {
  const { avatar_url, avatar_object, _id: userId } = userObject;
  if (avatar_object && !avatar_url) {
    array[avatar_object.file_id] = {
      _id: userId,
      ...avatar_object,
    };
  }
};

export default updateNeedToUploadAvatar;
