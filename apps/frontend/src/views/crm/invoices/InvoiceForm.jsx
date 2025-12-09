import defaultImage from "@/assets/img/image-placeholder.jpg";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useForm from "@/hooks/useForm";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  ImsInputDate,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { mapToInvoiceModel } from "@/services/invoicesServices";
import {
  numberToBankNumberString,
  numberToSortCodeString,
} from "@/utils/inputFormats";
import IVal from "@/validations/validator";
import ItemsTable from "./ItemsTable";
import invoicefooter from "@/assets/img/invoice-footer.svg";

const parseNumber = (number) => {
  return number && !isNaN(number) ? parseFloat(number) : 0;
};

const InvoiceForm = ({
  customer,
  organisationInfo,
  visitingInvoice: savedInvoice,
  onSubmit = () => {},
  onSaveAndSendInvoice = () => {},
  onDownload = () => {},
  onPayment = () => {},
  onResendInvoice = () => {},
  ...props
}) => {
  let [refreshTable, setRefreshTable] = React.useState(false);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let [editMode, setEditMode] = useState(
    !savedInvoice || (savedInvoice && savedInvoice.status === "Draft")
      ? true
      : false
  );
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  let updateDataTable = (updatedData) => {};
  // let { activateView, Modal } = useModal({ onUpdate: updateDataTable });
  let notify = React.useContext(NotificationContext);
  let [tableValid, setTableValid] = useState(false);
  let checkTablevalidation = (isValid) => setTableValid(isValid);
  const dataSet = savedInvoice
    ? mapToInvoiceModel(savedInvoice)
    : {
        data: {
          group: customer?.group?._id,
          customer: customer?._id,
          emails: [],
          calculations: { total: 0, discount: 0, vatFigure: 0 },
          due: moment(new Date()).format("DD/MM/YYYY"),
          entries: [],
        },
        errors: {},
      };

  const schema = {
    group: IVal.label("Group"),
    customer: IVal.label("Customer"),
    emails: IVal.label("Email"),
    calculations: IVal.object().keys({
      total: IVal.number().required().label("Total"),
      discount: IVal.label("discount"),
      vatFigure: IVal.label("VAT figure"),
    }),
    due: IVal.label("Due"),
    entries: IVal.label("Entries"),
  };

  const {
    dataModel,
    handleChange,
    handleSubmit,
    isBusy,
    resetForm,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);

  let { data: invoice, errors } = dataModel;

  const mapEntry = (entry) => {
    return {
      item: entry[0].text,
      unitPrice: entry[1].text,
      units: entry[2].text,
      vatRate: entry[3].text,
      vatFigure: entry[4].text,
      subTotal: entry[5].text,
    };
  };

  const updateInvoiceCalculations = (invoiceData) => {
    handleChange({
      currentTarget: {
        name: "calculations",
        value: invoiceData.calculations,
      },
    });
  };
  const updateInvoiceEntries = (invoiceData) => {
    handleChange({
      currentTarget: {
        name: "entries",
        value: invoiceData.entries.map((entry) => mapEntry(entry.data)),
      },
    });
  };
  console.log(organisationInfo);
  return (
    <>
      {alert}
      <div className="content">
        <Card className="card-invoice" id="invoice-card">
          <CardHeader>
            {savedInvoice ? `Invoice#00${savedInvoice.ID}` : "New invoice"}
          </CardHeader>
          <CardBody>
            <Row>
              {organisationInfo && customer && (
                <Col md="12">
                  <Card variant="light">
                    <CardBody className="p-0">
                      <div className="d-flex">
                        {organisationInfo.logo && organisationInfo.logo.src && (
                          <div className="invoice-logo d-flex justify-content-center align-items-center me-3">
                            <img
                              src={
                                organisationInfo.logo &&
                                organisationInfo.logo.src
                                  ? organisationInfo.logo.src
                                  : defaultImage
                              }
                              alt="..."
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-primary">Billed from</h4>
                          <span className="text-bold font-size-subtitle-2">
                            {organisationInfo.name}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span className="text-dark">Company information</span>{" "}
                          <br />
                          <span className="text-dark">Address:</span>{" "}
                          <span className="text-secondary">
                            {organisationInfo.addressBuilding},{" "}
                            {organisationInfo.addressStreet},{" "}
                            {organisationInfo.addressCity},{" "}
                            {organisationInfo.addressStateProvince},
                            {organisationInfo.addressPostCode}.
                          </span>{" "}
                          <br></br>
                          <span className="text-dark">Email:</span>{" "}
                          <span className="text-secondary">
                            {organisationInfo.officeEmail}
                          </span>
                          <br></br>
                          <span className="text-dark">
                            Registration number:
                          </span>{" "}
                          <span className="text-secondary">
                            {organisationInfo.companyNumber}
                          </span>{" "}
                          <br></br>
                          <span className="text-dark">VAT number:</span>{" "}
                          <span className="text-secondary">
                            {organisationInfo.vatNumber}
                          </span>
                        </p>
                        {customer.accountManager && (
                          <p className="mt-2">
                            <span className="text-dark">Point of contact</span>
                            <br />
                            <span className="text-dark">Name:</span>{" "}
                            <span className="text-secondary">
                              {customer?.accountManager?.name}
                            </span>{" "}
                            <br />
                            <span className="text-dark">Email:</span>{" "}
                            <span className="text-secondary">
                              {customer?.accountManager?.email}
                            </span>
                          </p>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )}
              <Col md="12">
                <Card variant="light">
                  <CardBody className=" p-0">
                    {customer && organisationInfo && (
                      <>
                        <div className="d-flex">
                          <div className="invoice-logo d-flex justify-content-center align-items-center me-3">
                            <img
                              src={
                                customer.logo && customer.logo.src
                                  ? customer.logo.src
                                  : defaultImage
                              }
                              alt="..."
                            />
                          </div>

                          <div>
                            <h4 className="text-primary">Billed to</h4>
                            <span className="text-bold font-size-subtitle-2">
                              {customer.reference} {customer.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p>
                            <span className="text-dark">Address:</span>{" "}
                            <span className="text-secondary">
                              {customer.buildingName} {customer.streetName}{" "}
                              {customer.postCode}
                            </span>{" "}
                          </p>
                          {customer.companyNumber && (
                            <p>
                              <span className="text-dark">
                                Company registration number:
                              </span>{" "}
                              <span className="text-secondary">
                                {customer.companyNumber}
                              </span>{" "}
                            </p>
                          )}
                          <Row className="mt-2">
                            <Col md="6">
                              <p>
                                <span className="text-dark">
                                  {" "}
                                  Primary contact <br />
                                </span>{" "}
                                <span className="text-dark">Name:</span>{" "}
                                <span className="text-secondary">
                                  {customer.primaryContact}
                                </span>{" "}
                                <br />
                                <span className="text-dark">Email:</span>{" "}
                                <span className="text-secondary">
                                  {customer.primaryEmail}
                                </span>
                              </p>
                              {customer.secondaryContact && (
                                <p>
                                  <span className="text-dark">
                                    Secondary contact
                                  </span>{" "}
                                  <br />
                                  <span className="text-dark">Name:</span>{" "}
                                  <span className="text-secondary">
                                    {customer.secondaryContact}
                                  </span>{" "}
                                  <br />
                                  <span className="text-dark">Email:</span>{" "}
                                  <span className="text-secondary">
                                    {customer.secondaryEmail}
                                  </span>
                                </p>
                              )}
                            </Col>
                          </Row>
                          {editMode ? (
                            <Col md="5">
                              <ImsInputDate
                                lableCol="3"
                                inputCol="9"
                                label="Payment due date"
                                name="due"
                                value={invoice.due}
                                onChange={handleChange}
                              />
                            </Col>
                          ) : (
                            <p>
                              <span className="text-dark">
                                Payment due date:
                              </span>{" "}
                              <span className="text-secondary">
                                {invoice.due}
                              </span>
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <ItemsTable
              showAddItem={
                savedInvoice &&
                (savedInvoice.status === "Paid" ||
                  savedInvoice.status === "Sent")
              }
              refresh={refreshTable}
              editMode={editMode}
              onRowUpdate={(data) => updateInvoiceEntries(data)}
              onCalculationUpdate={(data) => updateInvoiceCalculations(data)}
              calculations={{
                total: invoice.calculations.total,
                discount: invoice.calculations.discount,
                vatFigure: invoice.calculations.vatFigure,
              }}
              tableData={invoice.entries.map((entry, i) => ({
                data: [
                  {
                    name: `item-nid-${i}`,
                    type: "text",
                    text: entry.item,
                    error: "",
                  },
                  {
                    name: `unitPrice-nid-${i}`,
                    type: "number",
                    text: entry.unitPrice,
                    error: "",
                  },
                  {
                    name: `units-nid-${i}`,
                    type: "number",
                    text: entry.units,
                    error: "",
                  },
                  {
                    name: `vatRate-nid-${i}`,
                    type: "number",
                    text: entry.vatRate,
                    error: "",
                  },
                  {
                    name: `vatFigure-nid-${i}`,
                    type: "number",
                    text: entry.vatFigure,
                    error: "",
                  },
                  {
                    className: "text-right",
                    name: `subTotal-nid-${i}`,
                    type: "number",
                    text: entry.subTotal,
                    error: "",
                  },
                ],
              }))}
              checkValidation={checkTablevalidation}
            />
            {!editMode && (
              <Row>
                <Col md="6">
                  <p>Bank details</p>
                  {organisationInfo && (
                    <>
                      <p>
                        {organisationInfo.bankDetails &&
                          organisationInfo.bankDetails.name}
                        <br />
                        Sort code{" "}
                        <span className="text-secondary">
                          {organisationInfo.bankDetails &&
                            numberToSortCodeString(
                              organisationInfo.bankDetails.sortCode.toString()
                            )}
                        </span>
                        <br />
                        Account No{" "}
                        <span className="text-secondary">
                          {organisationInfo.bankDetails &&
                            numberToBankNumberString(
                              organisationInfo.bankDetails.accountNo.toString()
                            )}
                        </span>
                      </p>
                    </>
                  )}
                </Col>
                <Col md="6"></Col>
              </Row>
            )}
            {/* {!tableValid && (
              <span className="text-danger">
                You have invalid data in the table
              </span>
            )} */}
            <Row>
              <Col className="12">
                {savedInvoice && (
                  <Button
                    className="btn-primary "
                    onClick={(e) => {
                      handleSubmit(e, () => onDownload(savedInvoice));
                    }}
                    disabled={validate() ? true : isBusy}
                  >
                    {isBusy ? "Downloading..." : "Download"}
                  </Button>
                )}
                {savedInvoice && savedInvoice.status === "Sent" && (
                  <Button
                    className="btn-primary "
                    onClick={(e) => {
                      handleSubmit(e, () => onPayment(savedInvoice), false, {
                        confirmation: true,
                        confirmationMessage: `This invoice will be marked as paid`,
                      });
                    }}
                    disabled={validate() ? true : isBusy}
                  >
                    {isBusy ? "Processing..." : "Mark as paid"}
                  </Button>
                )}
                {(!savedInvoice ||
                  (savedInvoice && savedInvoice.status === "Draft")) && (
                  <Button
                    className="btn-primary "
                    onClick={() => toggleEditMode()}
                  >
                    {editMode ? "Preview" : "Edit"}
                  </Button>
                )}
                {savedInvoice && savedInvoice.status === "Draft" && (
                  <>
                    <Button
                      className="btn-primary "
                      onClick={(e) => {
                        handleSubmit(e, () => onSubmit(invoice));
                      }}
                      disabled={validate() ? true : isBusy}
                    >
                      {isBusy ? "Processing..." : "Update"}
                    </Button>
                  </>
                )}
                {!savedInvoice && (
                  <>
                    <Button
                      className="btn-primary "
                      onClick={(e) => {
                        handleSubmit(e, () => onSubmit(invoice));
                      }}
                      disabled={validate() ? true : isBusy}
                    >
                      {isBusy ? "Processing..." : "Save"}
                    </Button>
                  </>
                )}
                {(!savedInvoice ||
                  (savedInvoice && savedInvoice.status === "Draft")) && (
                  <>
                    <Button
                      name={savedInvoice ? "update" : "create"}
                      className="btn-primary "
                      disabled={validate() ? true : isBusy}
                      onClick={(e) => {
                        handleSubmit(
                          e,
                          () => onSaveAndSendInvoice(invoice),
                          false,
                          {
                            confirmation: true,
                            confirmationMessage: `This invoice will be sent to ${
                              customer.primaryEmail
                            } ${customer.secondaryEmail && `&`} ${
                              customer.secondaryEmail
                            }`,
                          }
                        );
                      }}
                    >
                      {isBusy ? "Processing..." : "Save and send"}
                    </Button>
                  </>
                )}
                {savedInvoice && savedInvoice.status === "Sent" && (
                  <>
                    <Button
                      className="btn-primary "
                      onClick={(e) => {
                        handleSubmit(e, () => onResendInvoice());
                      }}
                      disabled={validate() ? true : isBusy}
                    >
                      {isBusy ? "Processing..." : "Resend"}
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <footer className="footer footer-default px-0">
              {organisationInfo && (
                <Row>
                  <Col md="7" sm="12">
                    <p className="font-size-subtitle-2">
                      Thank you for your business with {organisationInfo.name}
                    </p>{" "}
                  </Col>
                  <Col md="5" sm="12" className="text-right">
                    <a
                      className="nav-link"
                      target="_blank"
                      href="https://imssystems.tech/"
                    >
                      <span className="text-primary">Powered by </span>
                      <img
                        alt=""
                        className="parent-brand-dark"
                        src={invoicefooter}
                      />
                      <img
                        alt=""
                        className="parent-brand-white"
                        src={invoicefooter}
                      />
                    </a>
                  </Col>
                </Row>
              )}
            </footer>
          </CardFooter>
        </Card>
        {/* <Modal title="Send invoice">
          <SaveAndSend
            invoice={invoice}
            customer={customer}
            resetInvoice={resetForm}
            addToTable={addToTable}
            refreshInvoice={refreshInvoice}
            savedInvoice={savedInvoice}
            dispatch={dispatch}
            processing={processing}
          />
        </Modal> */}
      </div>
    </>
  );
};

export default InvoiceForm;
