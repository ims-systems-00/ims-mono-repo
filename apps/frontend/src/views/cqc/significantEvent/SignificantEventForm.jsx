import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  createSignificantEvent,
  mapToSignificantEventModel,
  updateSignificantEvent,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsInputCheck,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import {
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import { handleUpload } from "@/utils/formatLinkGenerator";

const SignificantEventForm = ({
  addToTable,
  significantEvent,
  processing,
  setProcessing,
  refreshSignificantEvent,
}) => {
  let { authGlobalAccess } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  let { cqcGroups } = useContext(SuperGlobalContext);
  let notify = useContext(NotificationContext);
  const viewContextData = useContext(ViewContext);
  const history = useHistory();

  const dataSet = significantEvent
    ? mapToSignificantEventModel(significantEvent)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          title: "",
          description: "",
          dateOfEvent: "",
          dateOfReviewMeeting: "",
          presentPersonnel: "",
          positivePoints: "",
          keyIssues: "",
          areasOfConcern: "",
          attachments: [],
          signatureStatus: false,
        },
        errors: {},
      };
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    title: IVal.string().required().label("Title"),
    dateOfEvent: IVal.string().required().label("Date of event"),
    description: IVal.string().required().label("Description"),
    dateOfReviewMeeting: IVal.string()
      .required()
      .label("Date of review meeting"),
    presentPersonnel: IVal.string().required().label("Present personnel"),
    positivePoints: IVal.string().required().label("Positive points"),
    keyIssues: IVal.string().required().label("Key issues"),
    areasOfConcern: IVal.string().required().label("Areas of concern"),
    attachments: IVal.array().label("Attachments"),
    signatureStatus: IVal.boolean().required().label("Sign off"),
  };

  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      try {
        switch (submissionType) {
          case "create": {
            setProcessing({ action: "create", id: null });
            let { data } = await createSignificantEvent(dataModel.data);
            notify("Significant event created successfully", "success");
            addToTable && addToTable(data.significantEvent);
            history.push(
              `/admin/cqc/significantevent/${data.significantEvent?._id}`
            );
            break;
          }
          case "update": {
            setProcessing({ action: "update", id: null });
            let { data } = await updateSignificantEvent(
              significantEvent._id,
              dataModel.data
            );
            notify("Significant event updated successfully", "success");
            viewContextData.switchView && viewContextData.switchView();
            refreshSignificantEvent &&
              refreshSignificantEvent(data.significantEvent);
            break;
          }
          default:
            break;
        }
      } catch (ex) {
        imsLogger("SignificantEventActionForm", ex.response || ex);
        notify("Unknown server error occurred", "danger");
      }
    } catch (ex) {
      imsLogger("SignificantEventActionForm", ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal">
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
            label="Title"
            name="title"
            value={data.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Title"
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Date of event"
            name="dateOfEvent"
            value={data.dateOfEvent}
            onChange={handleChange}
            error={errors.dateOfEvent}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Areas of concern"
            name="areasOfConcern"
            value={data.areasOfConcern}
            onChange={handleChange}
            error={errors.areasOfConcern}
            placeholder="Areas of concern"
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Date of review meeting"
            name="dateOfReviewMeeting"
            value={data.dateOfReviewMeeting}
            onChange={handleChange}
            error={errors.dateOfReviewMeeting}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Present personnel"
            name="presentPersonnel"
            value={data.presentPersonnel}
            onChange={handleChange}
            error={errors.presentPersonnel}
            placeholder="Present Personnel"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Positive points"
            name="positivePoints"
            value={data.positivePoints}
            onChange={handleChange}
            error={errors.positivePoints}
            placeholder="Positive points"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Key issues"
            name="keyIssues"
            value={data.keyIssues}
            onChange={handleChange}
            error={errors.keyIssues}
            placeholder="Key issues"
          />
        </Col>
      </Row>
      <ImsTextEditor
        label="Description"
        name="description"
        value={significantEvent?.description}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        onChange={handleChange}
        error={errors.description}
        placeholder="Add a description"
      />

      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="cqcReport"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      {significantEvent && (
        <ImsInputCheck
          checked={data.signatureStatus}
          label="Closed"
          name="signatureStatus"
          value={data.signatureStatus}
          onChange={handleChange}
          error={errors.signatureStatus}
        />
      )}
      <ImsButtonGroup>
        {significantEvent ? (
          <>
            <Button
              name="cancel"
              className="btn-fill"
              color="danger"
              type="button"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              name="update"
              disabled={validate() ? true : processing.action === "update"}
              className="btn-fill"
              color="info"
              type="button"
              onClick={(e) => handleSubmit(e, doSubmit, false)}
            >
              {processing.action === "update"
                ? "Processing"
                : data.signatureStatus
                ? "Close"
                : "Update"}
            </Button>
          </>
        ) : (
          <Button
            name="create"
            disabled={validate() ? true : processing.action === "create"}
            className="btn-fill"
            color="primary"
            type="button"
            onClick={(e) => handleSubmit(e, doSubmit)}
          >
            {processing.action === "create" ? "Processsing" : "Confirm"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default SignificantEventForm;
