import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { addOnBoardingFile } from "@/services/supplierManagementServices";
import IVal from "@/validations/validator";
import {
  CustomAttachments,
  CustomDocUpload,
  CustomProgressBar,
} from "@/views/shared/CustomFormElements";
import { SupplierReviewActionsContext } from "./context/SupplierActionsContext";

const AttachOnboardingForom = ({ supplier }) => {
  const dataSet = {
    data: {
      onboarding: null,
    },
    errors: {},
  };
  const schema = {
    onboarding: IVal.object().label("onboarding"),
  };

  let notify = React.useContext(NotificationContext);
  const { refreshSupplier, processing, setProcessing } = useContext(
    SupplierReviewActionsContext
  );
  let [uploading, setUploading] = useState({ status: false, progress: 0 });
  const { dataModel, handleSubmit, validate, setDataModel } = useForm(
    dataSet,
    schema
  );

  async function handleUpload(file, name) {
    setUploading((prevState) => ({ ...prevState, status: true }));
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploading((prevState) => ({
          ...prevState,
          progress: percentCompleted,
        }));
      },
    };
    try {
      let { data } = await uploadFileToS3(file, name, config);
      let details = data.uploadInformation;
      setDataModel((prevData) => {
        let updatedModel = { ...prevData };
        updatedModel.data.onboarding = details;
        return updatedModel;
      });
    } catch (ex) {
      imsLogger("SupplierAttachOnboardingForm", ex, ex.response);
    }
    setUploading({ status: false, progress: 0 });
  }
  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-onboarding", id: null });
          let { data } = await addOnBoardingFile(supplier._id, dataModel.data);
          notify("Onboarding ocument attached successfully ", "success");
          refreshSupplier(data.supplier);
          break;
        }
      }
    } catch (ex) {
      notify(
        "Onboarding document create failed.Unknown server error occurred",
        "danger"
      );
      imsLogger("SupplierAttachOnboardingForm", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <CustomAttachments
        label={"File name"}
        attachments={data.onboarding ? [data.onboarding] : []}
      />
      {uploading.status ? (
        <CustomProgressBar value={uploading.progress} color="info">
          {`${uploading.progress === 100 ? "Processing" : uploading.progress}%`}
        </CustomProgressBar>
      ) : (
        <Row>
          <CustomDocUpload
            label={"Onboarding file"}
            onUpload={(file) => handleUpload(file, "onboarding")}
          />
        </Row>
      )}
      <Row>
        <Col sm="2"></Col>
        <Col sm="3">
          {
            <Button
              name="attach"
              onClick={(e) => handleSubmit(e, doSubmit)}
              disabled={
                validate() ? true : processing.action === "attach-onboarding"
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "attach-onboarding"
                ? "Processing"
                : "Attach"}
            </Button>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default AttachOnboardingForom;
