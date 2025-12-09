import useUploadImage from "@/hooks/useUploadImage";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";
import { uploadFileToS3 } from "@/services/fileHandlerService";

const PreviewEdited = ({
  previewImageUrl,
  setCroppedImage,
  setNewImage,
  toggleModal,
  setOpenFormEditor = () => {},
  setOpenScreen,
  stagedFile,
  setStagedFile,
  setFile,
  blobFileData,
  file,
  ...props
}) => {
  const {
    onUpload,
    onUpdateEnd = () => {},
    name,
    isUploadable = true,
    setFormImage,
    url,
  } = props || {};
  let [uploading, setUploading] = useState({ status: false, progress: 0 });
  let { handleImageSubmit } = useUploadImage(); // hook that uploads image to S3 Bucket

  const handleSubmit = async (e) => {
    await handleImageSubmit(
      blobFileData,
      name,
      setUploading,
      setStagedFile,
      onUpload,
      uploadFileToS3
    );
    if (isUploadable) {
      setOpenScreen("photoConfirm");
    } else {
      setFormImage(url);
      setOpenScreen("photoUpload");
      setOpenFormEditor(true);
    }
  };

  // React.useEffect(() => {
  //   onUpdateEnd();
  // }, [file, url, stagedFile, onUpdateEnd]);

  return (
    <>
      <div>
        <h3 className=" mb-3 text-center text-info font-weight-600">
          Preview Image
        </h3>

        <div>
          <div className="d-flex flex-column align-items-center justify-content-between">
            {uploading.status && (
              <span className="text-warning my-3 font-size-subtitle-2">
                Uploading {uploading.progress}%
              </span>
            )}
            <div className="preview-image d-flex align-items-center">
              <img src={url} alt="Preview" />
            </div>
          </div>
          <div className="mt-2 d-flex justify-content-center">
            <Button
              color="danger"
              className=""
              onClick={() => {
                setOpenScreen("photoUpload");
                toggleModal();
                setNewImage(null);
                setFile(null);
                setOpenFormEditor(true);
              }}
            >
              Close
            </Button>
            <Button
              onClick={(e) => {
                handleSubmit(e);
                if (!isUploadable) {
                  toggleModal();
                }
              }}
              disabled={uploading.status || !url}
              color="success"
              className=""
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewEdited;
