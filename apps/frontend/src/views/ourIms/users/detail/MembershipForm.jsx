import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useConstants from "@/hooks/useConstants";
import useDebounce from "@/hooks/useDebounce";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputCheck,
  ImsInputSelect,
  ImsInputText,
  ImsInputTime,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsFormSectionDevider,
} from "@/views/shared/ImsFormElements/Index";

import { mapToMemberModel } from "../dataModels/membershipMaper";

const workPlaces = [
  { value: "On-site", label: "On-site" },
  { value: "Remote", label: "Remote" },
];
const accessPeriods = [
  { value: "Full time", label: "Full time" },
  { value: "1 Day", label: "1 Day" },
  { value: "2 Days", label: "2 Days" },
  { value: "3 Days", label: "3 Days" },
  { value: "4 Days", label: "4 Days" },
  { value: "5 Days", label: "5 Days" },
];

const MembershipForm = ({ membership, onSubmit = () => {} }) => {
  let { users, lazyLoadUsers } = useUsers();
  let notify = React.useContext(NotificationContext);
  let { authSuperUser } = useAccess();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  let dataSet = membership
    ? mapToMemberModel(membership)
    : {
        data: {
          workPlace: {
            value: "On-site",
            label: "On-site",
          },
          country: {
            value: "",
            label: "Select you country",
          },
          jobTitle: "",
          salary: 0,
          lineManagers: [],
          leaveDaysEntitledTo: 0,
          sunday: false,
          sundayStart: "",
          sundayEnd: "",
          monday: false,
          mondayStart: "",
          mondayEnd: "",
          tuesday: false,
          tuesdayStart: "",
          tuesdayEnd: "",
          wednesday: false,
          wednesdayStart: "",
          wednesdayEnd: "",
          thursday: false,
          thursdayStart: "",
          thursdayEnd: "",
          friday: false,
          fridayStart: "",
          fridayEnd: "",
          saturday: false,
          saturdayStart: "",
          saturdayEnd: "",
        },
        errors: {},
      };
  const schema = {
    workPlace: IVal.object().keys({
      value: IVal.string().required().label("Work place"),
      label: IVal.label("Work place"),
    }),
    country: IVal.object().keys({
      value: IVal.label("Country"),
      label: IVal.label("Country"),
    }),
    jobTitle: IVal.string().required().label("Job title"),
    salary: IVal.number().integer().min(0).label("Salary"),
    lineManagers: IVal.array().label("Attendees"),
    leaveDaysEntitledTo: IVal.number()
      .integer()
      .min(0)
      .label("leave entitled to"),
    sunday: IVal.boolean().label("Sunday"),
    sundayStart: IVal.label("Start time"),
    sundayEnd: IVal.label("End time"),
    monday: IVal.boolean().label("Monday"),
    mondayStart: IVal.label("Start time"),
    mondayEnd: IVal.label("End time"),
    tuesday: IVal.boolean().label("Tuesday"),
    tuesdayStart: IVal.label("Start time"),
    tuesdayEnd: IVal.label("End time"),
    wednesday: IVal.boolean().label("Wednesday"),
    wednesdayStart: IVal.label("Start time"),
    wednesdayEnd: IVal.label("End time"),
    thursday: IVal.boolean().label("Thursday"),
    thursdayStart: IVal.label("Start time"),
    thursdayEnd: IVal.label("End time"),
    friday: IVal.boolean().label("Friday"),
    fridayStart: IVal.label("Start time"),
    fridayEnd: IVal.label("End time"),
    saturday: IVal.boolean().label("Saturday"),
    saturdayStart: IVal.label("Start time"),
    saturdayEnd: IVal.label("End time"),
  };

  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;

  let { constants, loadConstants } = useConstants();

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    loadConstants({ keywords: debouncedSearchString });
  }, [debouncedSearchString]);
  return (
    <Form action="/" className="form-horizontal">
      {/* {membership && (
        <ImsFormSectionDevider
          label={`Edit profile`}
          deviderText={`Edit your profile here, This information will be linked to your wallet`}
        />
      )} */}
      <Row>
        <Col md="6">
          <ImsInputText
            label="Job title"
            name="jobTitle"
            mandatory={true}
            value={data.jobTitle}
            onChange={handleChange}
            error={errors.jobTitle}
            placeholder="Job title"
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Working place"
            name="workPlace"
            mandatory={true}
            value={data.workPlace}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={workPlaces.map((workPlace) => ({
              value: workPlace.value,
              label: workPlace.label,
            }))}
          />
        </Col>

        <Col md="6">
          <ImsInputText
            type="number"
            label="Salary (optional)"
            name="salary"
            value={data.salary}
            onChange={handleChange}
            error={errors.salary}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            isMulti
            label="Select Line manager"
            name="lineManagers"
            value={data.lineManagers}
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

      <Row>
        <Col md="6">
          <ImsInputSelect
            label="Country"
            name="country"
            value={data.country}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            onInputChange={setSearchString}
            options={constants.map((constant) => ({
              value: constant.code,
              label: constant.name,
            }))}
          />
        </Col>
        <Col md="6">
          {" "}
          <ImsInputText
            type="number"
            label="Annual leave entitlement"
            name="leaveDaysEntitledTo"
            value={data.leaveDaysEntitledTo}
            onChange={handleChange}
            error={errors.leaveDaysEntitledTo}
          />
        </Col>
      </Row>

      {membership && (
        <>
          <ImsFormSectionDevider
            label="Operating hours"
            deviderText="Please capture your working hours below, This information will be visible to your line manager(s)"
          />
          <ImsInputCheck
            checked={data.monday}
            label="Monday"
            name="monday"
            value={data.monday}
            onChange={handleChange}
            error={errors.monday}
          />
          {data.monday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="mondayStart"
                value={data.mondayStart}
                onChange={handleChange}
                error={errors.mondayStart}
              />
              <ImsInputTime
                label="End time"
                name="mondayEnd"
                value={data.mondayEnd}
                onChange={handleChange}
                error={errors.mondayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.tuesday}
            label="Tuesday"
            name="tuesday"
            value={data.tuesday}
            onChange={handleChange}
            error={errors.tuesday}
          />
          {data.tuesday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="tuesdayStart"
                value={data.tuesdayStart}
                onChange={handleChange}
                error={errors.tuesdayStart}
              />
              <ImsInputTime
                label="End time"
                name="tuesdayEnd"
                value={data.tuesdayEnd}
                onChange={handleChange}
                error={errors.tuesdayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.wednesday}
            label="Wednesday"
            name="wednesday"
            value={data.wednesday}
            onChange={handleChange}
            error={errors.wednesday}
          />
          {data.wednesday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="wednesdayStart"
                value={data.wednesdayStart}
                onChange={handleChange}
                error={errors.wednesdayStart}
              />
              <ImsInputTime
                label="End time"
                name="wednesdayEnd"
                value={data.wednesdayEnd}
                onChange={handleChange}
                error={errors.wednesdayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.thursday}
            label="Thursday"
            name="thursday"
            value={data.thursday}
            onChange={handleChange}
            error={errors.thursday}
          />
          {data.thursday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="thursdayStart"
                value={data.thursdayStart}
                onChange={handleChange}
                error={errors.thursdayStart}
              />
              <ImsInputTime
                label="End time"
                name="thursdayEnd"
                value={data.thursdayEnd}
                onChange={handleChange}
                error={errors.thursdayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.friday}
            label="Friday"
            name="friday"
            value={data.friday}
            onChange={handleChange}
            error={errors.friday}
          />
          {data.friday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="fridayStart"
                value={data.fridayStart}
                onChange={handleChange}
                error={errors.fridayStart}
              />
              <ImsInputTime
                label="End time"
                name="fridayEnd"
                value={data.fridayEnd}
                onChange={handleChange}
                error={errors.fridayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.saturday}
            label="Saturday"
            name="saturday"
            value={data.saturday}
            onChange={handleChange}
            error={errors.saturday}
          />
          {data.saturday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="saturdayStart"
                value={data.saturdayStart}
                onChange={handleChange}
                error={errors.saturdayStart}
              />
              <ImsInputTime
                label="End time"
                name="saturdayEnd"
                value={data.saturdayEnd}
                onChange={handleChange}
                error={errors.saturdayEnd}
              />
            </Row>
          )}
          <ImsInputCheck
            checked={data.sunday}
            label="Sunday"
            name="sunday"
            value={data.sunday}
            onChange={handleChange}
            error={errors.sunday}
          />
          {data.sunday && (
            <Row>
              <ImsInputTime
                label="Start time"
                name="sundayStart"
                value={data.sundayStart}
                onChange={handleChange}
                error={errors.sundayStart}
              />
              <ImsInputTime
                label="End time"
                name="sundayEnd"
                value={data.sundayEnd}
                onChange={handleChange}
                error={errors.sundayEnd}
              />
            </Row>
          )}
        </>
      )}
      <ImsButtonGroup>
        <Button
          name="update"
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color="primary"
          type="button"
          onClick={(e) =>
            handleSubmit(e, () => onSubmit(dataModel.data), false)
          }
        >
          {isBusy ? "Processing" : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default MembershipForm;
