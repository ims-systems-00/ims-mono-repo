import Loading from "@/components/Loader/Loading";
import { DrawerRight, useDrawer, DataTable } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import Index from "@/views/tagsAndCategoriesManager/Index";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import AnalyticalAssistant from "../shared/ai/analyticalAssistant/Index";
import { incident_analyser } from "../shared/ai/analyticalAssistant/templates";
import CreateIncident from "./CreateIncident";
import IncidentDrawerDetail from "./IncidentDrawerDetail";
import IncidentDrawerForm from "./IncidentDrawerForm";
import IncidentFilter from "./IncidentFilter";
import IncidentForm from "./IncidentForm";
import IncidentToolBar from "./IncidentToolBar";
import USER_ACTIONS from "./actions";
import { useIncident } from "./store";
import Box from "@/components/Box/Index";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { TourStep } from "../../components/Tour";
const defaultdata = [["No data found"]];

const IncidentsTable = () => {
  let {
    incidents: dataTable,
    processing,
    visitingIncident,
    visitIncident,
    IncidentQueryTools,
    linkISOControl,
    removeISOControl,
    createIncident,
    controlsOnVisitingIncident,
    reloadIncident,
    suppliers,
  } = useIncident();
  let { handleCreateTask } = useTask();
  let { openDrawer, closeDrawer } = useDrawer();
  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForIncidents = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
      size: 140,
    },
    {
      accessorKey: "group",
      header: () => <p>Business Unit</p>,
      cell: ({ row }) =>
        row.original?.group?.name ? row.original?.group?.name : "N/A",
      size: 180,
    },
    {
      accessorKey: "title",
      header: () => <p>Title</p>,
    },
    {
      accessorKey: "priority",
      header: () => <p>Priority</p>,
      cell: ({ row }) => (
        <span
          className={
            row?.original?.priority === "P4"
              ? "text-success"
              : row?.original?.priority === "P3"
                ? "text-info"
                : row?.original?.priority === "P3"
                  ? "text-warning"
                  : "text-danger"
          }
        >
          {row?.original?.priority}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) =>
        row?.original?.resolved.status ? (
          <BadgeStatus status="Resolved" />
        ) : !row?.original?.resolved.status &&
          row?.original?.escalated.status ? (
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
      accessorKey: "owner.name",
      header: () => <p>Incident Owner</p>,
      cell: ({ row }) => <span>{row?.original?.owner?.name}</span>,
      size: 200,
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 150,
    },
  ];

  return (
    <ContentWrapper>
      <Box>
        <SearchableDocument moduleTypes={["incidents"]} />
        <h4 className="mb-3">Incidents</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={IncidentQueryTools} />
              </div>
              <div className="col-md-4">
                <IncidentFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateIncident />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_INCIDENTS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <TourStep stepId="create-incident-table">
                <DataTable
                  data={dataTable}
                  columns={columnsForIncidents || []}
                  disableMultiSelection={true}
                  disableColumnResize={false}
                  defaultSize={375}
                  minSize={80}
                  onRowClick={({ original }) => {
                    visitIncident(original);
                    openDrawer("incident-detail");
                  }}
                  columnVisibility={{}}
                />
              </TourStep>
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                IncidentQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                IncidentQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                IncidentQueryTools?.handlePagination({ page });
              }}
              size={IncidentQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="incident-detail"
          onDrawerClose={() => {
            visitIncident(null);
          }}
          toolbar={<IncidentToolBar />}
        >
          {<IncidentDrawerDetail />}
        </DrawerRight>
        <DrawerRight drawerId="edit-incident-form">
          {visitingIncident && <IncidentDrawerForm />}
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
            preSelectedControls={controlsOnVisitingIncident}
          />
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingIncident && (
            <TaskForm
              drawerView={true}
              module={visitingIncident._id}
              moduleType="audits"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadIncident();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-incident">
          <IncidentForm
            drawerView={true}
            suppliers={suppliers}
            onSubmit={async (formData) => {
              const mutationData = {
                group: formData.group.value,
                title: formData.title,
                description: formData.description,
                methodOfNotification: formData.methodOfNotification,
                owner: formData.owner.value,
                privacy: formData.privacy ? "Organisational" : "Business unit",
                priority: formData.priority.value,
                affectedService: formData.affectedService,
                attachments: formData.attachments,
                tagsAndCategories: formData.tagsAndCategories.value,
              };
              await createIncident(mutationData);
              closeDrawer("create-incident");
              openDrawer("incident-detail");
            }}
          />
        </DrawerRight>
        <DrawerRight drawerId="incident-analyser">
          {visitingIncident && (
            <AnalyticalAssistant
              template={incident_analyser}
              source={{
                moduleType: "incidents",
                module: visitingIncident?._id,
              }}
              data={visitingIncident}
              onCreateNewTask={reloadIncident}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="tags">
          <Index applicableModules="incidents" />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default IncidentsTable;
