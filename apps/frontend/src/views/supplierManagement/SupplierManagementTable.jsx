import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import SupplierDrawerDetail from "./SupplierDrawerDetail";
import SupplierDrawerForm from "./SupplierDrawerForm";
import SupplierForm from "./SupplierForm";
import SupplierToolBar from "./SupplierToolBar";
import USER_ACTIONS from "./actions";
import { useSupplier } from "./store";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Pagination } from "@/components/Pagination/pagination";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
import SupplierFilter from "./SupplierFilter";
import CreateSupplier from "./CreateSupplier";

const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let {
    suppliers: dataTable,
    processing,
    visitingSupplier,
    createSupplier,
    visitSupplier,
    SupplierQueryTools,
    reloadSupplier,
  } = useSupplier();

  let { handleCreateTask } = useTask();
  let { openDrawer, closeDrawer } = useDrawer();
  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForSuppliers = [
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
      size: 200,
    },
    {
      accessorKey: "name",
      header: () => <p>Supplier Name</p>,
      size: 300,
    },

    {
      accessorKey: "accountManager",
      header: () => <p>Account Manager</p>,
      size: 320,
    },

    {
      accessorKey: "compliant",
      header: () => <p>compliant</p>,
      cell: ({ row }) => (row.original?.isCompliant ? "Yes" : "No"),
      size: 150,
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
        <SearchableDocument moduleTypes={["suppliers"]} />

        <h4 className="mb-3">All Suppliers</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={SupplierQueryTools} />
              </div>
              <div className="col-md-4">
                <SupplierFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateSupplier />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_SUPPLIERS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForSuppliers || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitSupplier(original);
                  openDrawer("supplier-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                SupplierQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                SupplierQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                SupplierQueryTools?.handlePagination({ page });
              }}
              size={SupplierQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          size="55"
          drawerId="supplier-detail"
          onDrawerClose={() => {
            visitSupplier(null);
          }}
          toolbar={<SupplierToolBar />}
        >
          {<SupplierDrawerDetail />}
        </DrawerRight>
        <DrawerRight size="55" drawerId="edit-supplier-form">
          {visitingSupplier && <SupplierDrawerForm />}
        </DrawerRight>
        <DrawerRight size="55" drawerId="add-task-form">
          {visitingSupplier && (
            <TaskForm
              drawerView={true}
              module={visitingSupplier._id}
              moduleType="suppliers"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadSupplier();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight size="55" drawerId="create-supplier">
          <SupplierForm
            drawerView={true}
            onSubmit={async (data) => {
              await createSupplier(data);
              closeDrawer("create-supplier");
              openDrawer("supplier-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
