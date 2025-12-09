import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentSessionData } from "@/services/authService";
import {
  createComplaint,
  mapToComplaintModel,
  updateComplaint,
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

const Complaintform = ({
  addToTable,
  complaint,
  processing,
  setProcessing,
  refreshComplaint,
}) => {
  let { authGlobalAccess, entityAccessControl } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  let { groups, cqcGroups } = useContext(SuperGlobalContext);
  let notify = useContext(NotificationContext);
  const viewContextData = useContext(ViewContext);
  const history = useHistory();

  const dataSet = complaint
    ? mapToComplaintModel(complaint)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          address: "",
          telephone: "",
          email: "",
          preferredCommunicationMethod: "",
          dateAndTimeOfIncident: "",
          nameOfEmployee: "",
          typeOfService: "",
          detail: "",
          attachments: [],
          investigator: {
            value: null,
            label: "Select investigator",
          },
          investigation: "",
          actions: "",
          outcome: "",
          referredToSomeoneElse: false,
          referredInvestigator: {
            value: null,
            label: "Select referred investigator",
          },
          referredActions: "",
          referredOutcome: "",
          nameOfOrganisation: "",
          signatureStatus: false,
        },
        errors: {},
      };

  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    name: IVal.string().required().label("Complainant"),
    address: IVal.string().required().label("Address"),
    telephone: IVal.number().min(0).required().label("Telephone number"),
    email: IVal.string().email().required().label("Email"),
    preferredCommunicationMethod: IVal.string()
      .required()
      .label("Preferred Communication Method"),
    dateAndTimeOfIncident: IVal.string().required().label("Date of incident"),
    nameOfEmployee: IVal.string().required().label("Name of employee"),
    typeOfService: IVal.string().required().label("Type of service"),
    detail: IVal.string().required().label("Details"),
    investigator: IVal.object().keys({
      value: IVal.label("Investigator"),
      label: IVal.label("Investigator"),
    }),
    investigation: IVal.label("Investigation"),
    actions: IVal.label("Actions"),
    outcome: IVal.label("Outcome"),
    referredToSomeoneElse: IVal.boolean().label("Refer to someone else"),
    referredInvestigator: IVal.when("referredToSomeoneElse", {
      is: false,
      then: IVal.object().keys({
        value: IVal.label("Referred investigator"),
        label: IVal.label("Referred investigator"),
      }),
    }),
    referredActions: IVal.when("referredToSomeoneElse", {
      is: false,
      then: IVal.label("Referred Actions"),
    }),
    referredOutcome: IVal.when("referredToSomeoneElse", {
      is: false,
      then: IVal.label("Referred outcome"),
    }),
    nameOfOrganisation: IVal.when("referredToSomeoneElse", {
      is: false,
      then: IVal.label("Name of organisation"),
    }),
    signatureStatus: IVal.when("referredToSomeoneElse", {
      is: false,
      then: IVal.label("Signature Status"),
    }),
    attachments: IVal.array().label("Attachments"),
  };

  const { dataModel, handleChange, handleSubmit, handleFileChange, validate } =
    useForm(dataSet, schema);

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      try {
        switch (submissionType) {
          case "create": {
            setProcessing({ action: "create", id: null });
            let { data } = await createComplaint(dataModel.data);
            notify("Complaint created successfully", "success");
            addToTable && addToTable(data.compliant);
            history.push(`/admin/cqc/complaint/${data.compliant?._id}`);
            break;
          }
          case "update": {
            setProcessing({ action: "update", id: null });
            let { data } = await updateComplaint(complaint._id, dataModel.data);
            notify("Complaint updated successfully", "success");
            viewContextData.switchView && viewContextData.switchView();
            refreshComplaint && refreshComplaint(data.compliant);
            break;
          }
          default:
            break;
        }
      } catch (ex) {
        imsLogger("ComplaintForm", ex.response || ex);
        notify("Unknown server error occurred", "danger");
      }
    } catch (ex) {
      imsLogger("ComplaintForm", ex);
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

  const validateInvestigator = (investigatorId) => {
    return investigatorId === getCurrentSessionData().user?._id;
  };

  return (
    <Form action="/" className="form-horizontal">
      <Row>
        <Col md="6">
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            isDisabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
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
            label="Complainant"
            name="name"
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Complainant"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Address"
            name="address"
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Address"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Telephone number"
            type="number"
            name="telephone"
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder="Telephone number"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Email"
            name="email"
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Email"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Preferred communication method"
            name="preferredCommunicationMethod"
            value={data.preferredCommunicationMethod}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            onChange={handleChange}
            error={errors.preferredCommunicationMethod}
            placeholder="Preferred Communication Method"
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Date of incident"
            name="dateAndTimeOfIncident"
            value={data.dateAndTimeOfIncident}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            onChange={handleChange}
            error={errors.dateAndTimeOfIncident}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Name of employee"
            name="nameOfEmployee"
            value={data.nameOfEmployee}
            onChange={handleChange}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            error={errors.nameOfEmployee}
            placeholder="Name of employee"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Type of service"
            name="typeOfService"
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.investigator && complaint.investigator._id,
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.typeOfService}
            onChange={handleChange}
            error={errors.typeOfService}
            placeholder="Type of service"
          />
        </Col>
      </Row>

      <ImsTextEditor
        label="Details"
        name="detail"
        placeholder={"Add details."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        disabled={
          complaint &&
          entityAccessControl({
            users: [
              complaint.investigator && complaint.investigator._id,
              complaint.referredInvestigator &&
                complaint.referredInvestigator._id,
            ],
            effect: "Allow",
          })
        }
        value={complaint?.detail}
        onChange={handleChange}
        error={errors.detail}
      />

      {complaint && (
        <>
          <ImsInputSelect
            label="Investigator"
            name="investigator"
            icon="icon-app"
            isDisabled={complaint.investigator ? true : false}
            value={data.investigator}
            className="react-select default"
            classNamePrefix="react-select"
            error={errors.investigator}
            onChange={handleChange}
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
          />
          <ImsTextEditor
            label="Investigation"
            placeholder={"Add an investigation. Use @ to notify a user."}
            name="investigation"
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.investigation}
            onChange={handleChange}
            error={errors.investigation}
          />
          <ImsTextEditor
            label="Actions"
            placeholder={"Add an action. Use @ to notify a user."}
            name="actions"
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            value={data.actions}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            onChange={handleChange}
            error={errors.actions}
          />
          <ImsTextEditor
            label="Outcome"
            name="outcome"
            placeholder={"Add an outcome. Use @ to notify a user."}
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            disabled={
              complaint &&
              entityAccessControl({
                users: [
                  complaint.referredInvestigator &&
                    complaint.referredInvestigator._id,
                ],
                effect: "Allow",
              })
            }
            value={data.outcome}
            onChange={handleChange}
            error={errors.outcome}
          />
          <ImsInputCheck
            checked={data.referredToSomeoneElse}
            label="Refer to another investigator"
            name="referredToSomeoneElse"
            value={data.referredToSomeoneElse}
            onChange={handleChange}
            error={errors.referredToSomeoneElse}
          />

          {data.referredToSomeoneElse && (
            <>
              <ImsInputSelect
                label="Referred to"
                name="referredInvestigator"
                isDisabled={complaint.referredInvestigator ? true : false}
                className="react-select default"
                classNamePrefix="react-select"
                error={errors.referredInvestigator}
                value={data.referredInvestigator}
                onChange={handleChange}
                options={users.map((user) => ({
                  value: user._id,
                  label: user.name,
                }))}
              />
              <ImsInputText
                label="Actions"
                name="referredActions"
                type="textarea"
                rows="8"
                disabled={
                  complaint &&
                  entityAccessControl({
                    users: [
                      complaint.investigator && complaint.investigator._id,
                    ],
                    effect: "Allow",
                  })
                }
                value={data.referredActions}
                onChange={handleChange}
                error={errors.referredActions}
                placeholder="Actions"
              />
              <ImsInputText
                label="Outcome"
                name="referredOutcome"
                type="textarea"
                rows="8"
                disabled={
                  complaint &&
                  entityAccessControl({
                    users: [
                      complaint.investigator && complaint.investigator._id,
                    ],
                    effect: "Allow",
                  })
                }
                value={data.referredOutcome}
                onChange={handleChange}
                error={errors.referredOutcome}
                placeholder="Outcome"
              />
            </>
          )}
          <ImsInputText
            label="Name of organisation"
            name="nameOfOrganisation"
            value={data.nameOfOrganisation}
            onChange={handleChange}
            error={errors.nameOfOrganisation}
            placeholder="Name of organisation"
          />
          <ImsInputDropZone
            label="Attachments"
            clearAll={!data.attachments.length}
            name="cqcReport"
            onLoad={(files) => handleFileChange(files, "attachments")}
          />
          {!entityAccessControl({
            users: [
              complaint.investigator && complaint.investigator._id,
              complaint.referredInvestigator &&
                complaint.referredInvestigator._id,
            ],
            effect: "Allow",
          }) && (
            <ImsInputCheck
              checked={data.signatureStatus}
              label="Matter closed"
              name="signatureStatus"
              value={data.signatureStatus}
              onChange={handleChange}
              error={errors.signatureStatus}
            />
          )}
        </>
      )}
      <ImsButtonGroup>
        {complaint ? (
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

export default Complaintform;
