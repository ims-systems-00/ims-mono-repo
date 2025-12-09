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
  createWhistleBlow,
  mapToWhistleBlowModel,
  updateWhistleBlow,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
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

const WhistleBlowForm = ({
  addToTable,
  whistleBlow,
  processing,
  setProcessing,
  refreshWhistleBlow,
}) => {
  let { authGlobalAccess, entityAccessControl } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  let { cqcGroups } = useContext(SuperGlobalContext);
  let notify = useContext(NotificationContext);
  const viewContextData = useContext(ViewContext);
  const history = useHistory();

  const dataSet = whistleBlow
    ? mapToWhistleBlowModel(whistleBlow)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          reportedTo: {
            value: null,
            label: "Select personnel",
          },
          title: "",
          dateOfIncident: "",
          placeOfIncident: "",
          description: "",
          involvedPersonnel: [],
          sharedWith: [],
          opinion: "",
          identity: "",
          statementOfDisclosureOne: false,
          statementOfDisclosureTwo: false,
          statementOfDisclosureThree: false,
          signatureStatus: false,
        },
        errors: {},
      };

  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    reportedTo: IVal.object().keys({
      value: IVal.string().required().label("Reporter"),
      label: IVal.label("Reporter"),
    }),
    title: IVal.string().required().label("Title"),
    dateOfIncident: IVal.string().required().label("Date of incident"),
    placeOfIncident: IVal.string().required().label("Place of incident"),
    description: IVal.string().required().label("Description"),
    opinion: IVal.string().required().label("Opinion"),
    identity: IVal.label("Identity"),
    involvedPersonnel: IVal.array()
      .min(1)
      .required()
      .label("Involved personnel"),
    sharedWith: IVal.array().label("Shared with"),
    statementOfDisclosureOne: IVal.boolean().label("Statement 1"),
    statementOfDisclosureTwo: IVal.boolean().label("Statement 2"),
    statementOfDisclosureThree: IVal.boolean().label("Statement 3"),
    signatureStatus: IVal.boolean().label("Sign off"),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createWhistleBlow(dataModel.data);
          notify("Whistleblow created successfully", "success");
          addToTable && addToTable(data.whistleBlow);
          history.push(`/admin/cqc/whistleblows/${data.whistleBlow?._id}`);
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updateWhistleBlow(
            whistleBlow._id,
            dataModel.data
          );
          notify("Whistleblow updated successfully", "success");
          viewContextData.switchView && viewContextData.switchView();
          refreshWhistleBlow && refreshWhistleBlow(data.whistleBlow);
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("WhistleBlowForm", ex);
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
        {whistleBlow && whistleBlow.statementOfDisclosureThree ? null : (
          <Col md="6">
            <ImsInputSelect
              label="Business unit"
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
        )}

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
          <ImsInputSelect
            label="Report to"
            name="reportedTo"
            icon="icon-app"
            value={data.reportedTo}
            isDisabled={whistleBlow && whistleBlow.reportedTo._id}
            className="react-select default"
            classNamePrefix="react-select"
            error={errors.reportedTo}
            onChange={handleChange}
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Place of incident"
            name="placeOfIncident"
            value={data.placeOfIncident}
            onChange={handleChange}
            error={errors.placeOfIncident}
            placeholder="Place of incident"
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Date of incident"
            name="dateOfIncident"
            value={data.dateOfIncident}
            onChange={handleChange}
            error={errors.dateOfIncident}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            isMulti
            placeholder="Select involved personnel"
            label="Involved personnel"
            name="involvedPersonnel"
            value={data.involvedPersonnel}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users
              .filter((user) => user._id !== data.reportedTo.value)
              .map((user) => ({ value: user._id, label: user.name }))}
          />
        </Col>
      </Row>

      <ImsTextEditor
        label="Description"
        name="description"
        placeholder={"Add a description."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        value={whistleBlow?.description}
        onChange={handleChange}
        error={errors.description}
      />

      <ImsTextEditor
        label="If possible, explain how you think the matter may be best resolved"
        name="opinion"
        placeholder={"Add an opinion. Use @ to notify a user."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        value={whistleBlow?.opinion}
        onChange={handleChange}
        error={errors.opinion}
      />
      {!whistleBlow && (
        <>
          {((!data.statementOfDisclosureOne &&
            !data.statementOfDisclosureTwo &&
            !data.statementOfDisclosureThree) ||
            (data.statementOfDisclosureOne &&
              !data.statementOfDisclosureTwo &&
              !data.statementOfDisclosureThree)) && (
            <ImsInputCheck
              checked={data.statementOfDisclosureOne}
              label="I am raising these concerns with you openly. I am happy for my identity to be revealed."
              name="statementOfDisclosureOne"
              value={data.statementOfDisclosureOne}
              onChange={handleChange}
              error={errors.statementOfDisclosureOne}
            />
          )}
          {((!data.statementOfDisclosureOne &&
            !data.statementOfDisclosureTwo &&
            !data.statementOfDisclosureThree) ||
            (data.statementOfDisclosureTwo &&
              !data.statementOfDisclosureOne &&
              !data.statementOfDisclosureThree)) && (
            <ImsInputCheck
              checked={data.statementOfDisclosureTwo}
              label="I am raising these concerns with you on a confidential basis [in accordance with the company’s assurance of confidentiality in the whistleblowing policy]. I do not want my identity to be revealed to any other party without first obtaining my consent. I ask that you investigate the concerns in such a way so as not to reveal my identity."
              name="statementOfDisclosureTwo"
              value={data.statementOfDisclosureTwo}
              onChange={handleChange}
              error={errors.statementOfDisclosureTwo}
            />
          )}
          {((!data.statementOfDisclosureOne &&
            !data.statementOfDisclosureTwo &&
            !data.statementOfDisclosureThree) ||
            (data.statementOfDisclosureThree &&
              !data.statementOfDisclosureOne &&
              !data.statementOfDisclosureTwo)) && (
            <ImsInputCheck
              checked={data.statementOfDisclosureThree}
              label="I am raising these concerns with you anonymously. I do not want to reveal my identity to you. [Raising concerns anonymously can make it more difficult to assert your legal rights.   Please contact HR for advice if you are unsure]."
              name="statementOfDisclosureThree"
              value={data.statementOfDisclosureThree}
              onChange={handleChange}
              error={errors.statementOfDisclosureThree}
            />
          )}
        </>
      )}
      {whistleBlow && (
        <>
          <ImsInputSelect
            isMulti
            placeholder="Select share person"
            label="Share with"
            name="sharedWith"
            isDisabled={
              whistleBlow &&
              !entityAccessControl({
                users:
                  whistleBlow.sharedWith &&
                  whistleBlow.sharedWith.map((share) => share._id),
                effect: "Allow",
              })
            }
            value={data.sharedWith}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
          />

          <ImsInputCheck
            checked={data.signatureStatus}
            label="Closed"
            name="signatureStatus"
            value={data.signatureStatus}
            onChange={handleChange}
            error={errors.signatureStatus}
          />
        </>
      )}
      <ImsButtonGroup>
        {whistleBlow ? (
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
            {processing.action === "create" ? "Processing" : "Confirm"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default WhistleBlowForm;
