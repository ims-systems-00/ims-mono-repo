import ImageUpload from "@/components/CustomUpload/ImageUpload";
import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { changeOrganisationLogo } from "@/services/organizationService";
import { changeProfilePic } from "@/services/userServices";
import IVal from "@/validations/validator";
import { CustomProgressBar } from "@/views/shared/CustomFormElements";

const AvatarUploadForm = ({
  user,
  org,
  refreshOrganisation,
  orgLogo,
  imageUrl,
  refreshUser,
  processing,
  setProcessing,
}) => {
  const dataSet = {
    data: {
      profileImageInfo: null,
    },
    errors: {},
  };
  const schema = {
    profileImageInfo: IVal.array().min(1).label("Profile image"),
  };

  let notify = React.useContext(NotificationContext);

  let [uploading, setUploading] = useState({ status: false, progress: 0 });
  const { dataModel, handleSubmit, handleFileChange, validate } = useForm(
    dataSet,
    schema
  );
  let doSubmit = async (e, dataModel) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-iamge", id: null });
          if (orgLogo) {
            let { data } = await changeOrganisationLogo(dataModel.data);
            refreshOrganisation && refreshOrganisation(data.organization);
            let key =
              org.logo && (org.logo.metadata.key || org.logo.metadata.Key);
            deleteFileFromS3(key);
            notify(
              "Organisation logo uploaded successfully. This may take a while to update across the system",
              "success"
            );
          } else {
            let { data } = await changeProfilePic(user._id, dataModel.data);
            refreshUser(data.user);
            let key =
              user.profileImageInfo &&
              (user.profileImageInfo.key || user.profileImageInfo.Key);
            deleteFileFromS3(key);
            notify(
              "Profile picture uploaded successfully. This may take a while to update across the system",
              "success"
            );
          }

          break;
        }
      }
    } catch (ex) {
      notify("Document could not be added", "danger");
      imsLogger("AvatarUploadForm", ex.response || ex);
    }
    setProcessing(false);
  };
  let { data, errors } = dataModel;

  return (
    <div className="upload-profile">
      <div className="profile-pic">
        {uploading.status ? (
          <CustomProgressBar value={uploading.progress} color="info">
            {`${
              uploading.progress === 100 ? "Processing" : uploading.progress
            }%`}
          </CustomProgressBar>
        ) : null}
        <Row>
          <ImageUpload
            imageUrl={imageUrl}
            avatar={false}
            name="profile"
            onUpload={(files) => handleFileChange(files, "profileImageInfo")}
            addBtnColor="success"
            changeBtnColor="default"
            changeBtnClasses={"btn-simple"}
            removeBtnClasses={"btn-simple"}
            addBtnClasses={"btn-simple"}
          />
        </Row>

        <div className="upload-profile">
          <div>
            {
              <Button
                size="sm"
                name="attach"
                onClick={(e) => handleSubmit(e, doSubmit)}
                disabled={
                  validate() ? true : processing.action === "attach-iamge"
                }
                className="btn-simple"
                color="primary"
                type="button"
              >
                {processing.action === "attach-iamge" ? "Processing" : "Attach"}
              </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default AvatarUploadForm;
