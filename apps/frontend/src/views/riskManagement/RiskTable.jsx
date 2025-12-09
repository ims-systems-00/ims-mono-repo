import Loading from "@/components/Loader/Loading";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import Index from "@/views/tagsAndCategoriesManager/Index";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import SearchableCompliance from "../compliance/searchableList/components/Index";
import AnalyticalAssistant from "../shared/ai/analyticalAssistant/Index";
import { risk_analyser } from "../shared/ai/analyticalAssistant/templates";
import RiskDrawerDetail from "./RiskDrawerDetail";
import RiskDrawerForm from "./RiskDrawerForm";
import RiskForm from "./RiskForm";
import RiskToolBar from "./RiskToolBar";
import USER_ACTIONS from "./actions";
import useRisk from "./store/useRisk";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import CreateRisk from "./CreateRisk";
import RiskFilter from "./RiskFilter";
import SearchInput from "@/components/SearchInput/search-input";
const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let {
    risks: dataTable,
    processing,
    isMitigatedRisk,
    RiskQueryTools,
    visitRisk,
    visitingRisk,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingRisk,
    createRisk,
    reloadRisk,
  } = useRisk();
  let { handleCreateTask } = useTask();
  let { organisation } = React.useContext(SuperGlobalContext);
  dataTable = dataTable ? dataTable : defaultdata;
  let { openDrawer, closeDrawer } = useDrawer();

  const columnsForRisks = [
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
      accessorKey: "title",
      header: () => <p>Title</p>,
    },
    {
      accessorKey: "score",
      header: () => <p>Risk Score</p>,
      cell: ({ row }) => (
        <span
          className={
            row.original.score.total.current <= 10
              ? "text-success"
              : row.original.score.total.current > 10 &&
                row.original.score.total.current <= 15
              ? "text-warning"
              : "text-danger"
          }
        >
          {row.original.score.total.current}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) =>
        row.original.mitigated.status ? (
          <BadgeStatus status="Mitigated" />
        ) : row.original.accepted.status ? (
          <BadgeStatus status="Accepted" />
        ) : (!isMitigatedRisk(row?.original) ||
            !row.original?.accepted?.status) &&
          row.original.escalated.status ? (
          <BadgeStatus status="Escalated" />
        ) : (
          <BadgeStatus status="Open" />
        ),
      size: 150,
    },

    {
      accessorKey: "raised",
      header: () => <p>Raised</p>,
      cell: ({ row }) => <TimeDateComponent date={row?.original.created.on} />,
      size: 270,
    },

    {
      accessorKey: "owner",
      header: () => <p>Risk Owner</p>,
      cell: ({ row }) => <span>{row?.original?.owner?.name}</span>,

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
        <h4 className="mb-3">Risks</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={RiskQueryTools} />
              </div>
              <div className="col-md-4">
                <RiskFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateRisk />
          </div>
        </div>
        {processing[USER_ACTIONS.LOAD_RISKS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForRisks || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitRisk(original);
                  openDrawer("risk-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={RiskQueryTools?.toolState?.pagination?.totalResults}
              currentPage={
                RiskQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                RiskQueryTools?.handlePagination({ page });
              }}
              size={RiskQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        {/* Detail Drawer */}
        <DrawerRight
          drawerId="risk-detail"
          onDrawerClose={() => {
            visitRisk(null);
          }}
          toolbar={<RiskToolBar />}
        >
          {<RiskDrawerDetail />}
        </DrawerRight>
        {/* Edit Risk Form Drawer */}
        <DrawerRight drawerId="edit-risk-form">
          {visitingRisk && <RiskDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="risk-analyser">
          {visitingRisk && (
            <AnalyticalAssistant
              template={risk_analyser}
              source={{
                moduleType: "risks",
                module: visitingRisk?._id,
              }}
              data={{
                organisation,
                risk: visitingRisk,
              }}
              onCreateNewTask={reloadRisk}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="compliance-control-picker">
          <SearchableCompliance
            onNewSelection={(data) =>
              linkISOControl({
                controls: [data?.control?._id],
                toolkits: [],
              })
            }
            onDeselection={(data) => {
              removeISOControl({
                controls: [data?.control?._id],
                toolkits: [],
              });
            }}
            preSelectedControls={controlsOnVisitingRisk}
          />
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingRisk && (
            <TaskForm
              drawerView={true}
              module={visitingRisk._id}
              moduleType="risks"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadRisk();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-risk">
          <RiskForm
            drawerView={true}
            onSubmit={async (formData) => {
              const mutationData = {
                group: formData.group.value,
                type: formData.type.value,
                owner: formData.owner.value,
                asset: formData.asset.value,
                title: formData.title,
                description: formData.description,
                likelihood: parseInt(formData.likelihood.value),
                consequence: parseInt(formData.consequence.value),
                attachments: formData.attachments,
                tagsAndCategories: formData.tagsAndCategories.value,
              };
              await createRisk(mutationData);
              closeDrawer("create-risk");
              openDrawer("risk-detail");
            }}
          />
        </DrawerRight>
        <DrawerRight drawerId="tags">
          <Index applicableModules="risks" />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
