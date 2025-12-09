import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import CRMDrawerDetail from "./CRMDrawerDetail";
import CreateCustomer from "./CreateCustomer";
import CustomerDrawerForm from "./CustomerDrawerForm";
import CustomerForm from "./CustomerForm";
import CustomerToolBar from "./CustomerToolBar";
import USER_ACTIONS from "./actions";
import { useCRM } from "./store";
import CRMFilter from "./CRMFilter";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";
import { Pagination } from "@/components/Pagination/pagination";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
const defaultdata = [["No data found"]];

const CRMTable = ({ ...props }) => {
  let {
    customers: dataTable,
    processing,
    visitingCustomer,
    visitCustomer,
    createCustomer,
    CustomerQueryTools,
  } = useCRM();
  let { handleCreateTask } = useTask();
  let { openDrawer, closeDrawer } = useDrawer();

  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForCustomers = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
      size: 120,
    },
    {
      accessorKey: "group",
      header: () => <p>Business Unit</p>,
      cell: ({ row }) =>
        row.original?.group?.name ? row.original?.group?.name : "N/A",
      size: 150,
    },
    {
      accessorKey: "name",
      header: () => <p>Organisation</p>,
      size: 160,
    },

    {
      accessorKey: "statge",
      header: () => <p>Organisation Profile</p>,
      cell: ({ row }) => <BadgeStatus status={row?.original?.stage} />,
      size: 180,
    },

    {
      accessorKey: "accountManager.name",
      header: () => <p>Account Manager</p>,
      size: 160,
    },

    {
      accessorKey: "lastUpdated",
      header: () => <p>Last Updated</p>,
      cell: ({ row }) => (
        <TimeDateComponent date={row?.original?.updated?.on} />
      ),
      size: 170,
    },

    {
      accessorKey: "UpdatedBy",
      header: () => <p>Updated By</p>,
      cell: ({ row }) =>
        row?.original?.updated?.by?.name
          ? row?.original?.updated?.by?.name
          : "N/A",
      size: 170,
    },

    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 100,
    },
  ];

  return (
    <ContentWrapper>
      <Box>
        <h4 className="mb-3">Customers</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={CustomerQueryTools} />
              </div>
              <div className="col-md-4">
                <CRMFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateCustomer />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_CUSTOMERS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForCustomers || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitCustomer(original);
                  openDrawer("customer-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                CustomerQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                CustomerQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                CustomerQueryTools?.handlePagination({ page });
              }}
              size={CustomerQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          size="55"
          drawerId="customer-detail"
          onDrawerClose={() => {
            visitCustomer(null);
          }}
          toolbar={<CustomerToolBar />}
        >
          {<CRMDrawerDetail />}
        </DrawerRight>
        <DrawerRight size="55" drawerId="edit-customer-form">
          {visitingCustomer && <CustomerDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingCustomer && (
            <TaskForm
              drawerView={true}
              module={visitingCustomer._id}
              moduleType="customers"
              onSubmit={async (data) => {
                await handleCreateTask(data);
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-customer">
          <CustomerForm
            drawerView={true}
            onSubmit={async (data) => {
              await createCustomer(data);
              closeDrawer("create-customer");
              openDrawer("customer-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default CRMTable;
