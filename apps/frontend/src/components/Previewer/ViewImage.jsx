import React, { useEffect, useState } from "react";
import { getSignedUrl } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import ToolBar from "./ToolBar";
const ViewImage = ({
  imageInfo = {
    ETag: '"7e935500d0d1cd2966e1a722aabce7d3"',
    VersionId: "F5QIHSnsfpiJCyg_7SJ68fN8A.vDHye5",
    Location:
      "https://sandbox-ims-static-resources-bucket.s3.eu-west-2.amazonaws.com/general/bg5.jpg",
    key: "general/bg5.jpg",
    Key: "general/bg5.jpg",
    Bucket: "sandbox-ims-static-resources-bucket",
  },
  toolBarProps,
}) => {
  let [previewUrl, setPreviewUrl] = useState(null);
  const generateImageUrl = async () => {
    try {
      let { data } = await getSignedUrl(imageInfo);
      setPreviewUrl(data.url);
    } catch (err) {
      imsLogger(err);
    }
  };
  useEffect(() => {
    generateImageUrl();
  }, []);
  return (
    <>
      <ToolBar fileDetails={imageInfo} {...toolBarProps} />
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        {!previewUrl ? (
          <span className="text-danger font-size-subtitle-2">
            Image source is required
          </span>
        ) : (
          <img
            className="img-fluid rounded"
            src={previewUrl}
            alt={imageInfo.key}
          />
        )}
      </div>
    </>
  );
};

export default ViewImage;
