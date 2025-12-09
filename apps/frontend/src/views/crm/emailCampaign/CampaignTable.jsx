import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import useAlerts from "@/hooks/useAlerts";
import React from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import CampaignDrawerDetail from "./CampaignDrawerDetail";
import CampaignDrawerForm from "./CampaignDrawerForm";
import CampaignForm from "./CampaignForm";
import CampaignToolBar from "./CampaignToolBar";
import CreateCampaign from "./CreateCampaign";
import USER_ACTIONS from "./actions";
import { useCampaign } from "./store";
import Loading from "@/components/Loader/Loading";
import Box from "@/components/Box/Index";
import { Pagination } from "@/components/Pagination/pagination";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
const defaultdata = [["No data found"]];

const CampaignTable = () => {
  let {
    campaigns: dataTable,
    processing,
    visitCampaign,
    visitingCampaign,
    saveAndSendCampaign,
    createCampaign,
    queryHandlers,
  } = useCampaign();
  let { alert } = useAlerts();
  let { openDrawer } = useDrawer();

  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForCampaigns = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
      size: 140,
    },
    {
      accessorKey: "group",
      header: () => <p>Business unit</p>,
      cell: ({ row }) =>
        row.original?.group?.name ? row.original?.group?.name : "N/A",
      size: 160,
    },
    {
      accessorKey: "subject",
      header: () => <p>Subject</p>,
      size: 220,
    },
    {
      accessorKey: "target",
      header: () => <p>Target</p>,
      cell: ({ row }) => row.original.target.map((tr) => `${tr} `),
      size: 170,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) => <BadgeStatus status={row.original.status} />,
      size: 250,
    },
    {
      accessorKey: "createdOn",
      header: () => <p>Created on</p>,
      cell: ({ row }) => (
        <TimeDateComponent
          date={row.original.created && row.original.created.on}
        />
      ),
      size: 200,
    },
    {
      accessorKey: "created_by",
      header: () => <p>Created by</p>,
      cell: ({ row }) => row.original.created?.by?.name,
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 100,
    },
  ];

  return (
    <Box>
      <h4 className="mb-3">Email campaigns</h4>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <SearchInput queryHandlers={queryHandlers} />
            </div>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <CreateCampaign />
        </div>
      </div>
      {alert}
      {processing[USER_ACTIONS.LOAD_EMAILS].status ? (
        <Loading height={600} />
      ) : (
        <>
          <div>
            <DataTable
              data={dataTable}
              columns={columnsForCampaigns || []}
              disableMultiSelection={true}
              disableColumnResize={false}
              defaultSize={375}
              minSize={80}
              onRowClick={({ original }) => {
                visitCampaign(original);
                openDrawer("campaign-detail");
              }}
              columnVisibility={{}}
            />
          </div>
          <Pagination
            containerClassName="pull-right my-2"
            totalResults={queryHandlers?.toolState?.pagination?.totalResults}
            currentPage={queryHandlers?.toolState?.pagination?.currentPage || 1}
            onPageChange={(page) => {
              queryHandlers?.handlePagination({ page });
            }}
            size={queryHandlers?.toolState?.pagination?.size || 10}
          />
        </>
      )}
      <DrawerRight
        drawerId="campaign-detail"
        onDrawerClose={() => {
          visitCampaign(null);
        }}
        toolbar={<CampaignToolBar />}
      >
        {<CampaignDrawerDetail />}
      </DrawerRight>
      <DrawerRight drawerId="edit-campaign-form">
        {visitingCampaign && <CampaignDrawerForm />}
      </DrawerRight>
      <DrawerRight drawerId="create-campaign">
        <CampaignForm
          drawerView={true}
          onSubmit={async (data) => {
            await createCampaign(data);
          }}
          onCreateAndSend={async (data) => {
            await saveAndSendCampaign(data);
          }}
        />
      </DrawerRight>
    </Box>
  );
};

export default CampaignTable;
