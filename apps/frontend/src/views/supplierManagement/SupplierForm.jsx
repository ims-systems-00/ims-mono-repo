import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
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
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { mapToSupplierModel } from "@/services/supplierManagementServices";
import { filterUsersByGroup } from "@/utils/filters";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsInputTextWithIcon,
} from "@/views/shared/ImsFormElements/Index";
const SupplierForm = ({ visitingSupplier: supplier, onSubmit = () => {} }) => {
  let { authGlobalAccess } = useAccess();
  let { users, lazyLoadUsers } = useUsers();

  const dataSet = supplier
    ? mapToSupplierModel(supplier)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          accountManager: "",
          accountNumber: "",
          buyer: {
            value: null,
            label: "Select buyer",
          },
          email: "",
          serviceProvision: "",
          contractValue: 0,
          contractStartDate: "",
          contractEndDate: "",
          reviewDate: "",
          slaFiles: [],
          contractFiles: [],
          onBoardingFiles: [],
        },
        errors: {},
      };

  // Validation rules ....
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    name: IVal.string().required().label("Supplier name"),
    accountManager: IVal.string().required().label("Account manager"),
    accountNumber: IVal.string().required().label("Account number"),
    buyer: IVal.object().keys({
      value: IVal.string().label("Buyer name"),
      label: IVal.label("Buyer name"),
    }),
    email: IVal.string().email().required().label("Email"),
    serviceProvision: IVal.string().required().label("Service provision"),
    contractValue: IVal.number().required().label("Contract value"),
    contractStartDate: IVal.string().required().label("Contract start date"),
    contractEndDate: IVal.label("Contract end date"),
    reviewDate: IVal.label("Review Date"),
    slaFiles: IVal.label("Sla files"),
    contractFiles: IVal.label("Contract files"),
    onBoardingFiles: IVal.label("Onboarding files"),
  };

  let notify = React.useContext(NotificationContext);
  const { groups } = useContext(SuperGlobalContext);
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);
  let { data, errors } = dataModel;
  const viewContextData = useContext(ViewContext);
  const history = useHistory();
  // populating form if in editing mode ...

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md="6">
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            isDisabled={supplier ? true : false}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={[
              { value: null, label: "Not selected" },
              ...groups.map((group) => ({
                value: group._id,
                label: group.name,
              })),
            ]}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Supplier name"
            placeholder="Supplier name"
            mandatory={true}
            name="name"
            value={data.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Col>
        <Col md="6">
          {" "}
          <ImsInputText
            label="Account manager"
            placeholder="Account manager"
            mandatory={true}
            name="accountManager"
            value={data.accountManager}
            onChange={handleChange}
            error={errors.accountManager}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Account number"
            placeholder="Account number"
            mandatory={true}
            name="accountNumber"
            value={data.accountNumber}
            onChange={handleChange}
            error={errors.accountNumber}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Email"
            placeholder="Email"
            name="email"
            mandatory={true}
            value={data.email}
            onChange={handleChange}
            error={errors.email}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Buyer name"
            name="buyer"
            value={data.buyer}
            mandatory={true}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users
              .filter((user) =>
                filterUsersByGroup(user.membership, dataModel.data.group.value)
              )
              .map((user) => ({ value: user._id, label: user.name }))}
          />
        </Col>
        <Col md="6">
          <ImsInputTextWithIcon
            label="Contract value"
            placeholder="Contract value"
            icon="fas fa-pound-sign"
            mandatory={true}
            name="contractValue"
            value={data.contractValue}
            onChange={handleChange}
            error={errors.contractValue}
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Contract start date"
            name="contractStartDate"
            mandatory={true}
            value={data.contractStartDate}
            onChange={handleChange}
            error={errors.contractStartDate}
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Contract end date"
            mandatory={true}
            name="contractEndDate"
            value={data.contractEndDate}
            onChange={handleChange}
            error={errors.contractEndDate}
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="Review date"
            name="reviewDate"
            value={data.reviewDate}
            onChange={handleChange}
            error={errors.reviewDate}
          />
        </Col>
      </Row>

      <ImsInputText
        label="Service provision"
        name="serviceProvision"
        mandatory={true}
        placeholder="Service provision"
        value={data.serviceProvision}
        onChange={handleChange}
        error={errors.serviceProvision}
        type="textarea"
        rows="2"
        cols="80"
      />

      <ImsInputDropZone
        label="SLA files"
        clearAll={!data.slaFiles.length}
        name="sla"
        onLoad={(files) => handleFileChange(files, "slaFiles")}
      />
      <ImsInputDropZone
        label="Contract files"
        clearAll={!data.contractFiles.length}
        name="contract"
        onLoad={(files) => handleFileChange(files, "contractFiles")}
      />
      <ImsInputDropZone
        label="Onboarding files"
        clearAll={!data.onBoardingFiles.length}
        name="onboarding"
        onLoad={(files) => handleFileChange(files, "onBoardingFiles")}
      />
      <ImsButtonGroup>
        {supplier ? (
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
          </>
        ) : (
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
            {isBusy ? "Processing" : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default SupplierForm;
