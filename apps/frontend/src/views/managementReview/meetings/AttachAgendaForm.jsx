import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { addAgenda } from "@/services/managementReviewServices";
import IVal from "@/validations/validator";
import {
  CustomAttachments,
  CustomDocUpload,
  CustomProgressBar,
} from "@/views/shared/CustomFormElements";
import { ManagementReviewActionsContext } from "./context/ManagementReviewActionsContext";

const AttachAgendaForm = ({ managementReview }) => {
  const dataSet = {
    data: {
      agenda: null,
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    agenda: IVal.object().label("agenda"),
  };

  let notify = React.useContext(NotificationContext);
  const { refreshManagementReview, processing, setProcessing } = useContext(
    ManagementReviewActionsContext
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
        updatedModel.data.agenda = details;
        return updatedModel;
      });
    } catch (ex) {
      imsLogger("AttachAgendaForm", ex, ex.response);
    }
    setUploading({ status: false, progress: 0 });
  }
  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-agenda", id: null });
          let { data } = await addAgenda(managementReview._id, dataModel.data);
          notify("Agenda attached successfully ", "success");
          refreshManagementReview(data.managementReview);
          break;
        }
      }
    } catch (ex) {
      notify("Document could not be added", "danger");
      imsLogger("AttachAgendaForm", ex.response || ex);
    }
    setProcessing(false);
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <CustomAttachments
        label={"File name"}
        attachments={data.agenda ? [data.agenda] : []}
      />
      {uploading.status ? (
        <CustomProgressBar value={uploading.progress} color="info">
          {`${uploading.progress === 100 ? "Processing" : uploading.progress}%`}
        </CustomProgressBar>
      ) : (
        <Row>
          <CustomDocUpload
            label={"Agenda"}
            onUpload={(file) => handleUpload(file, "agenda")}
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
                validate() ? true : processing.action === "attach-agenda"
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "attach-agenda" ? "Processing" : "Attach"}
            </Button>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default AttachAgendaForm;
