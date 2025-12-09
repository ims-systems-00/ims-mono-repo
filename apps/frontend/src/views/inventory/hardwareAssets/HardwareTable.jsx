import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import CreateHardwareAsset from "./CreateHardwareAsset";
import HardwareAssetDrawerForm from "./HardwareAssetDrawerForm";
import HardwareAssetToolbar from "./HardwareAssetToolbar";
import HardwareAssetDrawerDetail from "./HardwareAssetsDrawerDetail";
import USER_ACTIONS from "./actions";
import { useHardwareAssets } from "./store";
import HardwareAssetForm from "./HardwareAssetForm";
import HardwareFilter from "./HardwareFilter";
import Box from "@/components/Box/Index";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
const defaultdata = [["No data found"]];

const ReactTables = ({}) => {
  let {
    hardwareAssets,
    processing,
    HardwareQueryTools,
    visitHardware,
    createHardwareAsset,
    hardware,
  } = useHardwareAssets();

  let { closeDrawer, openDrawer } = useDrawer();

  hardwareAssets = hardwareAssets ? hardwareAssets : defaultdata;

  const columnsForHardware = [
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
      size: 250,
    },
    {
      accessorKey: "name",
      header: () => <p>Asset Name</p>,
      size: 250,
    },

    {
      accessorKey: "tag",
      header: () => <p>Asset Tag</p>,
      size: 250,
    },

    {
      accessorKey: "owner",
      header: () => <p>Asset Owner</p>,
      cell: ({ row }) => <span>{row?.original?.owner?.name}</span>,
      size: 320,
    },

    {
      accessorKey: "assignDate",
      header: () => <p>Assigned Date</p>,
      cell: ({ row }) =>
        row?.original.assignedDate ? (
          <TimeDateComponent date={row?.original.assignedDate} />
        ) : (
          "N/A"
        ),
      size: 200,
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
        <h4 className="mb-3">Hardware assets</h4>

        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={HardwareQueryTools} />
              </div>
              <div className="col-md-4">
                <HardwareFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateHardwareAsset />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_HARDWARES].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={hardwareAssets}
                columns={columnsForHardware || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitHardware(original);
                  openDrawer("hardware-asset-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                HardwareQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                HardwareQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                HardwareQueryTools?.handlePagination({ page });
              }}
              size={HardwareQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          onDrawerClose={() => {
            visitHardware(null);
          }}
          toolbar={<HardwareAssetToolbar />}
          drawerId="hardware-asset-detail"
        >
          <HardwareAssetDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-hardware-asset-form">
          {hardware && <HardwareAssetDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-hardware-asset">
          <HardwareAssetForm
            processing={processing}
            drawerView={true}
            onSubmit={async (data) => {
              await createHardwareAsset(data);
              closeDrawer("create-hardware-asset");
              openDrawer("hardware-asset-detail");
            }}
          />
        </DrawerRight>
      </Box>{" "}
    </ContentWrapper>
  );
};

export default ReactTables;
