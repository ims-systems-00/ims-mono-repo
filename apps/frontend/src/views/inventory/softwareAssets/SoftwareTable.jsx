import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import CreateSoftwareAsset from "./CreateSoftwareAsset";
import SoftwareAssetDrawerDetail from "./SoftwareAssetDrawerDetail";
import SoftwareAssetDrawerForm from "./SoftwareAssetDrawerForm";
import SoftwareAssetToolbar from "./SoftwareAssetToolbar";
import USER_ACTIONS from "./actions";
import { useSoftwareAssets } from "./store";
import SoftwareAssetForm from "./SoftwareAssetForm";
import SoftwareFilter from "./SoftwareFilter";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let {
    software,
    softwareAssets,
    visitSoftware,
    createSoftwareAsset,
    processing,
    SoftwareQueryTools,
  } = useSoftwareAssets();

  let { closeDrawer, openDrawer } = useDrawer();

  softwareAssets = softwareAssets ? softwareAssets : defaultdata;

  const columnsForSoftware = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
      size: 220,
    },
    {
      accessorKey: "group",
      header: () => <p>Business Unit</p>,
      cell: ({ row }) =>
        row.original?.group?.name ? row.original?.group?.name : "N/A",
      size: 350,
    },
    {
      accessorKey: "name",
      header: () => <p>Software Name</p>,
      size: 380,
    },

    {
      accessorKey: "numberOfLicenses",
      header: () => <p>Licence</p>,
      size: 250,
    },

    {
      accessorKey: "numberOfInstalls",
      header: () => <p>Installs</p>,
      size: 280,
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
        <h4 className="mb-3">Software assests</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={SoftwareQueryTools} />
              </div>
              <div className="col-md-4">
                <SoftwareFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateSoftwareAsset />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_SOFTWARES].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={softwareAssets}
                columns={columnsForSoftware || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitSoftware(original);
                  openDrawer("software-asset-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                SoftwareQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                SoftwareQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                SoftwareQueryTools?.handlePagination({ page });
              }}
              size={SoftwareQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="software-asset-detail"
          toolbar={
            <React.Fragment>
              <SoftwareAssetToolbar />
            </React.Fragment>
          }
          onDrawerClose={() => {
            visitSoftware(null);
          }}
        >
          <SoftwareAssetDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-software-asset-form">
          {software && <SoftwareAssetDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-software-asset-form">
          <SoftwareAssetForm
            drawerView={true}
            processing={processing}
            onSubmit={async (data) => {
              await createSoftwareAsset(data);
              closeDrawer("create-software-asset-form");
              openDrawer("software-asset-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
