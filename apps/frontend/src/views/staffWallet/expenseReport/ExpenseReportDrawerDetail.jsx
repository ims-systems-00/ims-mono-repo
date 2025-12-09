import Loading from "@/components/Loader/Loading";
import {
  Col,
  PanelTab,
  PanelTabs,
  PanelWindow,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import Timeline from "@/views/shared/Timeline/Timeline";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import ExpenseOverview from "./ExpenseOverview";
import AccommodationAttachmentsButtons from "./accommodation/AccommodationAttachmentsButtons";
import USER_ACTIONS from "./actions";
import ExpenseAttachmentButtons from "./expense/ExpenseAttachmentButtons";
import { useExpenseReport } from "./store";
import TravelAttachmentButtons from "./travels/TravelAttachmentButtons";

const ExpenseReportDrawerDetail = () => {
  let {
    processing,
    visitingExpenseReport: expenseReport,
    getSubmissionStatus,
  } = useExpenseReport();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_EXPENSE_REPORT_DRAWER]?.status ? (
        <Loading />
      ) : (
        expenseReport && (
          <React.Fragment>
            <DetailsDrawerHeader data={expenseReport} />
            <React.Fragment>
              <PanelTabs variant="outline" activeTab={0}>
                <PanelTab>
                  <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  Overview
                </PanelTab>
                <PanelTab>
                  <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                  Details
                </PanelTab>
                <PanelTab>
                  <i
                    className="ims-icons-20 icon-icon-activity-24 me-1
                        "
                  ></i>
                  Activity
                </PanelTab>
                <PanelTab>
                  <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                  Tasks
                </PanelTab>
                <PanelWindow tabId={0}>
                  <ExpenseOverview />
                </PanelWindow>
                <PanelWindow tabId={1}>
                  <>
                    <Row>
                      <Col md="12">
                        <DetailsWrapper
                          label={"Description:"}
                          iconClass={"tim-icons icon-pencil"}
                          value={expenseReport?.description}
                          labelClass={"pr-2"}
                        />
                      </Col>
                    </Row>
                    <p className="text-primary font-weight-bold text-center">
                      Expenses
                    </p>
                    <Row>
                      {expenseReport.expenses.length > 0 ? (
                        <Col md="6 mt-2">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th>Type</th>
                                <th>Cost</th>
                                <th className="text-right">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenseReport.expenses.map((expense) => (
                                <tr key={expense._id}>
                                  <td className="">{expense.type}</td>
                                  <td className="">{expense.cost}</td>
                                  <td className="text-right">
                                    {expense.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      ) : null}
                    </Row>
                    <DetailsSectionHeader title="Attachments and evidences:" />
                    <Row>
                      <Col md="12">
                        {expenseReport.expenses.map((expense) => (
                          <Attachments s3Information={expense.attachments}>
                            <ExpenseAttachmentButtons expense={expense} />
                          </Attachments>
                        ))}
                      </Col>
                    </Row>
                    <p className="text-primary font-weight-bold text-center">
                      Commute
                    </p>
                    <Row>
                      {expenseReport.travels.length > 0 ? (
                        <Col md="12">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th>Type</th>
                                <th>Transport</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Cost</th>
                                <th className="text-right">Distance (Miles)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenseReport.travels.map((travel) => (
                                <tr key={travel._id}>
                                  <td className="">{travel.type}</td>
                                  <td className="">{travel.transport}</td>
                                  <td className="">{travel.from}</td>
                                  <td className="">{travel.to}</td>
                                  <td className="">
                                    {parseFloat(travel.cost).toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {(travel.distance * 0.62).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      ) : null}
                    </Row>
                    <DetailsSectionHeader title="Attachments and evidences:" />
                    <Row>
                      <Col md="12">
                        {expenseReport.travels.map((travel) => (
                          <Attachments s3Information={travel.attachments}>
                            <TravelAttachmentButtons travel={travel} />
                          </Attachments>
                        ))}
                      </Col>
                    </Row>
                    <p className="text-primary font-weight-bold text-center">
                      Accommodations
                    </p>
                    <Row>
                      {expenseReport.accommodations.length > 0 ? (
                        <Col md="12">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th>Type</th>
                                <th>Check in</th>
                                <th>Check out</th>
                                <th>Location</th>
                                <th>Cost</th>
                                <th className="text-right">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenseReport.accommodations.map(
                                (accommodation) => (
                                  <tr key={accommodation._id}>
                                    <td className="">{accommodation.type}</td>
                                    <td className="">
                                      {moment(accommodation.checkin).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td className="">
                                      {moment(accommodation.checkout).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td className="">
                                      {accommodation.location}
                                    </td>
                                    <td className="">{accommodation.cost}</td>
                                    <td className="text-right">
                                      {accommodation.notes}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </Col>
                      ) : null}
                    </Row>
                    <DetailsSectionHeader title="Attachments and evidences:" />
                    <Row>
                      <Col md="12">
                        {expenseReport.accommodations.map((accommodation) => (
                          <Attachments
                            s3Information={accommodation.attachments}
                          >
                            <AccommodationAttachmentsButtons
                              accommodation={accommodation}
                            />
                          </Attachments>
                        ))}
                      </Col>
                    </Row>
                  </>
                </PanelWindow>
                <PanelWindow tabId={2}>
                  <DetailsSectionHeader title="Comments" />
                  <Row>
                    <Col md="12" className="mb-4">
                      {getSubmissionStatus() === "Rejected" ||
                      getSubmissionStatus() === "Approved" ? (
                        <Timeline
                          readOnly={true}
                          horizontalSpacing={true}
                          containerClass="mx-auto sm-10"
                          moduleType="expensereports"
                          moduleId={expenseReport._id}
                        />
                      ) : (
                        <Timeline
                          editLabel="comment"
                          editPlaceholder="Comment"
                          horizontalSpacing={true}
                          containerClass="mx-auto sm-10"
                          moduleType="expensereports"
                          moduleId={expenseReport._id}
                        />
                      )}
                    </Col>
                  </Row>
                </PanelWindow>
                <PanelWindow tabId={3}>
                  <TaskManagement
                    moduleType="expensereports"
                    module={expenseReport._id}
                  />
                </PanelWindow>
              </PanelTabs>
            </React.Fragment>
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default ExpenseReportDrawerDetail;
