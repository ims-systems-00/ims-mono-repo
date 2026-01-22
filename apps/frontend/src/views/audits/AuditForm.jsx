import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  Row,
  ImsInputSelect,
  ImsInputText,
  ImsInputTime,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { filterIt } from "@/utils/filters";
import IVal from "@/validations/validator";
import NotificationContext from "../../contexts/notificationContext";
import { mapToAuditModel } from "../../services/auditServices";
import {
  ImsButtonGroup,
  ImsFormSectionDevider,
} from "../shared/ImsFormElements/Index";
import Indentification from "./Identification";
import IdentificationFrom from "./IdentificationFrom";
import KpiObectives from "./KpiObjectives";
import OFI from "./OFI";
import OfiForm from "./OfiForm";
import Risk from "./Risk";
import RiskForm from "./RiskForm";
import { useAudits } from "./store";
import { filterUsersByGroup } from "@/utils/filters";
import { useApplication } from "@/stores/applicationStore";
import { ROLES } from "@/rolesAndPermissions";
import { ImsInputDropZone } from "@/views/shared/ImsFormElements/Index";
import { TourStep } from "../../components/Tour";

const AuditForm = ({
  type,
  visitingAudit: audit,
  onSubmit = () => {},
  onCompleteAudit = () => {},
  drawerView = false,
  ...props
}) => {
  const { tokenPair } = useApplication();
  let { createIdentification, createOfi, createRisk, kpiObjectives } =
    useAudits();
  const dataSet = audit
    ? mapToAuditModel(audit)
    : {
        data: {
          type,
          title: "",
          focusArea: "",
          group: {
            value: null,
            label: "Select Business unit",
          },
          complianceBody: {
            value: null,
            label: "Select compliance body",
          },
          auditor: {
            value: null,
            label: "Select auditor",
          },
          startDate: "",
          time: "",
          interval: {
            value: null,
            label: "Select interval",
          },
          comment: "",
          attachments: [],
        },
        errors: {},
      };
  const schema = {
    type: IVal.string().required().label("Type"),
    title: IVal.string().required().label("Title"),
    focusArea: IVal.string().required().label("Focus area"),
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    complianceBody: IVal.object().keys({
      value: IVal.label("Compliance body/group"),
      label: IVal.label("Compliance body/group"),
    }),
    auditor: IVal.object().keys({
      value: IVal.string().required().label("Auditor"),
      label: IVal.string().required().label("Auditor"),
    }),
    interval: IVal.object().keys({
      value: IVal.string().required().label("Interval"),
      label: IVal.string().required().label("Interval"),
    }),
    comment: IVal.label("Comment"),
    startDate: IVal.label("Schedule date"),
    time: IVal.string()
      .required()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .label("Schedule date"),
    attachments: IVal.label("Attachments"),
  };

  const { groups, complianceBody } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  let history = useHistory();
  let viewContextData = useContext(ViewContext);
  let { authGlobalAccess } = useAccess();
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);

  // populating form if in editing mode ...
  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" method="get">
      <TourStep data-tour-step="audit-form">
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Title"
              name="title"
              value={data.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Title"
              mandatory
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={[
                {
                  value: null,
                  label: "Not selected",
                },
                ,
                ...groups.map((group) => ({
                  value: group._id,
                  label: group.name,
                })),
              ]}
            />
          </Col>
        </Row>
        <ImsInputSelect
          label="Compliance body"
          name="complianceBody"
          value={data.complianceBody}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={[
            {
              value: null,
              label: "Not selected",
            },
            ,
            ...complianceBody.map((group) => ({
              value: group._id,
              label: group.name,
            })),
          ]}
        />
        <ImsInputText
          label="Focus area"
          placeholder="Focus area"
          type="textarea"
          rows="6"
          name="focusArea"
          mandatory={true}
          value={data.focusArea}
          onChange={handleChange}
          error={errors.focusArea}
        />
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <TourStep data-tour-step="select-auditor">
              <ImsInputSelect
                label="Auditor"
                name="auditor"
                value={data.auditor}
                isDisabled={audit ? true : false}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                mandatory
                options={users
                  .filter((user) =>
                    [
                      ROLES.INTERNAL_AUDITOR,
                      ROLES.EXTERNAL_AUDITOR,
                      ROLES.SUPER_ADMIN,
                      ROLES.HEAD_OF_SERVICE,
                    ].includes(
                      user.membership.find(
                        (m) =>
                          m.organization ===
                          tokenPair.accessTokenData.user.organizationId
                      )?.role
                    )
                  )
                  .filter((user) =>
                    filterUsersByGroup(
                      user.membership,
                      dataModel.data.complianceBody.value
                    )
                  )
                  .map((user) => ({ value: user._id, label: user.name }))}
              />
            </TourStep>
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputDate
              label="Select date"
              name="startDate"
              mandatory
              value={data.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
          </Col>
        </Row>
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputTime
              label="Select time"
              name="time"
              inputCol="10"
              mandatory
              value={data.time}
              onChange={handleChange}
              error={errors.time}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label="Interval"
              name="interval"
              mandatory
              value={data.interval}
              isDisabled={audit ? true : false}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={["Quarterly", "Half yearly", "Yearly"].map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </TourStep>
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="audit_attachments"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      {audit && (
        <>
          {audit.type === "Internal" && (
            <>
              <ImsFormSectionDevider
                label={"Kpi/Objectives"}
                deviderText={
                  "Only the organisational Kpi/Objectives are listed here."
                }
              />
              {kpiObjectives
                .filter((kpi) => !kpi.group)
                .map((data, index) => (
                  <KpiObectives label={index + 1} kpi={data.value} />
                ))}
            </>
          )}
          <hr></hr>
          <>
            <ImsFormSectionDevider
              label={"Findings"}
              deviderText={
                "Please list all the non conformities and root causes identified."
              }
            />
            <IdentificationFrom
              onSubmit={async (data) => {
                await createIdentification(data);
              }}
            />
            {audit &&
              audit.identifications.map((identification) => (
                <Indentification
                  key={identification._id}
                  identification={identification}
                />
              ))}
          </>
          <hr></hr>
          <>
            <ImsFormSectionDevider
              label={"Risks"}
              deviderText={"Please list all the risks indentified."}
            />
            <RiskForm
              onSubmit={async (data) => {
                await createRisk(data);
              }}
            />
            {audit &&
              audit.risks.map((risk) => <Risk key={risk._id} risk={risk} />)}
          </>
          <hr></hr>
          <>
            <ImsFormSectionDevider
              label={"Opportunities for improvements"}
              deviderText={
                "Please list all the opportunities for improvements indentified."
              }
            />
            <OfiForm
              onSubmit={async (data) => {
                await createOfi(data);
              }}
            />
            {audit && audit.cips.map((ofi) => <OFI key={ofi._id} ofi={ofi} />)}
          </>
          <hr></hr>
          <ImsFormSectionDevider
            label={"Audit summerisation"}
            deviderText={
              "Share your thoughts and summeries the whole audit before completing the audit ."
            }
          />
          <ImsInputText
            label="Summary"
            cols="80"
            rows="4"
            placeholder="Summary"
            type="textarea"
            name="comment"
            value={data.comment}
            onChange={handleChange}
            error={errors.comment}
          />
        </>
      )}
      <ImsButtonGroup>
        {!audit ? (
          <Button
            name="create"
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data));
            }}
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {isBusy ? "Processing" : "Confirm"}
          </Button>
        ) : (
          <>
            <Button
              name="update"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false);
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="info"
              type="button"
            >
              {isBusy ? "Processing" : "Update"}
            </Button>
            <Button
              name="complete"
              onClick={(e) => {
                handleSubmit(e, () => onCompleteAudit(dataModel.data), false);
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="primary"
              type="button"
            >
              {isBusy ? "Processing" : "Completed"}
            </Button>
          </>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default AuditForm;
