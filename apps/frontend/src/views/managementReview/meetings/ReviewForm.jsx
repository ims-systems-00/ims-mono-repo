import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
  ImsInputTime,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { mapToManagementReviewModel } from "@/services/managementReviewServices";
import { filterUsersByGroup } from "@/utils/filters";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";
const ManagmentReviewForm = ({
  visitingReview: managementReview,
  onSubmit = () => {},
  onComplete = () => {},
  drawerView = false,
  ...props
}) => {
  let { authGlobalAccess } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  const dataSet = managementReview
    ? mapToManagementReviewModel(managementReview)
    : {
        data: {
          privacy: authGlobalAccess()
            ? {
                value: "Organisational",
                label: "Organisational",
              }
            : {
                value: "Business unit",
                label: "Business unit",
              },
          title: "",
          group: {
            value: null,
            label: "Select Business unit",
          },
          date: "",
          interval: {
            value: "Monthly",
            label: "Monthly",
          },
          time: "",
          attendees: [],
          agenda: [],
          minutes: [],
        },
        errors: {},
      };
  const schema = {
    privacy: IVal.object().keys({
      value: IVal.string().required().label("Privacy"),
      label: IVal.string().required().label("Privacy"),
    }),
    title: IVal.string().required().label("Title"),
    group: IVal.when("privacy", {
      is: IVal.object().keys({
        value: IVal.string().valid("Business unit").label("Meeting type"),
        label: IVal.label("Meeting type"),
      }),
      then: IVal.object().keys({
        value: IVal.string().required().label("Business unit"),
        label: IVal.label("Business unit"),
      }),
    }),
    interval: IVal.object().keys({
      value: IVal.string().required().label("Interval"),
      label: IVal.string().required().label("Interval"),
    }),
    date: IVal.string().required().label("Schedule date"),
    attendees: IVal.array().label("Attendees"),
    time: IVal.string()
      .required()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .label("Schedule time"),
    agenda: IVal.label("Agenda"),
    minutes: IVal.label("Minutes"),
  };
  let notify = React.useContext(NotificationContext);
  const {
    confirmation,
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);
  let { groups } = useContext(SuperGlobalContext);

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;
  return (
    <>
      {confirmation}
      <Form action="/" className="form-horizontal" method="get">
        <Row>
          {data.privacy.value === "Business unit" && (
            <Col md="6">
              <ImsInputSelect
                label={authGlobalAccess() ? "Business unit" : "Business unit"}
                name="group"
                value={data.group}
                isDisabled={managementReview ? true : false}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={groups.map((group) => ({
                  value: group._id,
                  label: group.name,
                }))}
              />
            </Col>
          )}
          <Col md="6">
            <ImsInputSelect
              isMulti
              placeholder="Select attendees"
              label="Attendees"
              name="attendees"
              value={data.attendees}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={users
                .filter(
                  (user) =>
                    data.privacy.value === "Organisational" ||
                    filterUsersByGroup(
                      user.membership,
                      dataModel.data.group.value
                    )
                )
                .map((user) => ({ value: user._id, label: user.name }))}
            />
          </Col>
          <Col md="6">
            <ImsInputText
              label="Title"
              name="title"
              mandatory={true}
              placeholder="Title"
              value={data.title}
              onChange={handleChange}
              error={errors.title}
            />
          </Col>
          <Col md="6">
            <ImsInputDate
              label="Select date"
              name="date"
              mandatory={true}
              value={data.date}
              onChange={handleChange}
              error={errors.date}
            />
          </Col>

          <Col md="6">
            <ImsInputTime
              label="Select time"
              name="time"
              mandatory={true}
              inputCol="10"
              value={data.time}
              onChange={handleChange}
              error={errors.time}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              label="Interval"
              name="interval"
              mandatory={true}
              value={data.interval}
              isDisabled={managementReview ? true : false}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={["Monthly", "Quarterly", "Half yearly", "Yearly"].map(
                (item) => ({ value: item, label: item })
              )}
            />
          </Col>
        </Row>
        <ImsInputDropZone
          label="Agenda"
          clearAll={!data.agenda.length}
          name="agenda"
          onLoad={(files) => handleFileChange(files, "agenda")}
        />
        <ImsInputDropZone
          label="Minutes"
          clearAll={!data.minutes.length}
          name="minutes"
          onLoad={(files) => handleFileChange(files, "minutes")}
        />
        <ImsButtonGroup>
          {!managementReview ? (
            <Button
              onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
              name="create"
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
                onClick={(e) =>
                  handleSubmit(e, () => onSubmit(dataModel.data), false)
                }
                disabled={validate() ? true : isBusy}
                className="btn-fill"
                color="primary"
                type="button"
              >
                {isBusy ? "Processing" : "Update"}
              </Button>
              <Button
                name="complete"
                onClick={(e) =>
                  handleSubmit(e, onComplete(), false, {
                    confirmation: true,
                    confirmationMessage:
                      "THis management review will be completed",
                  })
                }
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
    </>
  );
};

export default ManagmentReviewForm;
