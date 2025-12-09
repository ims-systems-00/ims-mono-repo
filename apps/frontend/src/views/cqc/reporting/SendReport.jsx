import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { sendReport } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

const SendReport = ({ processing, setProcessing, addToTable }) => {
  let { authGlobalAccess } = useAccess();
  let notify = React.useContext(NotificationContext);
  let { cqcGroups } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  const dataSet = {
    data: {
      group: {
        value: null,
        label: "Select business unit",
      },
      personName: "",
      email: "",
      message: "",
      attachments: [],
    },
    errors: {},
  };
  const schema = {
    group: IVal.object().keys({
      value: IVal.string().required().label("Business unit"),
      label: IVal.string().required().label("Business unit"),
    }),
    personName: IVal.string().required().label("Name "),
    email: IVal.string().email().required().label("Email"),
    message: IVal.label("Message"),
    attachments: IVal.array().label("Attachments"),
  };
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "send": {
          setProcessing({ action: "send", id: null });
          let { data } = await sendReport(dataModel.data);
          addToTable && addToTable(data.cqcReport);
          notify(
            `Report sent to ${dataModel.data.personName} ${dataModel.data.email} successfully`,
            "success"
          );
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("CQCSendReport", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal">
      <ImsInputText
        label="Name"
        name="personName"
        placeholder="Name"
        value={data.personName}
        onChange={handleChange}
        error={errors.personName}
      />
      <Row>
        <Col md="6">
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={cqcGroups.map((cqcGroup) => ({
              value: cqcGroup._id,
              label: cqcGroup.name,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
          />
        </Col>
      </Row>

      <ImsInputText
        label="Message"
        name="message"
        placeholder="Message"
        type="textarea"
        rows="6"
        value={data.message}
        onChange={handleChange}
        error={errors.message}
      />
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="cqcReport"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      <ImsButtonGroup>
        {" "}
        <Button
          name="send"
          onClick={(e) => handleSubmit(e, doSubmit)}
          disabled={validate() ? true : processing.action === "send"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "send" ? "Processing" : "Send"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default SendReport;
