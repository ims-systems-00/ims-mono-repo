import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToExpenseReportModel } from "@/services/wallet/expenseReportServices";
import currencies from "@/utils/currency";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsFormSectionDevider,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import Accommodation from "./accommodation/Accommodation";
import AccommodationForm from "./accommodation/AccommodationForm";
import USER_ACTIONS from "./actions";
import Expense from "./expense/Expense";
import ExpenseForm from "./expense/ExpenseForm";
import { useExpenseReport } from "./store";
import Travel from "./travels/Travel";
import TravelForm from "./travels/TravelForm";

const ExpenseReportForm = ({
  onApprove = () => {},
  onReject = () => {},
  onSubmit = () => {},
  onSubmitReport = () => {},
  drawerView = false,
  expenseReport,
}) => {
  let { lazyLoadUsers } = useUsers();
  let { processing, isManagementByMe, entityAccessControl } =
    useExpenseReport();
  const dataSet = expenseReport
    ? mapToExpenseReportModel(expenseReport)
    : {
        data: {
          title: "",
          description: "",
          currency: {
            value: currencies[0].symbol_native,
            label: `${currencies[0].name} (${currencies[0].symbol_native})`,
          },
        },
        errors: {},
      };
  const schema = {
    title: IVal.string().required().label("Title"),
    description: IVal.string().required().label("Description"),
    currency: IVal.object().keys({
      value: IVal.string().required().label("Currency"),
      label: IVal.label("Currency"),
    }),
  };
  const { confirmation, dataModel, handleChange, handleSubmit, validate } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  return (
    <>
      {confirmation}
      <Form action="/" className="form-horizontal" method="get">
        <Row>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputText
              label="Title"
              placeholder="Title"
              name="title"
              mandatory={true}
              value={data.title}
              onChange={handleChange}
              error={errors.title}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"} xs="12">
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
        </Row>
        <ImsTextEditor
          label="Description"
          name="description"
          placeholder={"Add a description."}
          mediaLinkGeneratorFn={linkGenerator}
          onEachFileSelection={handleUpload}
          value={expenseReport?.description}
          onChange={handleChange}
        />
        {expenseReport && (
          <>
            <>
              <ImsFormSectionDevider
                label={"Commute"}
                deviderText={
                  "Add your travel expenses. You can add multiple travel routes in this report."
                }
              />
              <TravelForm />
              {expenseReport?.travels?.map((travel) => (
                <Travel key={travel._id} travel={travel} />
              ))}
            </>
            <>
              <ImsFormSectionDevider
                label={"Accommodation"}
                deviderText={
                  "Add your accommodation expenses. You can add multiple accommodations in this report."
                }
              />
              <AccommodationForm drawerView />
              {expenseReport.accommodations.map((accommodation) => (
                <Accommodation
                  key={accommodation._id}
                  accommodation={accommodation}
                />
              ))}
            </>
            <>
              <ImsFormSectionDevider
                label={"Other expenses"}
                deviderText={
                  "Add if you have any custom expenses. You can add multiple expenses in this report."
                }
              />
              <ExpenseForm />
              {expenseReport.expenses.map((expense) => (
                <Expense key={expense._id} expense={expense} />
              ))}
            </>
          </>
        )}
        <ImsButtonGroup>
          {expenseReport ? (
            <>
              <Button
                name="update"
                onClick={(e) => {
                  handleSubmit(e, () => onSubmit(dataModel.data), false, {
                    confirmation: false,
                    confirmationMessage:
                      "This expense report be sent to your line manager",
                  });
                }}
                disabled={
                  validate()
                    ? true
                    : processing[USER_ACTIONS.AMEND_EXPENSEREPORT].status
                }
                className="btn-fill"
                color="info"
                type="button"
              >
                {processing[USER_ACTIONS.AMEND_EXPENSEREPORT].status
                  ? "Processing"
                  : "Update"}
              </Button>
              {expenseReport.submission.status === "Draft" &&
                entityAccessControl({
                  users: expenseReport.created.by
                    ? [expenseReport.created.by._id]
                    : [],
                  effect: "Allow",
                }) && (
                  <Button
                    name="submit"
                    onClick={(e) => {
                      handleSubmit(e, () => onSubmitReport(), false, {
                        confirmation: true,
                        confirmationMessage:
                          "This expense report will be sent to your line manager",
                      });
                    }}
                    disabled={
                      validate()
                        ? true
                        : processing[USER_ACTIONS.SUBMIT_REPORT].status
                    }
                    className="btn-fill"
                    color="primary"
                    type="button"
                  >
                    {processing[USER_ACTIONS.SUBMIT_REPORT].status
                      ? "Processing"
                      : "Submit"}
                  </Button>
                )}
              {expenseReport.submission.status === "Pending" &&
                isManagementByMe(expenseReport) && (
                  <>
                    <Button
                      name="approve"
                      onClick={(e) => {
                        handleSubmit(e, () => onApprove(), false, {
                          confirmation: true,
                          confirmationMessage: `${expenseReport?.reference} "${expenseReport?.title}" received from ${expenseReport?.created?.by?.name} will be approved`,
                        });
                      }}
                      disabled={
                        validate()
                          ? true
                          : processing[USER_ACTIONS.HANDLE_REPORT_SUBMISSION]
                              .status
                      }
                      className="btn-fill"
                      color="primary"
                      type="button"
                    >
                      {processing[USER_ACTIONS.HANDLE_REPORT_SUBMISSION].status
                        ? "Processing"
                        : "Approve"}
                    </Button>
                    <Button
                      name="reject"
                      onClick={(e) => {
                        handleSubmit(e, () => onReject(), false, {
                          confirmation: true,
                          confirmationMessage: `${expenseReport?.reference} "${expenseReport?.title}" received from ${expenseReport?.created?.by?.name} will be rejected`,
                        });
                      }}
                      disabled={
                        validate()
                          ? true
                          : processing[USER_ACTIONS.HANDLE_REPORT_SUBMISSION]
                              .status
                      }
                      className="btn-fill"
                      color="primary"
                      type="button"
                    >
                      {processing[USER_ACTIONS.HANDLE_REPORT_SUBMISSION].status
                        ? "Processing"
                        : "Reject"}
                    </Button>
                  </>
                )}
            </>
          ) : (
            <Button
              type="button"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), true, {
                  confirmation: false,
                  confirmationMessage:
                    "This expense report be sent to your line manager",
                });
              }}
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.CREATE_EXPENSEREPORT].status
              }
              className="btn-fill"
              color="primary"
            >
              {processing[USER_ACTIONS.CREATE_EXPENSEREPORT].status
                ? "Processing"
                : "Claim"}
            </Button>
          )}
        </ImsButtonGroup>
      </Form>
    </>
  );
};

export default ExpenseReportForm;
