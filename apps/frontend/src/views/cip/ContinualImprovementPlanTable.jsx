import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Loading from "@/components/Loader/Loading";
import SearchInput from "@/components/SearchInput/search-input";
import { Pagination } from "@/components/Pagination/pagination";
import ContinualImprovementPlanForm from "@/views/cip/ContinualImprovementPlanForm";
import SearchableCompliance from "@/views/compliance/searchableList/components/Index";
import SearchableDocument from "@/views/documentManagement/searchableList/components/Index";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import AnalyticalAssistant from "../shared/ai/analyticalAssistant/Index";
import CIPFilter from "./CIPFilter";
import CipDrawerDetail from "./CipDrawerDetail";
import CipDrawerForm from "./CipDrawerForm";
import CipToolBar from "./CipToolBar";
import CreateCip from "./CreateCip";
import RowActions from "./RowActions";
import USER_ACTIONS from "./actions";
import { useCip } from "./store";
const defaultdata = [["No data found"]];

const ReactTables = () => {
  let {
    cips: dataTable,
    processing,
    CIPQueryTools,
    visitCip,
    visitingCip,
    linkISOControl,
    removeISOControl,
    controlsOnVisitingCip,
    createCip,
    reloadCip,
  } = useCip();
  let { handleCreateTask } = useTask();
  dataTable = dataTable ? dataTable : defaultdata;
  let { openDrawer, closeDrawer } = useDrawer();

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "reference",
        header: "Reference",
        size: 200,
      },
      {
        accessorKey: "group",
        header: "Business unit",
        cell: ({ row }) => row.original?.group?.name || "N/A",
        size: 200,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 400,
      },
      {
        accessorKey: "implemented.status",
        header: "Status",
        cell: ({ row }) => (
          <BadgeStatus status={row?.original?.implemented?.status} />
        ),
        size: 200,
      },
      {
        accessorKey: "created.on",
        header: "Raised",
        cell: ({ row }) => (
          <TimeDateComponent date={row?.original?.created?.on} />
        ),
        size: 200,
      },
      {
        accessorKey: "owner.name",
        header: "Assigned owner",
        cell: ({ row }) => row?.original?.owner?.name || "N/A",
      },
      {
        id: "actions",
        accessorKey: "",
        size: 50,
        header: () => <div className="dt-row-actions">Actions</div>,
        cell: ({ row }) => <RowActions row={row} />,
      },
    ];
  }, [processing]);
  return (
    <ContentWrapper>
      <Box>
        {alert}
        <SearchableDocument moduleTypes={["cips"]} />
        <h4 className="mb-3">OFI</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={CIPQueryTools} />
              </div>
              <div className="col-md-4">
                <CIPFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateCip />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_CIPS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={Array.isArray(dataTable) ? dataTable : []}
                columns={columns}
                disableMultiSelection={true}
                disableColumnResize={false}
                onRowClick={(row) => {
                  const cip = row?.original;
                  if (cip) {
                    visitCip(cip);
                    openDrawer("cip-detail");
                  }
                }}
                defaultSize={375}
                minSize={80}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={CIPQueryTools?.toolState?.pagination?.totalResults}
              currentPage={
                CIPQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                CIPQueryTools?.handlePagination({ page });
              }}
              size={CIPQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}
        <DrawerRight
          drawerId="cip-detail"
          onDrawerClose={() => {
            visitCip(null);
          }}
          toolbar={<CipToolBar />}
        >
          {<CipDrawerDetail />}
        </DrawerRight>
        {/* Edit Risk Form Drawer */}
        <DrawerRight drawerId="edit-cip-form">
          {visitingCip && <CipDrawerForm />}
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
            preSelectedControls={controlsOnVisitingCip}
          />
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingCip && (
            <TaskForm
              drawerView={true}
              module={visitingCip._id}
              moduleType="cips"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadCip();
              }}
            />
          )}
        </DrawerRight>

        <DrawerRight drawerId="create-cip">
          <ContinualImprovementPlanForm
            drawerView={true}
            onSubmit={async (formData) => {
              const mutationData = {
                owner: formData.owner.value,
                group: formData.group.value,
                title: formData.title,
                opportunityForImprovement: formData.opportunityForImprovement,
                cost: formData.cost,
                attachments: formData.attachments,
              };
              await createCip(mutationData);
              closeDrawer("create-cip");
              openDrawer("cip-detail");
            }}
          />
        </DrawerRight>
        <DrawerRight drawerId="cip-analyser">
          {visitCip && (
            <AnalyticalAssistant
              template={null}
              source={{
                moduleType: "cips",
                moduleId: visitingCip?._id,
              }}
              data={visitingCip}
            />
          )}
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReactTables;
