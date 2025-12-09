import NotificationContext from "@/contexts/notificationContext";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useEffect } from "react";
import { imsLogger } from "@/services/loggerService";

const PhotoUpload = ({
  photoUrl,
  avatar,
  modalOpen,
  toggleModal,
  title,
  file,
  setFile,
  newImage,
  setNewImage,
  openScreen,
  setOpenScreen,

  ...props
}) => {
  const fileInput = React.useRef(null);

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
      //   const scaleSize = SQUARE_ARM / e.target.width;
      canvas.width = e.target.width;
      canvas.height = e.target.height;
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
        //  setImagePreviewUrl(canvas.toDataURL());
        setFile(processedFile);
        imsLogger("ImageUpload", processedFile);
      }, virtualImageMime);
    };
  }

  let notify = React.useContext(NotificationContext);
  const checkImageSize = (file) => {
    if (file.size > 2500000) {
      notify("Profile image can not exceed 2MB", "danger");
      return false;
    }
    return true;
  };
  const allowedTypes = ["png", "jpg", "jpeg"];
  const handleDocumentChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      let extension = file.name.split(".").pop().toLowerCase(),
        isSuccess = allowedTypes.indexOf(extension) > -1;
      if (isSuccess && checkImageSize(file)) {
        imsLogger("ImageUpload", file);
        // setStagedFile(file);
        // setImagePreviewUrl(reader.result);
        processImage(reader.result, file.name);
        // setFile(file);
        // toggleEditorModal();
      }
    };
    reader.readAsDataURL(file);
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.onloadend = (e) => {
        baseURL = reader.result;
        resolve(baseURL);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (file) {
      getBase64(file).then((result) => {
        setNewImage(result);
        setOpenScreen("photoEditor");
      });
    }
  }, [file, setNewImage, setOpenScreen]);

  return (
    <>
      <div>
        <h3 className="text-center mb-3 mb-0 font-weight-600">
          {title ? title : "Upload Photo"}
        </h3>
        <div className="d-flex justify-content-center mb-4">
          <div className="fileinput text-center">
            <input
              type="file"
              onChange={handleDocumentChange}
              ref={fileInput}
            />
            <div className={"thumbnail" + (avatar ? "img-circle" : "")}>
              <img className="modal-img" src={photoUrl} alt="..." />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center flex-wrap">
          <Button
            color="danger"
            className=""
            onClick={() => {
              toggleModal();
              setFile(null);
              setNewImage(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenScreen("photoEditor");
            }}
            color="primary"
            className=" "
          >
            Edit
          </Button>
          <Button
            color="info"
            className=""
            onClick={() => {
              handleClick();
            }}
          >
            Upload photo
          </Button>
        </div>
      </div>
    </>
  );
};

export default PhotoUpload;
