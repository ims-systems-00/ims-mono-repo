import React from "react";

import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { industries } from "../onboarding/anOrganisation/industries";
import { countries } from "../onboarding/anOrganisation/countries";
import useForm from "@/hooks/useForm";
import { createSchema, updateSchema } from "./validation";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";

const industryOptions = industries.map((i) => {
  return { value: i, label: i };
});

const countryOptions = countries.map((c) => {
  return { value: c.countryName, label: c.countryName };
});

const currencyOptions = [
  { value: "GBP", label: "GBP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "BDT", label: "BDT" },
];

const OrganisationForm = ({
  visitingOrganisation,
  onSubmit = () => {},
  drawerView = true,
}) => {
  const { closeDrawer } = useDrawer();

  const isUpdateMode = Boolean(visitingOrganisation);
  const org = visitingOrganisation || {};

  const formatSelect = (val) => (val ? { value: val, label: val } : null);

  const initialData = isUpdateMode
    ? {
        name: org.name || "",
        officeEmail: org.officeEmail || "",
        vatNumber: org.vatNumber || "",

        addressCity: org.addressCity || "",
        addressStreet: org.addressStreet || "",
        addressBuilding: org.addressBuilding || "",
        addressPostCode: org.addressPostCode || "",
        addressStateProvince: org.addressStateProvince || "",
        countryName: formatSelect(org.countryName),
        countryAbbr: org.countryAbbr || "",
        countryCurrency: org.countryCurrency || "",
        countryPhonecode: org.countryPhonecode || "",
        logometadata: org.logometadata || null,

        companyNumber: org.companyNumber || "",
        typeOfBusiness: org.typeOfBusiness || "",

        bankName: org.bankDetails?.name || "",
        accountNumber: org.bankDetails?.accountNo || "",
        sortCode: org.bankDetails?.sortCode || "",

        amount: org.millageCostForUsers?.amount || "",
        currency: formatSelect(org.millageCostForUsers?.currency),
      }
    : {
        name: "",
        officeEmail: "",
        contactNumber: "",
        sizeOfOrg: "",
        industry: { value: null, label: "Select Industry" },
        referralSource: "",

        addressCity: "",
        addressStreet: "",
        addressBuilding: "",
        addressPostCode: "",
        addressStateProvince: "",
        countryName: { value: null, label: "Select Country" },
        countryAbbr: "",
        countryCurrency: "",
        countryPhonecode: "",
        logometadata: null,
      };

  const dataSet = { data: initialData, errors: {} };

  const schema = isUpdateMode ? updateSchema : createSchema;

  const {
    dataModel,
    isBusy,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);

  const { data, errors } = dataModel;

  return (
    <Form action="/" method="post">
      <div className="my-3 font-weight-bold">Basic Information</div>
      <Row>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Organisation name"
            name="name"
            mandatory={true}
            value={data.name}
            onChange={handleChange}
            error={errors.name}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Office email"
            name="officeEmail"
            mandatory={true}
            value={data.officeEmail}
            onChange={handleChange}
            error={errors.officeEmail}
            isHorizontal={false}
          />
        </Col>
      </Row>

      {!isUpdateMode && (
        <Row>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputText
              label="Contact number"
              name="contactNumber"
              value={data.contactNumber}
              onChange={handleChange}
              error={errors.contactNumber}
              isHorizontal={false}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputText
              label="Size of organisation"
              name="sizeOfOrg"
              mandatory={true}
              value={data.sizeOfOrg}
              onChange={handleChange}
              error={errors.sizeOfOrg}
              isHorizontal={false}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputSelect
              name="industry"
              value={data.industry}
              mandatory={true}
              onChange={handleChange}
              vertical={true}
              options={industryOptions}
              label="Industry"
              error={errors.industry}
              className="react-select default"
              classNamePrefix="react-select"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputText
              label="Referral Source (ObjectId)"
              name="referralSource"
              mandatory={true}
              value={data.referralSource}
              onChange={handleChange}
              error={errors.referralSource}
              isHorizontal={false}
            />
          </Col>
        </Row>
      )}

      {isUpdateMode && (
        <>
          <div className="my-3 font-weight-bold">Primary Contact Person</div>

          <div className="my-3 font-weight-bold">Business Details</div>
          <Row>
            <Col md={drawerView ? "12" : "6"} xs="12">
              <ImsInputText
                label="VAT Number"
                name="vatNumber"
                value={data.vatNumber}
                onChange={handleChange}
                error={errors.vatNumber}
                isHorizontal={false}
              />
            </Col>
            <Col md={drawerView ? "12" : "6"} xs="12">
              <ImsInputText
                label="Company Number"
                name="companyNumber"
                value={data.companyNumber}
                onChange={handleChange}
                error={errors.companyNumber}
                isHorizontal={false}
              />
            </Col>
            <Col md={drawerView ? "12" : "6"} xs="12">
              <ImsInputText
                label="Type Of Business"
                name="typeOfBusiness"
                value={data.typeOfBusiness}
                onChange={handleChange}
                error={errors.typeOfBusiness}
                isHorizontal={false}
              />
            </Col>
          </Row>

          <div className="my-3 font-weight-bold">Bank Details</div>
          <Row>
            <Col md={drawerView ? "12" : "4"} xs="12">
              <ImsInputText
                label="Bank Name"
                name="bankName"
                mandatory={true}
                value={data.bankName}
                onChange={handleChange}
                error={errors.bankName}
                isHorizontal={false}
              />
            </Col>
            <Col md={drawerView ? "12" : "4"} xs="12">
              <ImsInputText
                label="Account No"
                name="accountNumber"
                mandatory={true}
                value={data.accountNumber}
                onChange={handleChange}
                error={errors.accountNumber}
                isHorizontal={false}
              />
            </Col>
            <Col md={drawerView ? "12" : "4"} xs="12">
              <ImsInputText
                label="Sort Code"
                name="sortCode"
                mandatory={true}
                value={data.sortCode}
                onChange={handleChange}
                error={errors.sortCode}
                isHorizontal={false}
              />
            </Col>
          </Row>

          <div className="my-3 font-weight-bold">Mileage Costs (User)</div>
          <Row>
            <Col md={drawerView ? "12" : "6"} xs="12">
              <ImsInputText
                label="Amount"
                name="amount"
                mandatory={true}
                value={data.amount}
                onChange={handleChange}
                error={errors.amount}
                isHorizontal={false}
              />
            </Col>
            <Col md={drawerView ? "12" : "6"} xs="12">
              <ImsInputSelect
                name="currency"
                value={data.currency}
                mandatory={true}
                onChange={handleChange}
                vertical={true}
                options={currencyOptions}
                label="Currency"
                error={errors.currency}
                className="react-select default"
                classNamePrefix="react-select"
              />
            </Col>
          </Row>
        </>
      )}

      <div className="my-3 font-weight-bold">Address & Location</div>
      <Row>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Street"
            name="addressStreet"
            mandatory={true}
            value={data.addressStreet}
            onChange={handleChange}
            error={errors.addressStreet}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Building"
            name="addressBuilding"
            mandatory={true}
            value={data.addressBuilding}
            onChange={handleChange}
            error={errors.addressBuilding}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="City"
            name="addressCity"
            mandatory={true}
            value={data.addressCity}
            onChange={handleChange}
            error={errors.addressCity}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="State / Province"
            name="addressStateProvince"
            mandatory={true}
            value={data.addressStateProvince}
            onChange={handleChange}
            error={errors.addressStateProvince}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Post code"
            name="addressPostCode"
            mandatory={true}
            value={data.addressPostCode}
            onChange={handleChange}
            error={errors.addressPostCode}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputSelect
            name="countryName"
            value={data.countryName}
            onChange={handleChange}
            options={countryOptions}
            label="Country"
            mandatory={true}
            error={errors.countryName}
            className="react-select default"
            classNamePrefix="react-select"
            isHorizontal={false}
          />
        </Col>
      </Row>

      <Row>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Country Abbreviation"
            name="countryAbbr"
            mandatory={true}
            value={data.countryAbbr}
            onChange={handleChange}
            error={errors.countryAbbr}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Currency"
            name="countryCurrency"
            mandatory={true}
            value={data.countryCurrency}
            onChange={handleChange}
            error={errors.countryCurrency}
            isHorizontal={false}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputText
            label="Country phone code"
            name="countryPhonecode"
            mandatory={true}
            value={data.countryPhonecode}
            onChange={handleChange}
            error={errors.countryPhonecode}
            isHorizontal={false}
          />
        </Col>
      </Row>

      <ImsInputDropZone
        label="Upload logo"
        clearAll={!data.logometadata}
        name="logo"
        onLoad={(files) => {
          const value = files && files.length > 0 ? files[0] : null;
          handleFileChange(value, "logometadata");
        }}
        isHorizontal={false}
      />

      <ImsButtonGroup>
        <Button
          onClick={(e) => {
            handleSubmit(e, () => onSubmit(dataModel.data), false);
          }}
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color={isUpdateMode ? "info" : "primary"}
          type="button"
        >
          {isBusy
            ? "Processing"
            : isUpdateMode
              ? "Update Organisation"
              : "Create Organisation"}
        </Button>

        <Button
          onClick={() =>
            closeDrawer(
              isUpdateMode ? "organisation-update" : "organisation-create"
            )
          }
          className="btn-outline ms-2"
          color="secondary"
          type="button"
        >
          Cancel
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default OrganisationForm;
