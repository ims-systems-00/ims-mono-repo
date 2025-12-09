import Loading from "@/components/Loader/Loading";
import ReactTable from "@/components/ReactTable/ReactTable";
import useAccess from "@/hooks/useAccess";
import {
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import CreateExpenseReport from "./CreateExpenseReport";
import ExpenseReportDrawerDetail from "./ExpenseReportDrawerDetail";
import ExpenseReportDrawerForm from "./ExpenseReportDrawerForm";
import ExpenseReportToolbar from "./ExpenseReportToolBar";
import USER_ACTIONS from "./actions";
import { useExpenseReport } from "./store";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import ExpenseReportForm from "./ExpenseReportForm";
import { useTask } from "@/views/taskManagement/store";
import TaskForm from "@/views/taskManagement/TaskForm";
const defaultdata = [["No data found"]];
const ExpenseReportTable = ({}) => {
  let {
    expenseReports: dataTable,
    alert,
    processing,
    updateDataTable,
    handleDelete,
    toolState,
    warningWithConfirmMessage,
    visitExpenseReport,
    visitingExpenseReport,
    createExpenseReport,
    fetchReports,
    queryHandlers,
    reloadExpenseReport,
    ...rest
  } = useExpenseReport();
  let { handleCreateTask } = useTask();
  let history = useHistory();
  let { authUser, authAdminAccess, entityAccessControl } = useAccess();
  dataTable = dataTable ? dataTable : defaultdata;
  let { openDrawer, closeDrawer } = useDrawer();
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          reference: data.reference,
          title: data.title,
          createdOn: <TimeDateComponent date={data.created.on} />,
          status: data.submission.status,
          submittedOn:
            data.submission?.status === "Draft" ? null : (
              <TimeDateComponent date={data.submission.submissionDate} />
            ),
          // activateView: activateView,
          data: data,
          actions: (
            <>
              <UncontrolledDropdown size="sm" direction="right">
                <DropdownToggle
                  outline
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  data-display="static"
                  className="border border rounded-circle"
                >
                  <i className="fa-solid fa-ellipsis-h" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={(e) => {
                      e.stopPropagation();
                      visitExpenseReport(data);
                      history.push(`/admin/expense-report/${data._id}`);
                      // openDrawer("expense-report-detail");
                    }}
                    id="detail"
                    tooltip="View Details"
                  >
                    Details
                  </DropdownItem>
                  {authUser({
                    service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) &&
                    data.submission.status === "Draft" &&
                    (authAdminAccess() ||
                      entityAccessControl({
                        users: data.created.by ? [data.created.by._id] : [],
                        effect: "Allow",
                      })) && (
                      <DropdownItem
                        id="delete"
                        tooltip="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          warningWithConfirmMessage(
                            "This expense report will be deleted",
                            () => {
                              handleDelete(data);
                            }
                          );
                        }}
                        name="delete"
                      >
                        {processing.action === "delete" &&
                        processing.id === data._id ? (
                          <Spinner size="sm" />
                        ) : (
                          "Delete"
                        )}
                      </DropdownItem>
                    )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ),
        };
      }),
    [processing]
  );
  return (
    <>
      {alert}
      <div className="content">
        {processing[USER_ACTIONS.LOAD_EXPENSEREPORTS].status && <Loading />}
        <ReactTable
          data={data}
          {...rest}
          resizable={false}
          columns={[
            {
              Header: "Reference",
              accessor: "reference",
            },
            {
              Header: "Title",
              accessor: "title",
            },
            {
              Header: "Created on",
              accessor: "createdOn",
            },
            {
              Header: "Submitted on",
              accessor: "submittedOn",
            },
            {
              Header: "Status",
              accessor: "status",
              Cell: (item) => <BadgeStatus status={item.value} />,
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false,
            },
          ]}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          // isFilterable
          isSearchable
          tableToolbar={<CreateExpenseReport />}
          title={"Expense reports"}
          rowProps={function (row) {
            return {
              onClick: function (e) {
                visitExpenseReport(row.original.data);
                openDrawer("expense-report-detail");
              },
            };
          }}
          pagination={toolState.pagination}
          onPageChange={fetchReports}
          {...queryHandlers}
        />
        <DrawerRight
          size="45"
          drawerId="expense-report-detail"
          onDrawerClose={() => {
            visitExpenseReport(null);
          }}
          toolbar={<ExpenseReportToolbar />}
        >
          {<ExpenseReportDrawerDetail />}
        </DrawerRight>
        <DrawerRight size="45" drawerId="edit-expense-report-form">
          {visitingExpenseReport && <ExpenseReportDrawerForm />}
        </DrawerRight>
        <DrawerRight size="45" drawerId="add-task-form">
          {visitingExpenseReport && (
            <TaskForm
              drawerView={true}
              module={visitingExpenseReport._id}
              moduleType="expensereports"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadExpenseReport();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-expense-report">
          <ExpenseReportForm
            drawerView={true}
            onSubmit={async (data) => {
              await createExpenseReport(data);
            }}
          />
        </DrawerRight>
      </div>
    </>
  );
};

export default ExpenseReportTable;
