import defaultImage from "@/assets/img/image-placeholder.jpg";
import NotificationContext from "@/contexts/notificationContext";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import {
  deleteFileFromS3,
  uploadFileToS3,
} from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
const ImageUpload = ({
  avatar,
  imageUrl,
  name,
  clearAll = false,
  addBtnColor,
  addBtnClasses,
  changeBtnColor,
  changeBtnClasses,
  removeBtnColor,
  removeBtnClasses,
  onUpload = () => {},
  onUpdateEnd = () => {},
}) => {
  let [uploading, setUploading] = useState({ status: false, progress: 0 });
  let [stagedFile, setStagedFile] = React.useState(null);
  let notify = React.useContext(NotificationContext);
  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    imageUrl ? imageUrl : defaultImage
  );
  const allowedTypes = ["png", "jpg", "jpeg"];
  const fileInput = React.useRef(null);
  React.useEffect(() => {
    clearAll && setImagePreviewUrl(defaultImage);
    clearAll && setStagedFile([]);
  }, [clearAll]);
  const checkImageSize = (file) => {
    if (file.size > 2500000) {
      notify("Profile image can not exceed 2MB", "danger");
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    onUpdateEnd();
  }, [file, imagePreviewUrl, stagedFile]);

  function processImage(image, fileName) {
    const virtualImage = document.createElement("img");
    const virtualImageMime = image?.substring(
      image.indexOf(":") + 1,
      image.indexOf(";")
    );
    virtualImage.src = image;
    virtualImage.onload = function (e) {
      const canvas = document.createElement("canvas");
      const SQUARE_ARM =
        e.target.width >= e.target.height ? e.target.height : e.target.width;
      const scaleSize = SQUARE_ARM / e.target.width;
      canvas.width = SQUARE_ARM;
      canvas.height = SQUARE_ARM;
      const centreX = e.target.width / 2;
      const centreY = e.target.height / 2;
      const originX = centreX - SQUARE_ARM / 2;
      const originY = centreY - SQUARE_ARM / 2;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        e.target,
        originX,
        originY,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      canvas.toBlob(function (file) {
        let processedFile = new File([file], fileName, {
          type: virtualImageMime,
          lastModified: Date.now(),
        });
        setImagePreviewUrl(canvas.toDataURL());
        setFile(processedFile);
        imsLogger("ImageUpload", processedFile);
      }, virtualImageMime);
    };
  }
  function downScale(image, fileName) {
    const virtualImage = new Image();
    virtualImage.src = image;
    const virtualImageMime = image?.substring(
      image.indexOf(":") + 1,
      image.indexOf(";")
    );
    virtualImage.onload = function (e) {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / e.target.width;
      canvas.width = MAX_WIDTH;
      canvas.height = virtualImage.height * scaleSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toDataURL(virtualImageMime, 1);
      processImage(canvas.toDataURL(virtualImageMime, 1), fileName);
    };
  }

  const handleDocumentChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      let extension = file.name.split(".").pop().toLowerCase(),
        isSuccess = allowedTypes.indexOf(extension) > -1;
      if (isSuccess && checkImageSize(file)) {
        imsLogger("ImageUpload", file);
        downScale(reader.result, file.name);
        setImagePreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (file) => {
    setUploading((prevState) => ({ ...prevState, status: true }));
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploading({ status: false, progress: 0 });
      },
    };
    try {
      let { data } = await uploadFileToS3(file, name, config);
      onUpload([data.uploadInformation]);
      setStagedFile(data.uploadInformation);
    } catch (err) {}
    setUploading((prevState) => ({ ...prevState, status: false }));
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    stagedFile && deleteFileFromS3(stagedFile.key || stagedFile.Key);
    setImagePreviewUrl(imageUrl ? imageUrl : defaultImage);
    setStagedFile(null);
    fileInput.current.value = null;
  };
  return (
    <div className="fileinput text-center">
      {uploading.status && (
        <span className="text-warning">Uploading {uploading.progress}%</span>
      )}
      <input type="file" onChange={handleDocumentChange} ref={fileInput} />
      <div className={"thumbnail" + (avatar ? "img-circle" : "")}>
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div>
        {file === null ? (
          <Button
            size="sm"
            color={addBtnColor}
            className={addBtnClasses}
            onClick={() => handleClick()}
          >
            {avatar ? "Select" : "Select"}
          </Button>
        ) : (
          <span>
            <Button
              size="sm"
              color={changeBtnColor}
              className={changeBtnClasses}
              onClick={() => handleClick()}
            >
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button
              size="sm"
              color={removeBtnColor}
              className={removeBtnClasses}
              onClick={() => handleRemove()}
            >
              <i className="fa fa-times" />
            </Button>
            <Button
              size="sm"
              color={removeBtnColor}
              className={removeBtnClasses}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(file);
              }}
            >
              <i className="fas fa-upload"></i>
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
