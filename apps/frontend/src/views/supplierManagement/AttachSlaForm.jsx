import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { addSla } from "@/services/supplierManagementServices";
import IVal from "@/validations/validator";
import {
  CustomAttachments,
  CustomDocUpload,
  CustomProgressBar,
} from "@/views/shared/ImsFormElements/Index";
import { SupplierReviewActionsContext } from "./context/SupplierActionsContext";

const AttachSlaForm = ({ supplier }) => {
  const dataSet = {
    data: {
      sla: null,
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    sla: IVal.object().label("SLA"),
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
        updatedModel.data.sla = details;
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
          setProcessing({ action: "attach-sla", id: null });
          let { data } = await addSla(supplier._id, dataModel.data);
          notify("SLA attached successfully ", "success");
          refreshSupplier(data.supplier);
          break;
        }
      }
    } catch (ex) {
      notify(
        "SLA could not be attached. Unknown server error occurred",
        "danger"
      );
      imsLogger("AttachSlaForm", ex.response || ex);
    }
    setProcessing(false);
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <CustomAttachments
        label={"File name"}
        attachments={data.sla ? [data.sla] : []}
      />
      {uploading.status ? (
        <CustomProgressBar value={uploading.progress} color="info">
          {`${uploading.progress === 100 ? "Processing" : uploading.progress}%`}
        </CustomProgressBar>
      ) : (
        <Row>
          <CustomDocUpload
            label={"SLA"}
            onUpload={(file) => handleUpload(file, "sla")}
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
              disabled={validate() ? true : processing.action === "attach-sla"}
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "attach-sla" ? "Processing" : "Attach"}
            </Button>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default AttachSlaForm;
