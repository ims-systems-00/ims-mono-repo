import defaultAvatar from "@/assets/img/default-avatar.png";
import { useEffect, useState } from "react";
import { getFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
const useImageProcessor = (
  imgMetaData,
  config = {
    fallbackImage: defaultAvatar,
  }
) => {
  let [blobImage, setBlobImage] = useState(config.fallbackImage);
  async function _loadBlobPicture(imgMetaData) {
    try {
      let data = await getFileFromS3(imgMetaData?.Key);
      const virtualImageMime = blobImage?.substring(
        blobImage.indexOf(":") + 1,
        blobImage.indexOf(";")
      );
      let url = window.URL.createObjectURL(
        new Blob([data], { type: virtualImageMime })
      );
      setBlobImage(url);
    } catch (err) {
      imsLogger("useImageProcessor", err);
    }
  }
  useEffect(() => {
    if (imgMetaData?.Key) {
      _loadBlobPicture(imgMetaData);
    }
  }, [imgMetaData]);
  return {
    blobImage,
  };
};
export default useImageProcessor;
