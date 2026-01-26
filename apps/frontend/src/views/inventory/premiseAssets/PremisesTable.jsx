import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import PremiseAssetDrawerDetail from "./PremiseAssetDrawerDetail";
import PremiseAssetDrawerForm from "./PremiseAssetDrawerForm";
import PremiseAssetToolBar from "./PremiseAssetToolbar";
import USER_ACTIONS from "./actions";
import { usePremiseAssets } from "./store";
import PremiseAssetForm from "./PremiseAssetForm";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Pagination } from "@/components/Pagination/pagination";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
import PremiseFilter from "./PremiseFilter";
import CreatePremiseAsset from "./CreatePremiseAsset";
import { TourStep } from "../../../components/Tour";

const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let {
    premise,
    premisesAssets,
    visitPremise,
    processing,
    createPremiseAsset,
    PremiseQueryTools,
  } = usePremiseAssets();
  let { openDrawer, closeDrawer } = useDrawer();

  premisesAssets = premisesAssets ? premisesAssets : defaultdata;

  const columnsForPrimises = [
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
      size: 300,
    },
    {
      accessorKey: "name",
      header: () => <p>Building Name</p>,
      size: 350,
    },

    {
      accessorKey: "address",
      header: () => <p>Address</p>,
      size: 350,
    },

    {
      accessorKey: "location",
      header: () => <p>Postal Code</p>,
      size: 260,
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
        <h4 className="mb-3">Premises</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={PremiseQueryTools} />
              </div>
              <div className="col-md-4">
                <PremiseFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreatePremiseAsset />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_PREMISES].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <TourStep stepId="create-premise-table">
                <DataTable
                  data={premisesAssets}
                  columns={columnsForPrimises || []}
                  disableMultiSelection={true}
                  disableColumnResize={false}
                  defaultSize={375}
                  minSize={80}
                  onRowClick={({ original }) => {
                    visitPremise(original);
                    openDrawer("premise-asset-detail");
                  }}
                  columnVisibility={{}}
                />
              </TourStep>
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                PremiseQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                PremiseQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                PremiseQueryTools?.handlePagination({ page });
              }}
              size={PremiseQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          toolbar={<PremiseAssetToolBar />}
          drawerId="premise-asset-detail"
          onDrawerClose={() => {
            visitPremise(null);
          }}
        >
          <PremiseAssetDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-premise-asset-form">
          {premise && <PremiseAssetDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-premise-asset-form">
          <PremiseAssetForm
            drawerView={true}
            processing={processing}
            onSubmit={async (data) => {
              await createPremiseAsset(data);
              closeDrawer("create-premise-asset-form");
              openDrawer("premise-asset-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
