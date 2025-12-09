import { Button, Col } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { useUiManager } from "../uiManager";
import ImageDropZone from "./ImageDropzone";
import { useCreateOrganisation } from "./store";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";

const StepBLogo = () => {
  const { nextStep } = useUiManager();
  const { updateLogo, updateLogoSelection, logoselection } =
    useCreateOrganisation();
  const [uploading, setUploading] = useState({ status: false, progress: 0 });
  async function _uploadFile(selection) {
    let { file } = selection;
    setUploading((prevState) => ({ ...prevState, status: true }));
    const config = {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploading((prevState) => ({
          ...prevState,
          progress: percentCompleted,
        }));
      },
      public: "ims-systems-public-media-files",
    };
    try {
      let { data } = await uploadFileToS3(file, file.name, config);
      updateLogo({ logometadata: data.uploadInformation });
      nextStep();
    } catch (error) {
      imsLogger("", error);
    }
    setUploading({ status: false, progress: 0 });
  }

  return (
    <React.Fragment>
      <Col md="12">
        <div className="w-50 text-center mx-auto">
          <h3>Upload logo</h3>
          <p className="mb-4">
            Please upload your organisation's logo to complete your profile.
          </p>
        </div>
        <ImageDropZone
          hint="Select or drop"
          url={logoselection?.url}
          onChange={(e) => {
            updateLogoSelection(e);
          }}
        />
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Button
            outline
            color="primary"
            onClick={() => {
              /** defaulting because default doesn't provide any data. as user want to skip we ignore data */
              updateLogo(logoselection);
              nextStep();
            }}
          >
            Skip for now{" "}
            <i className={`ims-icons-20 icon-icon-arrowbendupright-24`} />
          </Button>
          <Button
            color="primary"
            disabled={uploading.status || !logoselection}
            onClick={() => {
              _uploadFile(logoselection);
            }}
          >
            Confirm & proceed{" "}
            <i className={`ims-icons-20 icon-icon-arrowright-24`} />
          </Button>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default StepBLogo;
