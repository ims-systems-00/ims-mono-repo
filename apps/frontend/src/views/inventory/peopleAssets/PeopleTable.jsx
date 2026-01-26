import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import CreatePeopleAsset from "./CreatePeopleAsset";
import PeopleAssetDrawerDetail from "./PeopleAssetDrawerDetail";
import PeopleAssetDrawerForm from "./PeopleAssetDrawerForm";
import PeopleAssetToolbar from "./PeopleAssetToolbar";
import USER_ACTIONS from "./actions";
import { usePeopleAssets } from "./store";
import PeopleAssetForm from "./PeopleAssetForm";
import PeopleFilter from "./PeopleFilter";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import { TourStep } from "../../../components/Tour";

const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let { closeDrawer, openDrawer } = useDrawer();
  let {
    peopleAssets,
    processing,
    PeopleQueryTools,
    visitPeople,
    createPeople,
    people,
  } = usePeopleAssets();

  peopleAssets = peopleAssets ? peopleAssets : defaultdata;

  const columnsForPeople = [
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
      header: () => <p>Name</p>,
      size: 350,
    },

    {
      accessorKey: "role",
      header: () => <p>Role</p>,
      size: 250,
    },

    {
      accessorKey: "responsibility",
      header: () => <p>Responsibility</p>,
      size: 300,
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
        <h4 className="mb-3">Peoples</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={PeopleQueryTools} />
              </div>
              <div className="col-md-4">
                <PeopleFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreatePeopleAsset />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_PEOPLES].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <TourStep stepId="people-table">
                <DataTable
                  data={peopleAssets}
                  columns={columnsForPeople || []}
                  disableMultiSelection={true}
                  disableColumnResize={false}
                  defaultSize={375}
                  minSize={80}
                  onRowClick={({ original }) => {
                    visitPeople(original);
                    openDrawer("people-asset-detail");
                  }}
                  columnVisibility={{}}
                />
              </TourStep>
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                PeopleQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                PeopleQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                PeopleQueryTools?.handlePagination({ page });
              }}
              size={PeopleQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          onDrawerClose={() => {
            visitPeople(null);
          }}
          toolbar={<PeopleAssetToolbar />}
          drawerId="people-asset-detail"
        >
          <PeopleAssetDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-people-form">
          {people && <PeopleAssetDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="create-people-asset-form">
          <PeopleAssetForm
            drawerView={true}
            processing={processing}
            onSubmit={async (data) => {
              await createPeople(data);
              closeDrawer("create-people-asset-form");
              openDrawer("people-asset-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
