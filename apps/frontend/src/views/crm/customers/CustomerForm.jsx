import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import useDebounce from "@/hooks/useDebounce";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext, useState } from "react";
import { mapToCustomerModel } from "@/services/customerService";
import { filterUsersByGroup } from "@/utils/filters";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import { ImsFormImageUpload } from "@/views/shared/CustomFormElements";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsInputTextWithIcon,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";

const probabilities = [
  { value: 10, label: "10%" },
  { value: 20, label: "20%" },
  { value: 30, label: "30%" },
  { value: 40, label: "40%" },
  { value: 50, label: "50%" },
  { value: 60, label: "60%" },
  { value: 70, label: "70%" },
  { value: 80, label: "80%" },
  { value: 90, label: "90%" },
];
const stages = [
  { value: "Prospect", label: "Prospect" },
  { value: "Warm lead", label: "Warm lead" },
  { value: "Qualified", label: "Qualified" },
  { value: "Proposal", label: "Proposal" },
  { value: "Live", label: "Live" },
];
const statuses = [
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
  { value: "Lost", label: "Lost" },
  { value: "Abandoned", label: "Abandoned" },
];
const CustomerForm = ({
  visitingCustomer: customer,
  processing,
  drawerView,
  customerLogo,
  onSubmit = () => {},
}) => {
  let { users, lazyLoadUsers } = useUsers();
  let { authGlobalAccess } = useAccess();
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  const dataSet = customer
    ? mapToCustomerModel(customer)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          status: statuses[0],
          stage: stages[0],
          name: "",
          town: "",
          buildingName: "",
          streetName: "",
          postCode: "",
          accountManager: {
            value: null,
            label: "Select account manager",
          },
          probability: probabilities[0],
          accountNumber: "",
          source: "",
          primaryContact: "",
          primaryEmail: "",
          secondaryContact: "",
          secondaryEmail: "",
          contractValue: 0,
          serviceProvision: "",
          reasonForLoss: "",
          contractStartDate: "",
          contractEndDate: "",
          phoneNumber: "",
          notes: "",
          reviewDate: "",
          companyNumber: "",
          tagsAndCategories: "",
          attachments: [],
          logoInfo: [],
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    stage: IVal.object().keys({
      value: IVal.string().required().label("Status"),
      label: IVal.string().required().label("Status"),
    }),
    status: IVal.object().keys({
      value: IVal.string().required().label("Status"),
      label: IVal.string().required().label("Status"),
    }),
    town: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.string().required().label("Town"),
    }),
    buildingName: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.string().required().label("Building name"),
    }),
    streetName: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.string().required().label("Street name"),
    }),
    postCode: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.string().required().label("Post code"),
    }),
    primaryContact: IVal.string().required().label("Contact"),
    secondaryContact: IVal.label("Secondary contact"),
    primaryEmail: IVal.string().email().required().label("Email"),
    secondaryEmail: IVal.when("secondaryContact", {
      is: IVal.string(),
      then: IVal.string().email().required().label("Secondary email"),
    }),
    phoneNumber: IVal.string().required().label("Phone Number"),
    probability: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.object().keys({
        value: IVal.number().required().label("Probability"),
        label: IVal.string().required().label("Probability"),
      }),
    }),
    name: IVal.string().required().label("Customer name"),
    accountManager: IVal.object().keys({
      value: IVal.string().required().label("Account manager"),
      label: IVal.label("Account manager"),
    }),
    accountNumber: IVal.label("Account number"),
    source: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid(
          "Prospect",
          "Warm lead",
          "Proposal",
          "Qualified"
        ).label("Status"),
      }),
      then: IVal.string().required().label("Source"),
    }),
    contractValue: IVal.number().required().label("Contract value"),
    serviceProvision: IVal.label("Service provision"),
    reasonForLoss: IVal.when("status", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid("Lost").label("Status"),
      }),
      then: IVal.string().required().label("Reason for loss"),
    }),
    contractStartDate: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid("Live").label("Status"),
      }),
      then: IVal.string().required().label("Contract start date"),
    }),
    contractEndDate: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid("Live").label("Status"),
      }),
      then: IVal.string().required().label("Contract end date"),
    }),
    reviewDate: IVal.when("stage", {
      is: IVal.object().keys({
        value: IVal.string().label("Status"),
        label: IVal.valid("Live").label("Status"),
      }),
      then: IVal.string().required().label("Review date"),
    }),
    attachments: IVal.label("Attachments"),
    notes: IVal.label("Notes"),
    companyNumber: IVal.label("Registration number"),
    logoInfo: IVal.label("Logo"),
    tagsAndCategories: IVal.label("Tag and Category"),
  };
  const { groups } = useContext(SuperGlobalContext);
  const {
    confirmation,
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);
  let { data, errors } = dataModel;

  const [formImage, setFormImage] = useState(null);
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  let { alert } = useAlerts();
  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);
  return (
    <Form action="/" method="get">
      {alert}
      <Row>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={groups.map((group) => ({
              value: group._id,
              label: group.name,
            }))}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputText
            label="Organisation name"
            placeholder="Organisation name"
            name="name"
            mandatory={true}
            value={data.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputText
            label="Registration number"
            placeholder="Registration number"
            name="companyNumber"
            value={data.companyNumber}
            onChange={handleChange}
            error={errors.companyNumber}
          />
        </Col>
      </Row>

      <Row>
        <Col md="12" className="mb-3">
          <ImsFormImageUpload
            // label="Logo"
            name="crms"
            imageUrl={formImage}
            customerLogo={customerLogo}
            clearAll={data.logoInfo.length ? false : true}
            onUpload={(files) => handleFileChange(files, "logoInfo")}
            validate={validate}
            processing={processing}
            isUploadable={false}
            setFormImage={setFormImage}
            label="Logo"
          />
        </Col>
        <Col md={"12"}>
          <ImsInputSelect
            label={"Organisation profile"}
            name="stage"
            value={data.stage}
            mandatory={true}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={stages}
          />
        </Col>
      </Row>
      {data.stage.value && (
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Building name"
              placeholder="Building name"
              name="buildingName"
              mandatory={true}
              value={data.buildingName}
              onChange={handleChange}
              error={errors.buildingName}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Street name"
              placeholder="Street name"
              name="streetName"
              mandatory={true}
              value={data.streetName}
              onChange={handleChange}
              error={errors.streetName}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="City/Town"
              placeholder="City/Town"
              name="town"
              mandatory={true}
              value={data.town}
              onChange={handleChange}
              error={errors.town}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Post code"
              placeholder="Post code"
              name="postCode"
              mandatory={true}
              value={data.postCode}
              onChange={handleChange}
              error={errors.postCode}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Primary contact"
              placeholder="i.e. John Doe"
              name="primaryContact"
              mandatory={true}
              value={data.primaryContact}
              onChange={handleChange}
              error={errors.primaryContact}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Email"
              placeholder="Primary email"
              name="primaryEmail"
              mandatory={true}
              value={data.primaryEmail}
              onChange={handleChange}
              error={errors.primaryEmail}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Phone number"
              placeholder="Phone number"
              name="phoneNumber"
              mandatory={true}
              value={data.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
          </Col>
          <Col xl={drawerView ? "12" : "6"} xs="12">
            <ImsInputSelect
              name="tagsAndCategories"
              value={data.tagsAndCategories}
              vertical={true}
              onChange={handleChange}
              onInputChange={setSearchString}
              options={[
                {
                  value: null,
                  label: "Not selected",
                },
                ...tagsAndCategories.map((tag) => ({
                  value: tag._id,
                  label: tag.name,
                })),
              ]}
              label={"Category"}
              sideBtn={<AddCategory />}
              className="react-select default"
              classNamePrefix="react-select"
            />
          </Col>
          {customer && (
            <>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputText
                  label="Secondary contact"
                  placeholder="i.e. David warner"
                  name="secondaryContact"
                  value={data.secondaryContact}
                  onChange={handleChange}
                  error={errors.secondaryContact}
                />
              </Col>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputText
                  label="Secondary email"
                  placeholder="Secondary email"
                  name="secondaryEmail"
                  value={data.secondaryEmail}
                  onChange={handleChange}
                  error={errors.secondaryEmail}
                />
              </Col>
            </>
          )}
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Source"
              placeholder="Source"
              name="source"
              mandatory={true}
              value={data.source}
              onChange={handleChange}
              error={errors.source}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputTextWithIcon
              label="Contract value"
              placeholder="Contract value"
              icon="fas fa-pound-sign"
              name="contractValue"
              mandatory={true}
              value={data.contractValue}
              onChange={handleChange}
              error={errors.contractValue}
            />
          </Col>

          {data.stage.value !== "Live" && (
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputSelect
                label={"Probability"}
                name="probability"
                value={data.probability}
                mandatory={true}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={probabilities.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
              />
            </Col>
          )}
          <Col md="12">
            <ImsTextEditor
              label="Service provision"
              name="serviceProvision"
              placeholder={"Service provision."}
              value={data.serviceProvision}
              mediaLinkGeneratorFn={linkGenerator}
              onEachFileSelection={handleUpload}
              onChange={handleChange}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label="Account manager"
              name="accountManager"
              value={data.accountManager}
              className="react-select default"
              classNamePrefix="react-select"
              mandatory={true}
              onChange={handleChange}
              options={users
                .filter((user) =>
                  filterUsersByGroup(
                    user.membership,
                    dataModel.data.group.value
                  )
                )
                .map((user) => ({ value: user._id, label: user.name }))}
            />
          </Col>

          {data.stage.value !== "Live" && (
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputSelect
                label={"Status"}
                name="status"
                value={data.status}
                mandatory={true}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={statuses}
              />
            </Col>
          )}

          {data.stage.value === "Live" && (
            <>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputText
                  label="Account number"
                  placeholder="Account number"
                  name="accountNumber"
                  value={data.accountNumber}
                  onChange={handleChange}
                  error={errors.accountNumber}
                />
              </Col>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputDate
                  label="Contract start date"
                  name="contractStartDate"
                  mandatory={true}
                  value={data.contractStartDate}
                  onChange={handleChange}
                  error={errors.contractStartDate}
                />
              </Col>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputDate
                  label="Contract end date"
                  name="contractEndDate"
                  mandatory={true}
                  value={data.contractEndDate}
                  onChange={handleChange}
                  error={errors.contractEndDate}
                />
              </Col>
              <Col md={drawerView ? "12" : "6"}>
                <ImsInputDate
                  label="Review date"
                  name="reviewDate"
                  mandatory={true}
                  value={data.reviewDate}
                  onChange={handleChange}
                  error={errors.reviewDate}
                />
              </Col>
            </>
          )}
          {data.status.value === "Lost" && (
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputText
                label="Reason for loss"
                name="reasonForLoss"
                placeholder="Reason for loss"
                mandatory={true}
                value={data.reasonForLoss}
                onChange={handleChange}
                error={errors.reasonForLoss}
                type="textarea"
                rows="2"
                cols="80"
              />
            </Col>
          )}
          <Col md="12">
            <ImsInputDropZone
              label="Attachments"
              clearAll={!data.attachments.length}
              name="crms"
              onLoad={(files) => handleFileChange(files, "attachments")}
            />
          </Col>
          <Col md="12">
            <ImsTextEditor
              label="Notes"
              name="notes"
              placeholder={"Notes"}
              value={data.notes}
              mediaLinkGeneratorFn={linkGenerator}
              onEachFileSelection={handleUpload}
              onChange={handleChange}
            />
          </Col>
        </Row>
      )}
      <ImsButtonGroup>
        {customer ? (
          <>
            <Button
              name="update"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false, {
                  confirmation:
                    customer.stage !== "Live" && data.stage.value === "Live",
                  confirmationMessage: `${customer?.reference} ${customer?.name} will be going live.`,
                });
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="info"
              type="button"
            >
              {isBusy
                ? "Processing"
                : customer.stage !== "Live" && data.stage.value === "Live"
                ? "Go live"
                : "Update"}
            </Button>
          </>
        ) : (
          <Button
            name="create"
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data), true, {
                confirmation: data.stage.value === "Live",
                confirmationMessage: `${dataModel.data?.name}  will be going live. This will be added to your database.`,
              });
            }}
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {isBusy
              ? "Processing"
              : data.stage.value === "Live"
              ? "Go live"
              : "Create"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default CustomerForm;
