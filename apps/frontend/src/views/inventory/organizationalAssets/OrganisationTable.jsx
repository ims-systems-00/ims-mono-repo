import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import OrganizationAssetDrawerDetail from "./OrganizationAssetDrawerDetail";
import OrganizationAssetDrawerForm from "./OrganizationAssetDrawerForm";
import OrganizationAssetToolBar from "./OrganizationAssetToolbar";
import USER_ACTIONS from "./actions";
import { useOrganizationAssets } from "./store";
import OrganizationAssetForm from "./OrganisationAssetForm";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import CreateOrganizationAsset from "./CreateOrganizationAsset";
import SearchInput from "../../../components/SearchInput/search-input";
import { TourStep } from "../../../components/Tour";
import OrganisationFilter from "./OrganisationFilter";

const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let { toggle, openDrawer, closeDrawer } = useDrawer();
  let {
    organizationsAssets,
    processing,
    visitOrganization,
    OrganizationQueryTools,
    organization,
    createOrganization,
  } = useOrganizationAssets();

  organizationsAssets = organizationsAssets ? organizationsAssets : defaultdata;

  const columnsForInformation = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
    },
    {
      accessorKey: "group",
      header: () => <p>Business Unit</p>,
      cell: ({ row }) =>
        row.original?.group?.name ? row.original?.group?.name : "N/A",
    },
    {
      accessorKey: "informationInventory",
      header: () => <p>Info Inventory</p>,
    },

    {
      accessorKey: "title",
      header: () => <p>Title</p>,
    },

    {
      accessorKey: "storageLocation",
      header: () => <p>Storage Location</p>,
    },

    {
      accessorKey: "owner.name",
      header: () => <p>Owner</p>,
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
        <h4 className="mb-3">Information</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={OrganizationQueryTools} />
              </div>
              <div className="col-md-4">
                <OrganisationFilter />
              </div>
            </div>
          </div>
          <div className="col-md-6 text-end">
            <CreateOrganizationAsset />
          </div>
        </div>
        {processing[USER_ACTIONS.LOAD_ORGANIZATIONS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <TourStep stepId="create-information-table">
                <DataTable
                  data={organizationsAssets}
                  columns={columnsForInformation || []}
                  disableMultiSelection={true}
                  disableColumnResize={false}
                  defaultSize={375}
                  minSize={80}
                  onRowClick={({ original }) => {
                    visitOrganization(original);
                    toggle("organization-asset-detail");
                  }}
                  columnVisibility={{}}
                />
              </TourStep>
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                OrganizationQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                OrganizationQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                OrganizationQueryTools?.handlePagination({ page });
              }}
              size={OrganizationQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="organization-asset-detail"
          onDrawerClose={() => {
            visitOrganization(null);
          }}
          toolbar={
            <React.Fragment>
              <OrganizationAssetToolBar />
            </React.Fragment>
          }
        >
          <OrganizationAssetDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-organization-asset-form">
          {organization && <OrganizationAssetDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-organization-asset-form">
          <OrganizationAssetForm
            drawerView={true}
            processing={processing}
            organization={organization}
            onSubmit={async (data) => {
              await createOrganization(data);
              closeDrawer("create-organization-asset-form");
              openDrawer("organization-asset-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
