import Can from "@/components/Can/Can";
import ReactTable from "@/components/ReactTable/ReactTable";
import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import {
  Button,
  DrawerOpener,
  DrawerRight,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import SubscriptionForm from "./SubscriptionForm";
import { default as ACTIONS, default as USER_ACTIONS } from "./actions";
import { useOrganisation } from "./store";

const defaultdata = [
  {
    _id: "",
    name: "",
    email: "",
    interval: "",
    day: "",
  },
];
const SubscriptionTable = () => {
  let {
    processing,
    subscribers: dataTable,
    fetchSubscribers,
    SubscriberQuery,
    deleteSubscription,
    addSubscriber,
    ...rest
  } = useOrganisation();
  let { closeDrawer } = useDrawer();
  let notify = React.useContext(NotificationContext);
  let { alert, warningWithConfirmMessage } = useAlerts();
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
                          deleteSubscription(data);
                        }
                      );
                    }}
                    id="delete"
                  >
                    {processing[USER_ACTIONS.DELETE_SUBSCRIBER].status ===
                      "delete" &&
                    processing[USER_ACTIONS.DELETE_SUBSCRIBER].id ===
                      data._id ? (
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
      <div>
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
            // {
            //   Header: "Schedule Date",
            //   accessor: "scheduleDate",
            // },
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
          {...SubscriberQuery}
          {...rest}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          onPageChange={fetchSubscribers}
          pagination={SubscriberQuery.toolState.pagination}
        />
      </div>
    </>
  );
};

export default SubscriptionTable;
