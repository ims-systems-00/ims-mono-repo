import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import AnalyticalAssistant from "../shared/ai/analyticalAssistant/Index";
import { audit_analyser } from "../shared/ai/analyticalAssistant/templates";
import AuditDrawerDetail from "./AuditDrawerDetails";
import AuditDrawerUpdateForm from "./AuditDrawerUpdateForm";
import AuditForm from "./AuditForm";
import AuditToolBar from "./AuditToolbar";
import ExtractReport from "./ExtractReport";
import USER_ACTIONS from "./actions";
import useAudits from "./store/useAudits";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import AuditFilter from "./AuditFilter";
import CreateAudit from "./CreateAudit";
const defaultdata = [["No data found"]];

const ReactTables = ({ ...props }) => {
  let {
    audits: dataTable,
    processing,
    AuditQueryTools,
    visitAudit,
    visitingAudit,
    auditType,
    linkISOControl,
    removeISOControl,
    createAudit,
    controlsOnVisitingAudit,
    sendAuditReport,
    reloadAudit,
  } = useAudits();
  let { handleCreateTask } = useTask();
  let { openDrawer, closeDrawer } = useDrawer();
  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForAudits = [
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
      size: 180,
    },
    {
      accessorKey: "title",
      header: () => <p>Title</p>,
      size: 350,
    },

    {
      accessorKey: "complianceBody.name",
      header: () => <p>Compliance Body</p>,
      size: 160,
    },

    {
      accessorKey: "auditor.name",
      header: () => <p>Auditor</p>,
      size: 250,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) => (
        <>
          {row?.original?.completed.status ? (
            <BadgeStatus status="Completed" />
          ) : (
            <BadgeStatus status="Scheduled" />
          )}
        </>
      ),
      size: 160,
    },

    {
      accessorKey: "time",
      header: () => <p>Timestamp</p>,
      cell: ({ row }) => <TimeDateComponent date={row?.original?.startDate} />,
      size: 170,
    },

    {
      accessorKey: "interval",
      header: () => <p>Interval</p>,
      size: 100,
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
        <h4 className="mb-3">{auditType} Audit</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={AuditQueryTools} />
              </div>
              <div className="col-md-4">
                <AuditFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateAudit />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_AUDITS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForAudits || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitAudit(original);
                  openDrawer("audit-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                AuditQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                AuditQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                AuditQueryTools?.handlePagination({ page });
              }}
              size={AuditQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="audit-detail"
          onDrawerClose={() => {
            visitAudit(null);
          }}
          toolbar={<AuditToolBar />}
        >
          <AuditDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-audit-form">
          {visitingAudit && <AuditDrawerUpdateForm />}
        </DrawerRight>
        <DrawerRight drawerId="send-audit-report">
          {visitingAudit && (
            <ExtractReport
              drawerView={true}
              onSubmit={async (data) => {
                await sendAuditReport(data);
                closeDrawer("send-audit-report");
                openDrawer("audit-detail");
              }}
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
            preSelectedControls={controlsOnVisitingAudit}
          />
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingAudit && (
            <TaskForm
              drawerView={true}
              module={visitingAudit._id}
              moduleType="audits"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadAudit();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-audit">
          <AuditForm
            type={auditType}
            drawerView={true}
            onSubmit={async (data) => {
              await createAudit(data);
              closeDrawer("create-audit");
              openDrawer("audit-detail");
            }}
          />
        </DrawerRight>
        <DrawerRight drawerId="audit-analyser">
          {visitingAudit && (
            <AnalyticalAssistant
              template={audit_analyser}
              source={{
                moduleType: "audits",
                module: visitingAudit?._id,
              }}
              data={visitingAudit}
              onCreateNewTask={reloadAudit}
            />
          )}
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
