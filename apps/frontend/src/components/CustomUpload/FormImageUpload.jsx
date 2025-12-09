import defaultImage from "@/assets/img/image-placeholder.jpg";
import PhotoUpload from "@/components/ImageEditor/Index";
import NotificationContext from "@/contexts/notificationContext";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useEffect } from "react";
import { imsLogger } from "@/services/loggerService";
const FormImageUpload = ({
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
  onUpdateEnd = () => {},
  ...rest
}) => {
  const { customerLogo } = rest;
  // const [openEditorModal, setEditorModal] = React.useState(false);
  // const toggleEditorModal = () => {
  //   setEditorModal(!openEditorModal);
  // };
  const [openFormEditor, setOpenFormEditor] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    imageUrl ? imageUrl : defaultImage
  );

  React.useEffect(() => {
    clearAll && setImagePreviewUrl(defaultImage);
  }, [clearAll]);

  const [newImage, setNewImage] = React.useState(null);
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
      // const scaleSize = SQUARE_ARM / e.target.width;
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
        processImage(reader.result, file.name);
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
        toggleModal();
      });
    }
  }, [file]);

  return (
    <>
      <div className="fileinput text-center">
        <input type="file" onChange={handleDocumentChange} ref={fileInput} />

        {imageUrl || customerLogo ? (
          <div className={"thumbnail" + (avatar ? "img-circle" : "")}>
            <img
              src={imageUrl ? imageUrl : customerLogo ? customerLogo : null}
              alt="..."
            />
          </div>
        ) : null}
        <div className="upload-btn mt-3">
          <Button
            onClick={() => {
              handleClick();
            }}
          >
            Upload Logo
          </Button>
        </div>
      </div>
      {/* <ImageEditor
        toggleModal={toggleModal}
        openEditorModal={openEditorModal}
        toggleEditorModal={toggleEditorModal}
        photoUrl={customerLogo ? customerLogo : imagePreviewUrl}
        name={name}
        newImage={newImage}
        setNewImage={setNewImage}
        {...rest}
      ></ImageEditor> */}
      <PhotoUpload
        toggleModal={toggleModal}
        modalOpen={modalOpen}
        openFormEditor={openFormEditor}
        setOpenFormEditor={setOpenFormEditor}
        // toggleEditorModal={toggleEditorModal}
        photoUrl={customerLogo ? customerLogo : imagePreviewUrl}
        name={name}
        newImage={newImage}
        setNewImage={setNewImage}
        file={file}
        setFile={setFile}
        avatar={avatar}
        formUpload={true}
        {...rest}
      />
    </>
  );
};

export default FormImageUpload;
