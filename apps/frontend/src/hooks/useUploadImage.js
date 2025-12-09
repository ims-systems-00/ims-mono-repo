import { imsLogger } from "@/services/loggerService";

const useUploadImage = () => {
  const handleImageSubmit = async (
    file = null,
    name = "",
    setUploading = () => {},
    setStagedFile = () => {},
    onUpload,
    uploadFileToS3 = null
  ) => {
    setUploading((prevState) => ({ ...prevState, status: true }));
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploading({ status: false, progress: 0 });
      },
      public: "ims-systems-public-media-files",
    };
    try {
      let { data } = await uploadFileToS3(file, name, config);
      onUpload([data.uploadInformation]);
      setStagedFile(data.uploadInformation);
      imsLogger("ImageUpload", data);
    } catch (err) {
      imsLogger("ImageUpload", err);
    }
    setUploading((prevState) => ({ ...prevState, status: false }));
  };

  return {
    handleImageSubmit,
  };
};

export default useUploadImage;
