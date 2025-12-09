import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import { addContract } from "@/services/supplierManagementServices";
import IVal from "@/validations/validator";
import {
  CustomAttachments,
  CustomDocUpload,
  CustomProgressBar,
} from "@/views/shared/ImsFormElements/Index";
import { SupplierReviewActionsContext } from "./context/SupplierActionsContext";

const AttachContractForm = ({ supplier }) => {
  const dataSet = {
    data: {
      contract: null,
    },
    errors: {},
  };
  const schema = {
    contract: IVal.object().label("Contract"),
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
        updatedModel.data.contract = details;
        return updatedModel;
      });
    } catch (ex) {
      imsLogger("SupplierAttachContractForm", ex, ex.response);
    }
    setUploading({ status: false, progress: 0 });
  }
  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-contract", id: null });
          let { data } = await addContract(supplier._id, dataModel.data);
          notify("Contract attached successfully ", "success");
          refreshSupplier(data.supplier);
          break;
        }
      }
    } catch (ex) {
      notify("Contract could not be attched", "danger");
      imsLogger("SupplierAttachContractForm", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <CustomAttachments
        label={"File name"}
        attachments={data.contract ? [data.contract] : []}
      />
      {uploading.status ? (
        <CustomProgressBar value={uploading.progress} color="info">
          {`${uploading.progress === 100 ? "Processing" : uploading.progress}%`}
        </CustomProgressBar>
      ) : (
        <Row>
          <CustomDocUpload
            label={"Contract"}
            onUpload={(file) => handleUpload(file, "contract")}
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
                validate() ? true : processing.action === "attach-contract"
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "attach-contract"
                ? "Processing"
                : "Attach"}
            </Button>
          }
        </Col>
      </Row>
    </Form>
  );
};

export default AttachContractForm;
