import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import {
  ImsInputText,
  ImsInputSelect,
  Button,
  Form,
  Row,
  Col,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import {
  mapToOrganisationModel,
  updateOrganisation,
} from "@/services/organizationService";
import currencies from "@/utils/currency";
import {
  numberToBankNumberString,
  numberToSortCodeString,
} from "@/utils/inputFormats";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/CustomFormElements";

const OrganisationForm = ({
  organisation,
  refreshOrganisation,
  setProcessing,
  processing,
}) => {
  let notify = React.useContext(NotificationContext);
  let dataSet = organisation
    ? mapToOrganisationModel(organisation)
    : {
        data: {
          name: "",
          officeEmail: "",
          address: "",
          companyNumber: "",
          vatNumber: "",
          bankName: "",
          sortCode: "",
          accountNumber: "",
          currency: {
            value: currencies[0].symbol_native,
            label: `${currencies[0].name} (${currencies[0].symbol_native})`,
          },
          leaveDaysEntitledTo: 0,
        },
        errors: {},
      };
  const schema = {
    name: IVal.string().required().label("Name"),
    officeEmail: IVal.string().email().required().label("Email"),
    address: IVal.string().required().label("Address"),
    companyNumber: IVal.string().required().label("Company number"),
    vatNumber: IVal.label("VAT number"),
    bankName: IVal.string().required().label("Bank name"),
    sortCode: IVal.string().required().label("Sort code"),
    accountNumber: IVal.string().required().label("Account number"),
    currency: IVal.object().keys({
      value: IVal.string().required().label("Currency"),
      label: IVal.label("Currency"),
    }),
    amount: IVal.number().min(0).label("Mileage"),
  };
  const {
    dataModel,
    handleChange,
    handleSubmit,
    // validate, handleFileChange
  } = useForm(dataSet, schema);
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updateOrganisation(dataModel.data);
          refreshOrganisation && refreshOrganisation(data.organization);
          notify("Organisation updated successfully", "success");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md="6">
          <ImsInputText
            label="Name"
            name="name"
            mandatory={true}
            value={data.name}
            disabled={true}
            onChange={handleChange}
            error={errors.name}
            placeholder="Name"
          />
        </Col>
        <Col md="6">
          {" "}
          <ImsInputText
            label="Organisation email"
            name="officeEmail"
            mandatory={true}
            value={data.officeEmail}
            onChange={handleChange}
            error={errors.officeEmail}
            placeholder="Organisation email"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Address"
            name="address"
            mandatory={true}
            value={data.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Address"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Company number"
            name="companyNumber"
            mandatory={true}
            value={data.companyNumber}
            onChange={handleChange}
            error={errors.companyNumber}
            placeholder="Company number"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="VAT number"
            name="vatNumber"
            value={data.vatNumber}
            onChange={handleChange}
            error={errors.vatNumber}
            placeholder="VAT number"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Bank name"
            name="bankName"
            mandatory={true}
            value={data.bankName}
            onChange={handleChange}
            error={errors.bankName}
            placeholder="Bank name"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Sort code"
            name="sortCode"
            mandatory={true}
            value={numberToSortCodeString(data.sortCode.toString())}
            onChange={handleChange}
            error={errors.sortCode}
            placeholder="Sort code"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Account number"
            name="accountNumber"
            mandatory={true}
            value={numberToBankNumberString(data.accountNumber.toString())}
            onChange={handleChange}
            error={errors.accountNumber}
            placeholder="Account number"
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Currency"
            name="currency"
            mandatory={true}
            value={data.currency}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={currencies.map((currency) => ({
              value: `${currency.name} (${currency.symbol_native})`,
              label: `${currency.name} (${currency.symbol_native})`,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            type="number"
            label="Cost per mile"
            name="amount"
            value={data.amount}
            onChange={handleChange}
            error={errors.amount}
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        <Button
          name="update"
          onClick={(e) => {
            handleSubmit(e, doSubmit, false);
          }}
          // disabled={validate() ? true : processing.action === "update"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "update" ? "Processing" : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default OrganisationForm;
