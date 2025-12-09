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
  createSafeguarding,
  mapToSafeguardingModel,
  updateSafeguarding,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsInputCheck,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import { handleUpload } from "@/utils/formatLinkGenerator";

const SafeguardingForm = ({
  processing,
  safeguarding,
  setProcessing,
  addToTable,
  refreshSafeguarding,
}) => {
  let { authGlobalAccess } = useAccess();
  let notify = React.useContext(NotificationContext);
  let { cqcGroups } = useContext(SuperGlobalContext);
  const viewContextData = useContext(ViewContext);
  let { users, lazyLoadUsers } = useUsers();
  const history = useHistory();
  const dataSet = safeguarding
    ? mapToSafeguardingModel(safeguarding)
    : {
        data: {
          group: {
            value: null,
            label: "Select business unit",
          },
          personAffected: "",
          riskRegistar: {
            value: null,
            label: "Is this person on an At risk register",
          },
          summaryOfConcerns: "",
          agenciesInvolved: "",
          referredStatus: false,
          referredTo: "",
          referredEmail: "",
          nameOfOrganisation: "",
          rational: "",
          attachments: [],
          sharedWith: [],
          investigation: "",
          outcome: "",
          signatureStatus: false,
          sendReferral: false,
        },
        errors: {},
      };
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.string().required().label("Business unit"),
    }),
    personAffected: IVal.string().required().label("Person affected"),
    riskRegistar: IVal.object().keys({
      value: IVal.string().required().label("Risk register"),
      label: IVal.string().required().label("Risk register"),
    }),
    summaryOfConcerns: IVal.string().required().label("Summary of concerns"),
    agenciesInvolved: IVal.string().required().label("Agencies involved"),
    referredStatus: IVal.boolean().label("Referred to somewhere else"),
    referredTo: IVal.when("referredStatus", {
      is: IVal.valid(true).label("Name"),
      then: IVal.string().required().label("Name"),
    }),
    referredEmail: IVal.when("referredStatus", {
      is: IVal.valid(true).label("Access policy"),
      then: IVal.string().required().label("Email"),
    }),
    nameOfOrganisation: IVal.when("referredStatus", {
      is: IVal.valid(true).label("Access policy"),
      then: IVal.string().required().label("Name of organisation"),
    }),
    rational: IVal.when("referredStatus", {
      is: IVal.valid(true).label("Access policy"),
      then: IVal.string().required().label("Rational"),
    }),
    attachments: IVal.array().label("Attachments"),
    sharedWith: IVal.array().label("Shared with"),
    investigation: IVal.label("Investigation"),
    outcome: IVal.label("Outcome"),
    signatureStatus: IVal.boolean().label("Signed off status"),
    sendReferral: IVal.boolean().label("Signed off status"),
  };
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createSafeguarding(dataModel.data);
          addToTable && addToTable(data.safeGuarding);
          history.push(`/admin/cqc/safeguardings/${data.safeGuarding?._id}`);
          notify(`Safeguarding created successfully`, "success");
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updateSafeguarding(
            safeguarding._id,
            dataModel.data
          );
          refreshSafeguarding && refreshSafeguarding(data.safeGuarding);
          notify(`Safeguarding updated successfully`, "success");
          viewContextData.switchView && viewContextData.switchView();
          break;
        }
        case "send": {
          setProcessing({ action: "send", id: null });
          let { data } = await updateSafeguarding(safeguarding._id, {
            ...dataModel.data,
            sendReferral: true,
          });
          refreshSafeguarding && refreshSafeguarding(data.safeGuarding);
          notify(`Referral sent successfully`, "success");
          viewContextData.switchView && viewContextData.switchView();
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("SafeguardingForm", ex.response, ex);
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
            label="Person affected"
            name="personAffected"
            placeholder="Person affected"
            value={data.personAffected}
            onChange={handleChange}
            error={errors.personAffected}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label={"Is this person on an At risk register?"}
            name="riskRegistar"
            value={data.riskRegistar}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={["Yes", "No"].map((value) => ({
              value: value,
              label: value,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Agencies involved"
            name="agenciesInvolved"
            placeholder="Name"
            value={data.agenciesInvolved}
            onChange={handleChange}
            error={errors.agenciesInvolved}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label={"Shared with"}
            name="sharedWith"
            isMulti
            value={data.sharedWith}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
          />
        </Col>
      </Row>

      <ImsTextEditor
        label="Summary of concerns"
        name="summaryOfConcerns"
        placeholder={"Add a description."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        value={safeguarding?.summaryOfConcerns}
        onChange={handleChange}
        error={errors.summaryOfConcerns}
      />

      {safeguarding && (
        <>
          <ImsTextEditor
            label="Investigation"
            name="investigation"
            placeholder={"Add an investigation. Use @ to notify a user."}
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            value={data.investigation}
            onChange={handleChange}
            error={errors.investigation}
          />
          <ImsTextEditor
            label="Outcome"
            placeholder={"Add an outcome. Use @ to notify a user."}
            name="outcome"
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            value={data.outcome}
            onChange={handleChange}
            error={errors.outcome}
          />
          <ImsInputCheck
            label="Refer to external party"
            name="referredStatus"
            placeholder="Referred to external"
            checked={data.referredStatus}
            value={data.referredStatus}
            onChange={handleChange}
            error={errors.referredStatus}
          />
          {data.referredStatus && (
            <Row>
              <Col md="6">
                <ImsInputText
                  label="Referred to"
                  name="referredTo"
                  placeholder="Name"
                  value={data.referredTo}
                  onChange={handleChange}
                  error={errors.referredTo}
                />
              </Col>
              <Col md="6">
                <ImsInputText
                  label="Email"
                  name="referredEmail"
                  placeholder="Email"
                  value={data.referredEmail}
                  onChange={handleChange}
                  error={errors.referredEmail}
                />
              </Col>
              <Col md="6">
                <ImsInputText
                  label="Name of organisation"
                  name="nameOfOrganisation"
                  placeholder="Name"
                  value={data.nameOfOrganisation}
                  onChange={handleChange}
                  error={errors.nameOfOrganisation}
                />
              </Col>
              <Col md="12">
                <ImsInputText
                  label="Rational"
                  name="rational"
                  placeholder="Rational"
                  value={data.rational}
                  onChange={handleChange}
                  type="textarea"
                  rows="8"
                  error={errors.rational}
                />
              </Col>
            </Row>
          )}
        </>
      )}
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="cqcReport"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      {safeguarding && (
        <ImsInputCheck
          label="Closed"
          name="signatureStatus"
          placeholder="Referred to external"
          value={data.signatureStatus}
          checked={data.signatureStatus}
          onChange={handleChange}
          error={errors.signatureStatus}
        />
      )}
      <ImsButtonGroup>
        {!safeguarding ? (
          <Button
            name="create"
            onClick={(e) => handleSubmit(e, doSubmit)}
            disabled={validate() ? true : processing.action === "create"}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {processing.action === "create" ? "Processing" : "Confirm"}
          </Button>
        ) : (
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
              onClick={(e) => handleSubmit(e, doSubmit, false)}
              disabled={validate() ? true : processing.action === "update"}
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing.action === "update"
                ? "Processing"
                : data.signatureStatus
                ? "Close"
                : "Update"}
            </Button>

            {data.referredStatus && (
              <Button
                name="send"
                onClick={(e) => {
                  handleSubmit(e, doSubmit, false);
                }}
                disabled={validate() ? true : processing.action === "send"}
                className="btn-fill"
                color="primary"
                type="button"
                value={true}
              >
                {processing.action === "send" ? "Processing" : "Send referral"}
              </Button>
            )}
          </>
        )}
      </ImsButtonGroup>
    </Form>
  );
};
export default SafeguardingForm;
