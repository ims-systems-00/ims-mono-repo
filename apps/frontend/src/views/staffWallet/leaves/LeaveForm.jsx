import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useContext } from "react";
import { mapToLeaveModel } from "@/services/wallet/leavesServices";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputCheck,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";
import { useLeave } from "./store";

const fractions = [
  { value: 1, label: "1" },
  { value: 0.75, label: "0.75" },
  { value: 0.5, label: "0.5" },
  { value: 0.25, label: "0.25" },
];

const LeaveForm = ({
  onSubmit = () => {},
  onSubmitLeave = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSaveAndSubmitLeave = () => {},
}) => {
  let {
    processing,
    visitingLeave: leave,
    isManagementByMe,
    entityAccessControl,
  } = useLeave();
  const dataSet = leave
    ? mapToLeaveModel(leave)
    : {
        data: {
          type: {
            value: "Annual leave",
            label: "Annual leave",
          },
          startDate: "",
          endDate: "",
          startDayFraction: {
            value: fractions[0].value,
            label: fractions[0].label,
          },
          endDayFraction: {
            value: fractions[0].value,
            label: fractions[0].label,
          },
          ongoing: false,
          description: "",
        },
        errors: {},
      };
  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.label("Type"),
    }),
    startDayFraction: IVal.object().keys({
      value: IVal.number().required().label("Start day fraction"),
      label: IVal.label("Start day fraction"),
    }),
    endDayFraction: IVal.object().keys({
      value: IVal.number().required().label("End day fraction"),
      label: IVal.label("End day fraction"),
    }),
    description: IVal.string().required().label("Description"),
    startDate: IVal.string().required().label("Start date"),
    endDate: IVal.string().required().label("End Date"),
    ongoing: IVal.label("Ongoing leave"),
  };
  const { confirmation, dataModel, handleChange, handleSubmit, validate } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;
  let viewContextData = useContext(ViewContext);
  let { users, lazyLoadUsers } = useUsers();
  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  return (
    <Form action="/" className="form-horizontal" method="get">
      {confirmation}
      <ImsInputSelect
        label="Type"
        name="type"
        value={data.type}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={["Annual leave", "Sick leave"].map((type) => ({
          value: type,
          label: type,
        }))}
      />
      {data.type.value === "Sick leave" && (
        <ImsInputCheck
          checked={data.ongoing}
          label="Ongoing leave"
          name="ongoing"
          value={data.ongoing}
          onChange={handleChange}
          error={errors.ongoing}
        />
      )}
      <ImsTextEditor
        label="Description"
        name="description"
        placeholder={"Add a description."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        value={leave?.description}
        onChange={handleChange}
        error={errors.description}
      />
      <Row>
        <Col md="6">
          <ImsInputDate
            label="Select start date"
            name="startDate"
            value={data.startDate}
            onChange={handleChange}
            error={errors.startDate}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Fraction of start day"
            name="startDayFraction"
            value={data.startDayFraction}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={fractions.map((fraction) => ({
              value: fraction.value,
              label: fraction.label,
            }))}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <ImsInputDate
            label={data.ongoing ? "Estimated end date" : "Select end date"}
            name="endDate"
            value={data.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Fraction of end day"
            name="endDayFraction"
            value={data.endDayFraction}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={fractions.map((fraction) => ({
              value: fraction.value,
              label: fraction.label,
            }))}
          />
        </Col>
      </Row>

      <ImsButtonGroup>
        {leave ? (
          <>
            <Button
              name="update"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false, {
                  confirmation: false,
                  confirmationMessage:
                    "This leave request be sent to your line manager",
                });
              }}
              disabled={
                validate() ? true : processing[USER_ACTIONS.AMEND_LEAVE].status
              }
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing[USER_ACTIONS.AMEND_LEAVE].status
                ? "Processing"
                : "Update"}
            </Button>
            {leave.submission.status === "Draft" &&
              entityAccessControl({
                users: leave.created.by ? [leave.created.by._id] : [],
                effect: "Allow",
              }) && (
                <Button
                  name="submit"
                  onClick={(e) => {
                    handleSubmit(e, () => onSubmitLeave(), false, {
                      confirmation: true,
                      confirmationMessage:
                        "This leave request will be submitted to your line manager",
                    });
                  }}
                  disabled={
                    validate()
                      ? true
                      : processing[USER_ACTIONS.SUBMIT_LEAVE].status
                  }
                  className="btn-fill"
                  color="primary"
                  type="button"
                >
                  {processing[USER_ACTIONS.SUBMIT_LEAVE].status
                    ? "Processing"
                    : "Submit"}
                </Button>
              )}
            {leave?.submission.status === "Pending" && isManagementByMe(leave) && (
              <>
                <Button
                  name="approve"
                  onClick={(e) => {
                    handleSubmit(e, () => onApprove(dataModel.data), false, {
                      confirmation: true,
                      confirmationMessage: `You want to approve leave requested by ${
                        leave.created?.by.name
                      } from ${moment(leave.startDate).format(
                        "DD/MM/YYYY"
                      )} to ${moment(leave.endDate).format("DD/MM/YYYY")}`,
                    });
                  }}
                  disabled={
                    validate()
                      ? true
                      : processing[USER_ACTIONS.HANDLE_LEAVE_REQUEST].status
                  }
                  className="btn-fill"
                  color="primary"
                  type="button"
                >
                  {processing[USER_ACTIONS.HANDLE_LEAVE_REQUEST].status
                    ? "Processing"
                    : "Approve"}
                </Button>
                <Button
                  name="reject"
                  onClick={(e) => {
                    handleSubmit(e, () => onReject(dataModel.data), false, {
                      confirmation: true,
                      confirmationMessage: `You want to reject leave requested by ${
                        leave.created?.by.name
                      } from ${moment(leave.startDate).format(
                        "DD/MM/YYYY"
                      )} to ${moment(leave.endDate).format("DD/MM/YYYY")}`,
                    });
                  }}
                  disabled={
                    validate()
                      ? true
                      : processing[USER_ACTIONS.HANDLE_LEAVE_REQUEST].status
                  }
                  className="btn-fill"
                  color="primary"
                  type="button"
                >
                  {processing[USER_ACTIONS.HANDLE_LEAVE_REQUEST].status
                    ? "Processing"
                    : "Reject"}
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              name="create"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), true, {
                  confirmation: false,
                  confirmationMessage:
                    "This leave request will be sent to your line manager",
                });
              }}
              disabled={
                validate() ? true : processing[USER_ACTIONS.CREATE_LEAVE].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.CREATE_LEAVE].status
                ? "Processing"
                : "Request leave"}
            </Button>
            {data.ongoing ? (
              <Button
                name="saveandsend"
                onClick={(e) => {
                  handleSubmit(
                    e,
                    () => onSaveAndSubmitLeave(dataModel.data),
                    true,
                    {
                      confirmation: true,
                      confirmationMessage:
                        "This leave request will be submitted to your line manager",
                    }
                  );
                }}
                disabled={
                  validate()
                    ? true
                    : processing[USER_ACTIONS.SAVE_AND_SEND_LEAVE].status
                }
                className="btn-fill"
                color="primary"
                type="button"
              >
                {processing[USER_ACTIONS.SAVE_AND_SEND_LEAVE].status
                  ? "Processing"
                  : "Send to line Manager"}
              </Button>
            ) : null}
          </>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default LeaveForm;
