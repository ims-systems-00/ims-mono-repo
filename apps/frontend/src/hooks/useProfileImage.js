import { useState, useEffect } from "react";
import { imsLogger } from "@/services/loggerService";
import { getProfileImage } from "@/services/userServices";
import defaultAvatar from "@/assets/img/default-avatar.png";
const useProfileImage = (user) => {
  let [profileImage, setProfileImage] = useState(defaultAvatar);
  async function _loadProfilePicure(user) {
    try {
      let { data } = await getProfileImage(user._id);
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "image/jpeg" })
      );
      setProfileImage(url);
    } catch (err) {
      imsLogger("useProfileImage", err);
    }
  }
  useEffect(() => {
    user._id && _loadProfilePicure(user);
  }, [user]);
  return {
    profileImage,
  };
};
export default useProfileImage;
