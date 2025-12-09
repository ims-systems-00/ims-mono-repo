import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import {
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { deleteReportSubscriber } from "@/services/organizationService";
import ACTIONS from "./actions";

const defaultdata = [
  {
    _id: "",
    name: "",
    email: "",
    interval: "",
    day: "",
  },
];
const SubscriptionTable = ({
  dataTable,
  pathname,
  setSubscribers,
  processing,
  dispatch,
  ...rest
}) => {
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage, successAlert, infoAlert } =
    useAlerts();
  let handleDelete = async (data) => {
    dispatch({
      [ACTIONS.DELETE_SUBSCRIBER]: { status: true, error: false, id: data._id },
    });
    try {
      await deleteReportSubscriber(data._id);
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber._id !== data._id)
      );
      successAlert("Report interval deleted successfully");
    } catch (ex) {
      imsLogger("SubscriptionTable", ex);
      notify("Could not delete", "danger");
    }
    dispatch({
      [ACTIONS.DELETE_SUBSCRIBER]: { status: false, error: false, id: null },
    });
  };
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data) => {
        return {
          id: data._id,
          name: data.name,
          email: data.email,
          interval: data.interval,
          day: new Date(data.nextDate).getDate(),
          issueDate: moment(data.issueDate).format("DD/MM/YYYY"),
          scheduleDate: moment(data.nextDate).format("DD/MM/YYYY"),
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
                    tooltip="Delete"
                    onClick={(e) => {
                      warningWithConfirmMessage(
                        "This report interval will be deleted",
                        () => {
                          handleDelete(data);
                        }
                      );
                    }}
                    id="delete"
                  >
                    {processing[ACTIONS.DELETE_SUBSCRIBER].status ===
                      "delete" &&
                    processing[ACTIONS.DELETE_SUBSCRIBER].id === data._id ? (
                      <Spinner size="sm" />
                    ) : (
                      "Delete"
                    )}
                  </DropdownItem>
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
        <Row className="mt-5">
          <Col xs={12} md={12}>
            <CardHeader>
              <CardTitle tag="h4"></CardTitle>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={data}
                {...rest}
                resizable={false}
                columns={[
                  {
                    Header: "Person name",
                    accessor: "name",
                  },
                  {
                    Header: "Email",
                    accessor: "email",
                  },
                  {
                    Header: "interval",
                    accessor: "interval",
                  },
                  {
                    Header: "Issue Date",
                    accessor: "issueDate",
                  },
                  {
                    Header: "Schedule Date",
                    accessor: "scheduleDate",
                  },
                  {
                    Header: "day",
                    accessor: "day",
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
                isFilterable
                isSearchable
              />
            </CardBody>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SubscriptionTable;
