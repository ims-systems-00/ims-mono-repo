import Loading from "@/components/Loader/Loading";
import ReactTable from "@/components/ReactTable/ReactTable";
import useAccess from "@/hooks/useAccess";
import useAlert from "@/hooks/useAlerts";
import {
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
import { useHistory } from "react-router-dom";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import CreateInvoice from "./CreateInvoice";
import InvoiceDrawerDetail from "./InvoiceDrawerDetail";
import InvoiceForm from "./InvoiceForm";
import USER_ACTIONS from "./actions";
import filters from "./filters";
import { useInvoice } from "./store";
const defaultdata = [["No data found"]];

const InvoiceTable = ({ ...props }) => {
  let {
    customer,
    invoices: dataTable,
    processing,
    toolState,
    visitingInvoice,
    visitInvoice,
    deleteInvoice,
    createInvoice,
    saveAndSendInvoice,
    organisationInfo,
    ...rest
  } = useInvoice();
  let history = useHistory();
  let { authUser, authGlobalAccess, authAdminAccess, entityAccessControl } =
    useAccess();
  let { openDrawer, closeDrawer } = useDrawer();
  let { alert, warningWithConfirmMessage, successAlert } = useAlert();
  dataTable = dataTable ? dataTable : defaultdata;
  const data = React.useMemo(
    () =>
      dataTable.map((data, key) => {
        return {
          id: data._id,
          reference: data.reference,
          due: moment(data.due).format("DD/MM/YYYY"),
          data: data,
          status: data.status,
          total: "£ " + parseFloat(data?.calculations?.total).toFixed(2),
          created_on: moment(data?.created?.on).format("DD/MM/YYYY"),
          created_by: data?.created?.by?.name,
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
                      history.push(`/admin/invoices/${data?._id}`);
                    }}
                    id="detail"
                    tooltip="View Details"
                  >
                    View Details
                  </DropdownItem>
                  {authUser({
                    service: IMS_SERVICES.CRM,
                    action: ACTIONS.DELETE,
                    effect: EFFECTS.ALLOW,
                  }) &&
                    data.status === "Draft" &&
                    (authAdminAccess() ||
                      entityAccessControl({
                        users: data.created.by ? [data.created.by._id] : [],
                        effect: "Allow",
                      })) && (
                      <DropdownItem
                        onClick={(e) => {
                          warningWithConfirmMessage(
                            "This invoice will be deleted",
                            () => {
                              deleteInvoice(data);
                            }
                          );
                          e.stopPropagation();
                        }}
                        name="delete"
                        id="delete"
                        tooltip="Delete"
                      >
                        {processing[USER_ACTIONS.REMOVE_INVOICE].status &&
                        processing[USER_ACTIONS.REMOVE_INVOICE].id ===
                          data._id ? (
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
  // let columns = React.useMemo(() => toolState.filter.tableState || tables.default, [toolState])
  return (
    <>
      {alert}
      <div className="content">
        {processing[USER_ACTIONS.LOAD_INVOICES].status && <Loading />}
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
              Header: "Created date",
              accessor: "created_on",
            },
            {
              Header: "Created by",
              accessor: "created_by",
            },
            {
              Header: "Due date",
              accessor: "due",
            },
            {
              Header: "Total",
              accessor: "total",
            },
            {
              Header: "Status",
              accessor: "status",
              Cell: (item) =>
                item.value === "Draft" ? (
                  <span className="text-danger">{item.value}</span>
                ) : item.value === "Sent" ? (
                  <span className="text-warning">{item.value}</span>
                ) : (
                  <span className="text-success">{item.value}</span>
                ),
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false,
            },
          ]}
          rowProps={function (row) {
            return {
              onClick: function (e) {
                visitInvoice(row.original?.data);
                openDrawer("invoice");
              },
            };
          }}
          // renderRowSubComponent={renderRowSubComponent}
          title="Invoices"
          tableToolbar={<CreateInvoice />}
          filters={filters}
          defaultPageSize={10}
          showPaginationTop
          showPaginationBottom={false}
          className="-striped -highlight"
          isFilterable
          isSearchable
        />
        <DrawerRight
          size="50"
          drawerId="invoice"
          onDrawerClose={() => {
            visitInvoice(null);
          }}
        >
          <InvoiceDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="create-invoice" size="50">
          <InvoiceForm
            drawerView={true}
            customer={customer}
            visitingInvoice={visitingInvoice}
            organisationInfo={organisationInfo}
            onSubmit={async (data) => {
              await createInvoice(data);
              closeDrawer("create-invoice");
            }}
            onSaveAndSendInvoice={async (data) => {
              await saveAndSendInvoice(data);
              closeDrawer("create-invoice");
            }}
          />
        </DrawerRight>
      </div>
    </>
  );
};

export default InvoiceTable;
