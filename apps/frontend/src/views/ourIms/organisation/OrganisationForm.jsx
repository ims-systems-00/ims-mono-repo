import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { mapToOrganisationModel } from "@/services/organizationService";
import currencies from "@/utils/currency";
import {
  numberToBankNumberString,
  numberToSortCodeString,
} from "@/utils/inputFormats";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/CustomFormElements";

const OrganisationForm = ({ organisation, onSubmit = () => {} }) => {
  let dataSet = organisation
    ? mapToOrganisationModel(organisation)
    : {
        data: {
          name: "",
          officeEmail: "",
          addressCity: "",
          addressStreet: "",
          addressBuilding: "",
          addressPostCode: "",
          addressStateProvince: "",
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
    addressCity: IVal.string().required().label("Address"),
    addressStreet: IVal.string().required().label("Address"),
    addressBuilding: IVal.string().required().label("Address"),
    addressPostCode: IVal.string().required().label("Address"),
    addressStateProvince: IVal.string().required().label("Address"),
    companyNumber: IVal.string().required().label("Company number"),
    vatNumber: IVal.label("VAT number"),
    bankName: IVal.string().required().label("Bank name"),
    sortCode: IVal.string().optional().allow("").label("Sort code"),
    accountNumber: IVal.string().optional().allow("").label("Account number"),
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
    isBusy,
    validate,
    // validate, handleFileChange
  } = useForm(dataSet, schema);

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md="12">
          <ImsInputText
            label="Name"
            name="name"
            mandatory={true}
            value={data.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Name"
          />
        </Col>
        <Col md="12">
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
        <Col md="12">
          <ImsInputText
            label="Building"
            name="addressBuilding"
            mandatory={true}
            value={data.addressBuilding}
            onChange={handleChange}
            error={errors.addressBuilding}
            placeholder="Building"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Street"
            name="addressStreet"
            mandatory={true}
            value={data.addressStreet}
            onChange={handleChange}
            error={errors.addressStreet}
            placeholder="Street"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="City"
            name="addressCity"
            mandatory={true}
            value={data.addressCity}
            onChange={handleChange}
            error={errors.addressCity}
            placeholder="City"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="State/Province"
            name="addressStateProvince"
            mandatory={true}
            value={data.addressStateProvince}
            onChange={handleChange}
            error={errors.addressStateProvince}
            placeholder="State/Province"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Post code"
            name="addressPostCode"
            mandatory={true}
            value={data.addressPostCode}
            onChange={handleChange}
            error={errors.addressPostCode}
            placeholder="Post code"
          />
        </Col>
        <Col md="12">
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
        <Col md="12">
          <ImsInputText
            label="VAT number"
            name="vatNumber"
            value={data.vatNumber}
            onChange={handleChange}
            error={errors.vatNumber}
            placeholder="VAT number"
          />
        </Col>
        <Col md="12">
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
        <Col md="12">
          <ImsInputText
            label="Sort code"
            name="sortCode"
            value={numberToSortCodeString(data.sortCode.toString())}
            onChange={handleChange}
            error={errors.sortCode}
            placeholder="Sort code"
          />
        </Col>
        <Col md="12">
          <ImsInputText
            label="Account number"
            name="accountNumber"
            value={numberToBankNumberString(data.accountNumber.toString())}
            onChange={handleChange}
            error={errors.accountNumber}
            placeholder="Account number"
          />
        </Col>
        {/* <Col md="12">
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
        </Col> */}
        <Col md="12">
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
            handleSubmit(e, () => onSubmit(dataModel.data), false);
          }}
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {isBusy ? "Processing" : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default OrganisationForm;
